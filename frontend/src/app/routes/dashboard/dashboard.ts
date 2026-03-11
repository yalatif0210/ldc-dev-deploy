import { AfterViewInit, Component, NgZone, OnDestroy, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatOptionModule } from '@angular/material/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { forkJoin } from 'rxjs';

import { AuthService } from '@core/authentication/auth.service';
import { UserRole } from '@core/bootstrap';
import { ReportHistoryService } from '@shared/services/report-history.service';
import { DashboardService, DashboardKpi, StockAlert } from './dashboard.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatSelectModule,
    MatFormFieldModule,
    MatOptionModule,
    MatProgressSpinnerModule,
  ],
})
export class Dashboard implements OnInit, AfterViewInit, OnDestroy {
  private readonly ngZone        = inject(NgZone);
  private readonly authService   = inject(AuthService);
  private readonly historyService = inject(ReportHistoryService);
  private readonly dashService   = inject(DashboardService);

  // ── Rôle ──────────────────────────────────────────────────────────────────
  isAdmin      = false;
  isSupervisor = false;

  // ── Données de compte ─────────────────────────────────────────────────────
  account: any;
  selectedEquipmentId: number | null = null;

  // ── Chargement ────────────────────────────────────────────────────────────
  loading = false;

  // ── Résultats ─────────────────────────────────────────────────────────────
  kpis: DashboardKpi | null        = null;
  stockAlerts: StockAlert[]        = [];
  hasBreakdownData                 = false;

  // ── Charts ApexCharts ────────────────────────────────────────────────────
  private charts: Record<string, ApexCharts | undefined> = {};

  // ── Options pour le sélecteur d'équipement ────────────────────────────────
  get equipmentList() { return this.historyService.getEquipmentList(this.account); }

  ngOnInit(): void {
    this.authService.userRole().subscribe(role => {
      this.isAdmin      = [UserRole.SUPER_ADMIN, UserRole.ADMIN].includes(role as UserRole);
      this.isSupervisor = role === UserRole.SUPERVISOR;
    });

    forkJoin([this.historyService.getEquipments()]).subscribe(([accountRes]: [any]) => {
      if (accountRes?.data) {
        this.account = accountRes.data.account;
        const eqList = this.equipmentList;
        if (eqList.length) {
          this.selectedEquipmentId = eqList[0].id;
          this.loadDashboardData();
        }
      }
    });
  }

  ngAfterViewInit(): void { /* charts rendered after data load */ }

  onEquipmentChange(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    if (!this.selectedEquipmentId || !this.account) return;

    this.loading = true;
    this.destroyAllCharts();

    const structureIds = this.historyService.getAdminSuperivisedStructuresIds(
      this.account.structures ?? []
    );

    this.dashService.loadReports(structureIds, Number(this.selectedEquipmentId)).subscribe({
      next: (reports: any[]) => {
        this.kpis        = this.dashService.computeKpis(reports);
        this.stockAlerts = this.dashService.computeStockAlerts(reports);
        this.loading     = false;
        this.scheduleCharts(reports);
      },
      error: () => { this.loading = false; },
    });
  }

  private scheduleCharts(reports: any[]): void {
    this.ngZone.runOutsideAngular(() => {
      setTimeout(() => this.renderCharts(reports), 0);
    });
  }

  private renderCharts(reports: any[]): void {
    const actOpts  = this.dashService.buildActivityChart(reports, this.isAdmin);
    const trendOpts = this.dashService.buildTrendChart(reports, this.isAdmin);
    const tatOpts  = this.dashService.buildTatChart(reports);
    const brkOpts  = this.dashService.buildBreakdownChart(reports);
    this.hasBreakdownData = brkOpts !== null;

    this.renderChart('chartActivity',  actOpts);
    this.renderChart('chartTrend',     trendOpts);
    this.renderChart('chartTat',       tatOpts);
    if (brkOpts) this.renderChart('chartBreakdown', brkOpts);
    if (!this.isAdmin && this.kpis) {
      const realOpts = this.dashService.buildRealizationChart(this.kpis.realizationRate);
      this.renderChart('chartRealization', realOpts);
    }
  }

  private renderChart(id: string, opts: any): void {
    const el = document.querySelector(`#${id}`);
    if (!el) return;
    this.charts[id]?.destroy();
    const chart = new ApexCharts(el, opts);
    chart.render();
    this.charts[id] = chart;
  }

  private destroyAllCharts(): void {
    Object.values(this.charts).forEach(c => c?.destroy());
    this.charts = {};
  }

  ngOnDestroy(): void {
    this.destroyAllCharts();
  }

  // ── Helpers template ──────────────────────────────────────────────────────
  alertIcon(level: string): string {
    return level === 'critical' ? 'dangerous' : level === 'low' ? 'warning' : 'info';
  }

  alertLabel(level: string): string {
    return level === 'critical' ? 'CRITIQUE' : level === 'low' ? 'BAS' : 'ATTENTION';
  }

  tatColor(tat: number): string {
    return tat === 0 ? '#888' : tat <= 14 ? '#28a745' : tat <= 21 ? '#f48c06' : '#e85d04';
  }

  rateColor(rate: number): string {
    return rate >= 90 ? '#28a745' : rate >= 70 ? '#f48c06' : '#e85d04';
  }
}
