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
import { SynthesisClaudeService, ClaudeResult, StockResult } from '@shared/services/synthesis-claude.service';
import { SynthesisService } from '@shared/services/synthesis.service';
import { ReportHistoryService } from '@shared/services/report-history.service';
import { frenchDate } from '@shared/utils/french-date';

export const SYNTHESIS_OPTIONS = [
  { id: 'PENDING',         label: '1 — Échantillons en attente par plateforme',                   icon: 'hourglass_empty' },
  { id: 'STOCK_END',       label: '2 — Intrants disponibles en fin de période par plateforme',    icon: 'inventory_2' },
  { id: 'RECEIVED_TESTED', label: '3 — Échantillons reçus & testés (Plasma / PSC / EID)',         icon: 'science' },
  { id: 'FAILED',          label: '4 — Échantillons échoués et en attente de retesting',          icon: 'report_problem' },
  { id: 'STOCK_WEEKLY',    label: '5 — Stock disponible par site et par semaine',                 icon: 'warehouse' },
  { id: 'TAT',             label: '6 — Délai moyen d\'exécution des analyses (TAT)',              icon: 'timer' },
  { id: 'REJECTIONS',      label: '7 — Qualité des échantillons et rejets par catégorie',         icon: 'block' },
  { id: 'BREAKDOWNS',      label: '8 — Interruptions de service et pannes',                       icon: 'build_circle' },
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

  private readonly claudeService  = inject(SynthesisClaudeService);
  private readonly synthesisService = inject(SynthesisService);
  private readonly historyService   = inject(ReportHistoryService);

  readonly options = SYNTHESIS_OPTIONS;

  account?: any;
  periods?: any[];
  start_Date = '';
  end_Date   = '';

  loading      = false;
  enableSubmit = true;

  result:      ClaudeResult | null   = null;
  stockResult: StockResult  | null   = null;
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
    this.form!.get('start_period')?.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(v => { this.start_Date = this.resolvePeriodDate(v, 'start'); this.checkPeriod(); });

    this.form!.get('end_period')?.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(v => { this.end_Date = this.resolvePeriodDate(v, 'end'); this.checkPeriod(); });

    forkJoin([
      this.historyService.getEquipments(),
    ]).subscribe(([accountRes]) => {
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

  private checkPeriod(): void {
    if (this.start_Date && this.end_Date) {
      this.enableSubmit = this.synthesisService.isPeriodValid(this.end_Date, this.start_Date);
      if (!this.enableSubmit) {
        this.toast.error('La date de fin doit être supérieure à la date de début.');
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

    this.result      = null;
    this.stockResult = null;
    this.loading     = true;

    const optionId = this.form.value.synthesis_option;
    this.activeOption = this.options.find(o => o.id === optionId) ?? null;

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

  // ── EXPORT ─────────────────────────────────────────────────────────────────
  async exportExcel(): Promise<void> {
    const wb   = new Workbook();
    const ws   = wb.addWorksheet('Synthèse');
    const table: HTMLTableElement = this.tableContainer.nativeElement.querySelector('table');
    if (!table) return;

    Array.from(table.rows).forEach((row, ri) => {
      const exRow = ws.addRow([]);
      let col = 1;
      Array.from(row.cells).forEach(cell => {
        const ec    = exRow.getCell(col);
        ec.value    = cell.innerText;
        ec.border   = { top:{style:'thin'}, left:{style:'thin'}, bottom:{style:'thin'}, right:{style:'thin'} };
        ec.alignment = { vertical:'middle', horizontal:'center', wrapText:true };
        const span  = cell.colSpan || 1;
        if (span > 1) {
          try { ws.mergeCells(ri+1, col, ri+1, col+span-1); } catch {}
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

  // ── UTILS ──────────────────────────────────────────────────────────────────
  uniqueGroups(rows: ClaudeResult['rows']): string[] {
    const seen = new Set<string>();
    rows.forEach(r => r.group && seen.add(r.group));
    return [...seen];
  }

  rowsForGroup(rows: ClaudeResult['rows'], group: string) {
    return rows.filter(r => r.group === group);
  }

  rowsWithoutGroup(rows: ClaudeResult['rows']) {
    return rows.filter(r => !r.group);
  }

  sumForPeriod(rows: ClaudeResult['rows'], period: string): number {
    return rows.reduce((s, r) => s + (r.periodValues[period] ?? 0), 0);
  }

  grandTotal(rows: ClaudeResult['rows']): number {
    return rows.reduce((s, r) => s + r.total, 0);
  }

  stockTotal(row: any, structures: any[]): number {
    return structures.reduce((s: number, st: any) => s + (row.siteValues[st.id] ?? 0), 0);
  }
}
