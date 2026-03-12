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
import {
  DashboardService,
  DashboardKpi,
  DashboardSite,
  StockAlert,
  Completeness,
  PeriodInfo,
} from './dashboard.service';

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
  private readonly ngZone         = inject(NgZone);
  private readonly authService    = inject(AuthService);
  private readonly historyService = inject(ReportHistoryService);
  private readonly dashService    = inject(DashboardService);

  // ── Rôle ──────────────────────────────────────────────────────────────────
  isAdmin      = false;
  isSupervisor = false;

  // ── Compte ────────────────────────────────────────────────────────────────
  account: any;
  selectedEquipmentId: number | null = null;

  // ── Données brutes (chargées une fois par équipement) ─────────────────────
  allReports: any[] = [];
  allPeriods: PeriodInfo[] = [];
  allSites:   DashboardSite[] = [];

  // ── Filtres toolbar ───────────────────────────────────────────────────────
  selectedPeriod: string = '';
  selectedRegion: string = 'all';
  selectedSiteId: string = 'all';

  // ── Rapports filtrés ──────────────────────────────────────────────────────
  filteredReports: any[] = [];

  // ── Sélecteurs in-card ────────────────────────────────────────────────────
  activityPeriod: string = '';
  trendStart:     string = '';
  trendEnd:       string = '';
  tatStart:       string = '';
  tatEnd:         string = '';
  retestStart:    string = '';
  retestEnd:      string = '';
  rejectStart:    string = '';
  rejectEnd:      string = '';

  // ── Résultats ─────────────────────────────────────────────────────────────
  kpis:             DashboardKpi | null = null;
  stockAlerts:      StockAlert[]        = [];
  completeness:     Completeness | null = null;
  hasBreakdownData                      = false;
  loading                               = false;

  // ── Charts ────────────────────────────────────────────────────────────────
  private charts: Record<string, ApexCharts | undefined> = {};

  // ── Listes dérivées ───────────────────────────────────────────────────────
  get equipmentList() { return this.historyService.getEquipmentList(this.account); }

  get regionList(): string[] {
    return ['all', ...new Set(this.allSites.map(s => s.regionName)).values()];
  }

  get siteListForRegion(): DashboardSite[] {
    if (this.selectedRegion === 'all') return this.allSites;
    return this.allSites.filter(s => s.regionName === this.selectedRegion);
  }

  get criticalAlertCount(): number {
    return this.stockAlerts.filter(a => a.level === 'critical').length;
  }

  // ── Init ──────────────────────────────────────────────────────────────────
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

  ngAfterViewInit(): void {}

  // ── Handlers toolbar ──────────────────────────────────────────────────────
  onEquipmentChange(): void { this.loadDashboardData(); }

  onPeriodChange(): void { this.applyFiltersAndRender(); }

  onRegionChange(): void {
    if (this.selectedSiteId !== 'all') {
      const inRegion = this.siteListForRegion.some(s => s.id === this.selectedSiteId);
      if (!inRegion) this.selectedSiteId = 'all';
    }
    this.applyFiltersAndRender();
  }

  onSiteChange(): void { this.applyFiltersAndRender(); }

  // ── Handlers sélecteurs in-card ───────────────────────────────────────────
  onActivityPeriodChange(): void {
    this.renderChart('chartActivity',
      this.dashService.buildActivityChart(this.filteredReports, this.activityPeriod));
  }

  onTrendRangeChange(): void {
    this.renderChart('chartTrend',
      this.dashService.buildTrendChart(this.filteredReports, this.allPeriods, this.trendStart, this.trendEnd));
  }

  onTatRangeChange(): void {
    this.renderChart('chartTat',
      this.dashService.buildTatChart(this.filteredReports, this.allPeriods, this.tatStart, this.tatEnd));
  }

  onRetestRangeChange(): void {
    this.renderChart('chartRetest',
      this.dashService.buildRetestChart(this.filteredReports, this.allPeriods, this.retestStart, this.retestEnd));
  }

  onRejectRangeChange(): void {
    this.renderChart('chartReject',
      this.dashService.buildRejectChart(this.filteredReports, this.allPeriods, this.rejectStart, this.rejectEnd));
  }

  // ── Chargement HTTP ───────────────────────────────────────────────────────
  loadDashboardData(): void {
    if (!this.selectedEquipmentId || !this.account) return;

    this.loading = true;
    this.kpis    = null;
    this.destroyAllCharts();

    const structureIds = this.historyService.getAdminSuperivisedStructuresIds(
      this.account.structures ?? []
    );

    this.dashService.loadReports(structureIds, Number(this.selectedEquipmentId)).subscribe({
      next: (reports: any[]) => {
        this.allReports = reports;
        this.allPeriods = this.dashService.extractPeriods(reports);
        this.allSites   = this.dashService.extractSites(reports);

        const last = this.allPeriods[this.allPeriods.length - 1];
        const prev = this.allPeriods[this.allPeriods.length - 2] ?? last;

        this.selectedPeriod = last?.name ?? '';
        this.activityPeriod = last?.name ?? '';
        this.trendStart     = prev?.name ?? '';
        this.trendEnd       = last?.name ?? '';
        this.tatStart       = prev?.name ?? '';
        this.tatEnd         = last?.name ?? '';
        this.retestStart    = prev?.name ?? '';
        this.retestEnd      = last?.name ?? '';
        this.rejectStart    = prev?.name ?? '';
        this.rejectEnd      = last?.name ?? '';

        this.selectedRegion = 'all';
        this.selectedSiteId = 'all';

        this.loading = false;
        this.applyFiltersAndRender();
      },
      error: () => { this.loading = false; },
    });
  }

  // ── Filtrage + rendu ──────────────────────────────────────────────────────
  private applyFiltersAndRender(): void {
    this.filteredReports = this.dashService.filterReports(
      this.allReports, this.selectedRegion, this.selectedSiteId
    );

    const kpiReports = this.filteredReports.filter(
      r => r.period?.periodName === this.selectedPeriod
    );

    this.kpis         = this.dashService.computeKpis(kpiReports);
    this.stockAlerts  = this.dashService.computeStockAlerts(this.filteredReports);
    this.completeness = this.dashService.computeCompleteness(
      this.filteredReports,
      this.account?.structures?.length ?? 0,
      this.selectedPeriod
    );

    this.ngZone.runOutsideAngular(() => setTimeout(() => this.renderAllCharts(), 0));
  }

  private renderAllCharts(): void {
    const r  = this.filteredReports;
    const ap = this.allPeriods;

    this.renderChart('chartActivity', this.dashService.buildActivityChart(r, this.activityPeriod));
    this.renderChart('chartTrend',    this.dashService.buildTrendChart(r, ap, this.trendStart, this.trendEnd));
    this.renderChart('chartTat',      this.dashService.buildTatChart(r, ap, this.tatStart, this.tatEnd));
    this.renderChart('chartRetest',   this.dashService.buildRetestChart(r, ap, this.retestStart, this.retestEnd));
    this.renderChart('chartReject',   this.dashService.buildRejectChart(r, ap, this.rejectStart, this.rejectEnd));

    const brkOpts = this.dashService.buildBreakdownChart(r);
    this.hasBreakdownData = brkOpts !== null;
    if (brkOpts) this.renderChart('chartBreakdown', brkOpts);

    if (!this.isAdmin && this.kpis) {
      this.renderChart('chartRealization', this.dashService.buildRealizationChart(this.kpis.realizationRate));
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

  ngOnDestroy(): void { this.destroyAllCharts(); }

  // ── Helpers template ──────────────────────────────────────────────────────
  alertIcon(level: string): string {
    if (level === 'critical') return 'dangerous';
    if (level === 'surstock') return 'inventory';
    if (level === 'low')      return 'warning';
    return 'info';
  }

  alertLabel(level: string): string {
    if (level === 'critical') return 'CRITIQUE';
    if (level === 'low')      return 'BAS';
    if (level === 'warning')  return 'ATTENTION';
    return 'SURSTOCK';
  }

  tatColor(tat: number): string {
    return tat === 0 ? '#888' : tat <= 10 ? '#28a745' : tat <= 15 ? '#f48c06' : '#e85d04';
  }

  rateColor(rate: number): string {
    return rate >= 90 ? '#28a745' : rate >= 70 ? '#f48c06' : '#e85d04';
  }

  completenessColor(rate: number): string {
    return rate >= 80 ? '#28a745' : rate >= 50 ? '#f48c06' : '#e85d04';
  }
}
