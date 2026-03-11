/* eslint-disable @typescript-eslint/prefer-for-of */
import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnDestroy, OnInit, ViewChild, inject } from '@angular/core';
import { FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatOptionModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { TranslateModule } from '@ngx-translate/core';
import { forkJoin, takeUntil } from 'rxjs';
import { saveAs } from 'file-saver';
import { Workbook } from 'exceljs';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

import { FormBaseComponent } from '@shared';
import {
  SynthesisClaudeService,
  ClaudeResult,
  ClaudeRow,
  StockResult,
  TransferRow,
} from '@shared/services/synthesis-claude.service';
import { SynthesisService } from '@shared/services/synthesis.service';
import { ReportHistoryService } from '@shared/services/report-history.service';
import { frenchDate } from '@shared/utils/french-date';

export const SYNTHESIS_OPTIONS = [
  { id: 'PENDING',         label: '1 — Échantillons en attente par plateforme',                icon: 'hourglass_empty' },
  { id: 'STOCK_END',       label: '2 — Intrants disponibles en fin de période par plateforme', icon: 'inventory_2' },
  { id: 'RECEIVED_TESTED', label: '3 — Échantillons reçus & testés (Plasma / PSC / EID)',      icon: 'science' },
  { id: 'FAILED',          label: '4 — Échantillons échoués et en attente de retesting',       icon: 'report_problem' },
  { id: 'STOCK_WEEKLY',    label: '5 — Stock disponible par site et par semaine',              icon: 'warehouse' },
  { id: 'TAT',             label: '6 — Délai moyen d\'exécution des analyses (TAT)',           icon: 'timer' },
  { id: 'REJECTIONS',      label: '7 — Qualité des échantillons et rejets par catégorie',      icon: 'block' },
  { id: 'BREAKDOWNS',      label: '8 — Interruptions de service et pannes',                    icon: 'build_circle' },
  { id: 'INTRANTS_USED',   label: '9 — Quantité d\'intrants utilisés par site et par période', icon: 'bar_chart' },
  { id: 'TRANSFERS',           label: '10 — Listing des transferts d\'échantillons entre sites',         icon: 'swap_horiz' },
  { id: 'INTRANTS_USED_PIVOT', label: '11 — Quantité d\'intrants utilisés par plateforme (pivot sites)', icon: 'bar_chart' },
];

@Component({
  selector: '[app-synthesis-claude]',
  templateUrl: './synthesis-claude.html',
  styleUrls: ['./synthesis-claude.scss'],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatOptionModule,
    MatSelectModule,
    TranslateModule,
  ],
})
export class SynthesisClaude extends FormBaseComponent implements OnInit, OnDestroy {

  form: FormGroup | undefined;

  private readonly claudeService   = inject(SynthesisClaudeService);
  private readonly synthesisService = inject(SynthesisService);
  private readonly historyService   = inject(ReportHistoryService);

  readonly options = SYNTHESIS_OPTIONS;

  account?: any;
  periods?: any[];
  start_Date = '';
  end_Date   = '';

  /** true when STOCK_END is selected → force start = end period */
  isStockEnd = false;

  loading      = false;
  enableSubmit = true;

  result:             ClaudeResult | null   = null;
  stockResult:        StockResult  | null   = null;
  intrantsUsedPivot:  StockResult  | null   = null;
  transferRows:       TransferRow[] | null  = null;
  activeOption: typeof SYNTHESIS_OPTIONS[number] | null = null;

  @ViewChild('tableContainer') tableContainer!: ElementRef;

  constructor() {
    super();
    this.form = this.buildFormFromArray([
      { key: 'synthesis_option', defaultValue: '', validators: [Validators.required] },
      { key: 'equipment',        defaultValue: '', validators: [Validators.required] },
      { key: 'structure',        defaultValue: '', validators: [Validators.required] },
      { key: 'start_period',     defaultValue: '', validators: [Validators.required] },
      { key: 'end_period',       defaultValue: '', validators: [Validators.required] },
    ]);
  }

  ngOnInit(): void {
    // Detect STOCK_END option → lock end_period = start_period
    this.form!.get('synthesis_option')?.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((opt: string) => {
        this.isStockEnd = opt === 'STOCK_END';
        if (this.isStockEnd) {
          const sp = this.form!.get('start_period')?.value;
          if (sp) {
            this.form!.get('end_period')?.setValue(sp, { emitEvent: false });
            this.end_Date = this.start_Date;
          }
        }
      });

    // start_period changes
    this.form!.get('start_period')?.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((v: string) => {
        this.start_Date = this.resolvePeriodDate(v, 'start');
        if (this.isStockEnd) {
          this.form!.get('end_period')?.setValue(v, { emitEvent: false });
          this.end_Date = this.resolvePeriodDate(v, 'end');
        }
        this.checkPeriod();
      });

    // end_period changes
    this.form!.get('end_period')?.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((v: string) => {
        this.end_Date = this.resolvePeriodDate(v, 'end');
        this.checkPeriod();
      });

    forkJoin([this.historyService.getEquipments()]).subscribe(([accountRes]: [any]) => {
      if (accountRes?.data) this.account = accountRes.data.account;
    });

    this.synthesisService.getPeriods().subscribe((res: any) => {
      if (res?.data) this.periods = res.data.periods;
    });
  }

  private resolvePeriodDate(periodName: string, which: 'start' | 'end'): string {
    const p = this.periods?.find((x: any) => x.periodName === periodName);
    if (!p) return '';
    return frenchDate(which === 'start' ? p.startDate : p.endDate);
  }

  /** Return raw ISO date for a period (used for fetchTransactions) */
  private periodIsoDate(periodName: string, which: 'start' | 'end'): string {
    const p = this.periods?.find((x: any) => x.periodName === periodName);
    if (!p) return '';
    return which === 'start' ? p.startDate : p.endDate;
  }

  private checkPeriod(): void {
    if (this.start_Date && this.end_Date) {
      this.enableSubmit = this.synthesisService.isPeriodValid(this.end_Date, this.start_Date);
      if (!this.enableSubmit) {
        this.toast.error('La date de fin doit être supérieure ou égale à la date de début.');
      }
    }
  }

  get equipmentList() { return this.historyService.getEquipmentList(this.account); }

  get structureList() {
    const eqId = this.form?.get('equipment')?.value;
    return this.account?.structures?.filter((s: any) =>
      s.equipments?.some((eq: any) => eq.id === eqId)
    ) ?? [];
  }

  private structureIds(): number[] {
    const val = this.form!.value.structure;
    return val === 'all'
      ? this.structureList.map((s: any) => Number(s.id))
      : [Number(val)];
  }

  onSubmit(): void {
    if (!this.form?.valid || !this.enableSubmit) return;

    this.result            = null;
    this.stockResult       = null;
    this.intrantsUsedPivot = null;
    this.transferRows      = null;
    this.loading           = true;

    const optionId = this.form.value.synthesis_option;
    this.activeOption = this.options.find(o => o.id === optionId) ?? null;

    // ── REQ 10: Transferts (separate query) ──────────────────────────────────
    if (optionId === 'TRANSFERS') {
      const startIso = this.periodIsoDate(this.form.value.start_period, 'start');
      const endIso   = this.periodIsoDate(this.form.value.end_period,   'end');
      const ids      = this.structureIds().map(String);
      this.claudeService.fetchTransactions(startIso, endIso).subscribe({
        next: (txs: any) => {
          this.transferRows = this.claudeService.computeTransfers(txs, ids);
          this.loading = false;
        },
        error: () => {
          this.toast.error('Erreur lors du chargement des transferts.');
          this.loading = false;
        },
      });
      return;
    }

    // ── Tous les autres: requête reports ─────────────────────────────────────
    const request = {
      structure_ids: this.structureIds(),
      equipment:     Number(this.form.value.equipment),
      start_date:    this.start_Date,
      end_date:      this.end_Date,
    };

    this.claudeService.fetchReports(request).subscribe({
      next: (res: any) => {
        const reports = res?.data?.reportsBySupervisedStructuresAndEquipmentWithinDateRange ?? [];
        if (optionId === 'STOCK_END') {
          this.stockResult = this.claudeService.computeStock(reports);
        } else if (optionId === 'INTRANTS_USED_PIVOT') {
          this.intrantsUsedPivot = this.claudeService.computeStockUsedPivot(reports);
        } else {
          this.result = this.claudeService.compute(optionId, reports);
        }
        this.loading = false;
      },
      error: () => {
        this.toast.error('Erreur lors du chargement des données.');
        this.loading = false;
      },
    });
  }

  ngOnDestroy(): void {}

  // ── EXPORT ──────────────────────────────────────────────────────────────────
  async exportExcel(): Promise<void> {
    const wb  = new Workbook();
    const ws  = wb.addWorksheet('Synthèse');
    const el: HTMLElement = this.tableContainer.nativeElement;
    const table = el.querySelector('table');
    if (!table) return;

    Array.from(table.rows).forEach((row, ri) => {
      const exRow = ws.addRow([]);
      let col = 1;
      Array.from(row.cells).forEach(cell => {
        const ec    = exRow.getCell(col);
        ec.value    = cell.innerText;
        ec.border   = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
        ec.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
        const span  = cell.colSpan || 1;
        if (span > 1) {
          try { ws.mergeCells(ri + 1, col, ri + 1, col + span - 1); } catch {}
        }
        col += span;
      });
    });

    const buf = await wb.xlsx.writeBuffer();
    saveAs(new Blob([buf]), `synthese_${this.activeOption?.id ?? 'export'}.xlsx`);
  }

  async exportPDF(): Promise<void> {
    const el     = this.tableContainer.nativeElement;
    const canvas = await html2canvas(el, { scale: 2 });
    const pdf    = new jsPDF('landscape', 'mm', 'a4');
    const w      = 297;
    const h      = (canvas.height * w) / canvas.width;
    let left     = h;
    let pos      = 0;
    pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, pos, w, h);
    left -= 210;
    while (left > 0) {
      pos = left - h;
      pdf.addPage();
      pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, pos, w, h);
      left -= 210;
    }
    pdf.save(`synthese_${this.activeOption?.id ?? 'export'}.pdf`);
  }

  // ── HELPERS GÉNÉRAUX ────────────────────────────────────────────────────────

  uniqueGroups(rows: ClaudeRow[]): string[] {
    const seen = new Set<string>();
    rows.forEach(r => r.group && seen.add(r.group));
    return [...seen];
  }

  rowsForGroup(rows: ClaudeRow[], group: string): ClaudeRow[] {
    return rows.filter(r => r.group === group);
  }

  sumForPeriod(rows: ClaudeRow[], period: string): number {
    return rows.reduce((s, r) => s + (r.periodValues[period] ?? 0), 0);
  }

  grandTotal(rows: ClaudeRow[]): number {
    return rows.reduce((s, r) => s + r.total, 0);
  }

  stockTotal(row: any, structures: any[]): number {
    return structures.reduce((s: number, st: any) => s + (row.siteValues[st.id] ?? 0), 0);
  }

  // ── HELPERS REQ 1 — sous-totaux par indicateur ──────────────────────────────

  /** Distinct metricLabels within a group (order of first appearance) */
  uniqueMetricLabels(rows: ClaudeRow[], group: string): string[] {
    const seen = new Set<string>();
    rows.filter(r => r.group === group).forEach(r => seen.add(r.metricLabel));
    return [...seen];
  }

  rowsForGroupAndMetric(rows: ClaudeRow[], group: string, metricLabel: string): ClaudeRow[] {
    return rows.filter(r => r.group === group && r.metricLabel === metricLabel);
  }

  // ── HELPERS REQ 3 — sous-totaux Reçus / Testés séparés ─────────────────────

  /** Distinct subGroups within a group (order of first appearance) */
  uniqueSubGroups(rows: ClaudeRow[], group: string): string[] {
    const seen = new Set<string>();
    rows.filter(r => r.group === group && r.subGroup).forEach(r => seen.add(r.subGroup!));
    return [...seen];
  }

  rowsForGroupAndSubGroup(rows: ClaudeRow[], group: string, subGroup: string): ClaudeRow[] {
    return rows.filter(r => r.group === group && r.subGroup === subGroup);
  }

  /** All rows across all groups for a given subGroup (for grand totals) */
  rowsBySubGroup(rows: ClaudeRow[], subGroup: string): ClaudeRow[] {
    return rows.filter(r => r.subGroup === subGroup);
  }

  // ── HELPERS REQ 6 — moyennes TAT ───────────────────────────────────────────

  /** Average of non-zero period values across rows */
  avgForPeriod(rows: ClaudeRow[], period: string): number {
    const vals = rows.map(r => r.periodValues[period] ?? 0).filter(v => v > 0);
    if (!vals.length) return 0;
    return +(vals.reduce((s, v) => s + v, 0) / vals.length).toFixed(1);
  }

  /** Average of non-zero row totals */
  avgTotal(rows: ClaudeRow[]): number {
    const vals = rows.map(r => r.total).filter(v => v > 0);
    if (!vals.length) return 0;
    return +(vals.reduce((s, v) => s + v, 0) / vals.length).toFixed(1);
  }

  // ── UTILS ──────────────────────────────────────────────────────────────────
  isZero = (v: number) => v === 0;
}
