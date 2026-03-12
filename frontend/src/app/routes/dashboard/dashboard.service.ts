import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { SharedService } from '@shared/services/shared.service';
import SynthesisClaudeModel from '@shared/models/synthesis-claude.model';

// ── Sub-unit IDs ──────────────────────────────────────────────────────────────
const SU = {
  VL_RECEIVED:           '1',
  VL_TESTED:             '2',
  VL_FAILED_PENDING:     '3',
  VL_PENDING:            '4',
  EID_RECEIVED:          '5',
  EID_TESTED:            '6',
  EID_TESTED_POC:        '7',
  EID_FAILED_PENDING:    '8',
  EID_FAILED_POC:        '9',
  EID_PENDING:           '10',
  TAT_VL1:               '11',
  TAT_PSC:               '12',
  TAT_EID:               '13',
  TAT_VL2:               '33',
  VL_FAILED_REJECT:      '34',
  EID_FAILED_REJECT:     '35',
  EID_FAILED_REJECT_POC: '36',
} as const;

// ── Public interfaces ─────────────────────────────────────────────────────────
export interface PeriodInfo {
  name:      string;
  startDate: string;
  endDate:   string;
}

export interface KpiSampleDetail {
  sampleType: string;
  received:   number;
  tested:     number;
  pending:    number;
}

export interface DashboardKpi {
  vlPending:       number;
  eidPending:      number;
  vlReceived:      number;
  vlTested:        number;
  eidReceived:     number;
  eidTested:       number;
  realizationRate: number;
  avgTat:          number;
  activeSites:     number;
  lastPeriod:      string;
  vlDetails:       KpiSampleDetail[];
  eidDetails:      KpiSampleDetail[];
}

export interface StockAlert {
  intrantName:    string;
  intrantSku:     string;
  siteName:       string;
  msd:            number;
  level:          'critical' | 'low' | 'warning' | 'surstock';
  availableStock: number;
  cmm:            number;
}

export interface Completeness {
  period:         string;
  reportingCount: number;
  totalSites:     number;
  rate:           number;
}

export interface DashboardSite {
  id:         string;
  name:       string;
  regionName: string;
}

@Injectable({ providedIn: 'root' })
export class DashboardService extends SharedService {

  // ── Helpers publics ───────────────────────────────────────────────────────
  siteOf(report: any): DashboardSite {
    const s = report.account?.structures?.[0];
    return {
      id:         String(s?.id    ?? '?'),
      name:       s?.name         ?? 'Inconnu',
      regionName: s?.district?.region?.name ?? 'Sans région',
    };
  }

  extractPeriods(reports: any[]): PeriodInfo[] {
    const seen = new Map<string, PeriodInfo>();
    reports.forEach(r => {
      if (!seen.has(r.period.periodName)) {
        seen.set(r.period.periodName, {
          name:      r.period.periodName,
          startDate: r.period.startDate,
          endDate:   r.period.endDate,
        });
      }
    });
    return [...seen.values()].sort((a, b) => a.startDate.localeCompare(b.startDate));
  }

  extractSites(reports: any[]): DashboardSite[] {
    const seen = new Map<string, DashboardSite>();
    reports.forEach(r => {
      const s = this.siteOf(r);
      if (!seen.has(s.id)) seen.set(s.id, s);
    });
    return [...seen.values()].sort((a, b) => a.name.localeCompare(b.name));
  }

  filterReports(reports: any[], regionName: string, siteId: string): any[] {
    return reports.filter(r => {
      const s = this.siteOf(r);
      if (regionName !== 'all' && s.regionName !== regionName) return false;
      if (siteId     !== 'all' && s.id         !== siteId)     return false;
      return true;
    });
  }

  /** Extracts period names in [startPeriod..endPeriod] from a sorted PeriodInfo list */
  periodSlice(allPeriods: PeriodInfo[], startName: string, endName: string): string[] {
    const si = allPeriods.findIndex(p => p.name === startName);
    const ei = allPeriods.findIndex(p => p.name === endName);
    if (si < 0 || ei < 0) return allPeriods.map(p => p.name);
    return allPeriods.slice(si, ei + 1).map(p => p.name);
  }

  // ── HTTP ──────────────────────────────────────────────────────────────────
  loadReports(structureIds: number[], equipmentId: number): Observable<any[]> {
    const end   = new Date();
    const start = new Date(end.getTime() - 26 * 7 * 24 * 3600 * 1000); // ~6 months
    const fmt   = (d: Date) => d.toISOString().split('T')[0];

    return this.query(SynthesisClaudeModel.reportsForDashboard, {
      request: {
        supervised_structure_ids: structureIds,
        equipment_id: equipmentId,
        start_date:   fmt(start),
        end_date:     fmt(end),
        status_id:    4,           // APPROVED only
      },
    }).pipe(
      map((res: any) =>
        res?.data?.reportsBySupervisedStructuresAndEquipmentWithinDateRange ?? []
      )
    );
  }

  // ── KPIs ──────────────────────────────────────────────────────────────────
  computeKpis(reports: any[]): DashboardKpi {
    const TAT_SU      = [SU.TAT_VL1, SU.TAT_PSC, SU.TAT_EID, SU.TAT_VL2];
    const activeSites = new Set<string>();
    const lastP       = this.latestPeriodName(reports);

    const vlRecMap  = new Map<string, number>();
    const vlTstMap  = new Map<string, number>();
    const vlPndMap  = new Map<string, number>();
    const eidRecMap = new Map<string, number>();
    const eidTstMap = new Map<string, number>();

    let vlPending = 0, eidPending = 0, vlReceived = 0, vlTested = 0;
    let eidReceived = 0, eidTested = 0, tatSum = 0, tatCount = 0;

    reports.forEach(report => {
      activeSites.add(this.siteOf(report).id);
      report.labActivityData?.forEach((lad: any) => {
        const su  = lad.information?.informationSubUnit?.id;
        const ssu = lad.information?.informationSubSubUnit?.name ?? 'Total';
        const v   = lad.value ?? 0;

        if (su === SU.VL_PENDING)   { vlPending   += v; vlPndMap.set(ssu,  (vlPndMap.get(ssu)  ?? 0) + v); }
        if (su === SU.EID_PENDING)  eidPending  += v;
        if (su === SU.EID_RECEIVED) { eidReceived += v; eidRecMap.set(ssu, (eidRecMap.get(ssu) ?? 0) + v); }
        if ([SU.EID_TESTED, SU.EID_TESTED_POC].includes(su)) { eidTested += v; eidTstMap.set(ssu, (eidTstMap.get(ssu) ?? 0) + v); }
        if (TAT_SU.includes(su) && v > 0) { tatSum += v; tatCount++; }

        if (su === SU.VL_RECEIVED) { vlReceived += v; vlRecMap.set(ssu, (vlRecMap.get(ssu) ?? 0) + v); }
        if (su === SU.VL_TESTED)   { vlTested   += v; vlTstMap.set(ssu, (vlTstMap.get(ssu) ?? 0) + v); }
      });
    });

    const buildDetails = (
      r: Map<string, number>, t: Map<string, number>, p: Map<string, number>
    ): KpiSampleDetail[] => {
      const types = new Set([...r.keys(), ...t.keys(), ...p.keys()]);
      return [...types]
        .filter(s => s !== 'Total' || types.size <= 1)
        .sort()
        .map(s => ({
          sampleType: s,
          received:   r.get(s) ?? 0,
          tested:     t.get(s) ?? 0,
          pending:    p.get(s) ?? 0,
        }));
    };

    return {
      vlPending, eidPending, vlReceived, vlTested, eidReceived, eidTested,
      realizationRate: vlReceived > 0 ? Math.round(vlTested   / vlReceived * 100) : 0,
      avgTat:          tatCount   > 0 ? +(tatSum   / tatCount).toFixed(1)          : 0,
      activeSites:     activeSites.size,
      lastPeriod:      lastP,
      vlDetails:       buildDetails(vlRecMap, vlTstMap, vlPndMap),
      eidDetails:      buildDetails(eidRecMap, eidTstMap, new Map()),
    };
  }

  private latestPeriodName(reports: any[]): string {
    let latest = '', latestDate = '';
    reports.forEach(r => {
      if (r.period.startDate > latestDate) { latestDate = r.period.startDate; latest = r.period.periodName; }
    });
    return latest;
  }

  // ── Complétude ────────────────────────────────────────────────────────────
  computeCompleteness(reports: any[], totalSites: number, selectedPeriod: string): Completeness {
    const periodReports  = reports.filter(r => r.period.periodName === selectedPeriod);
    const reportedSites  = new Set(periodReports.map(r => this.siteOf(r).id));
    const reportingCount = reportedSites.size;
    const rate           = totalSites > 0 ? Math.round(reportingCount / totalSites * 100) : 0;
    return { period: selectedPeriod, reportingCount, totalSites, rate };
  }

  // ── Alertes stock (CMM mensuel, MSD) ─────────────────────────────────────
  computeStockAlerts(reports: any[]): StockAlert[] {
    const siteMeta    = new Map<string, string>();
    const intrantMeta = new Map<string, { name: string; sku: string; rf: number }>();
    const latestStock = new Map<string, number>();
    const monthlyDist = new Map<string, Map<string, number>>();

    const sorted = [...reports].sort(
      (a, b) => new Date(b.period.endDate).getTime() - new Date(a.period.endDate).getTime()
    );

    sorted.forEach(report => {
      const site  = this.siteOf(report);
      const month = report.period.startDate.substring(0, 7);
      siteMeta.set(site.id, site.name);

      report.IntrantMvtData?.forEach((mvt: any) => {
        const code = mvt.intrant?.code;
        if (!code) return;
        const key = `${site.id}__${code}`;
        const rf  = Math.max(1, mvt.intrant?.roundFactor ?? 1);

        if (!intrantMeta.has(key)) {
          intrantMeta.set(key, { name: mvt.intrant.name ?? '', sku: mvt.intrant.sku ?? '', rf });
        }
        if (!latestStock.has(key)) latestStock.set(key, mvt.availableStock ?? 0);

        if (!monthlyDist.has(key)) monthlyDist.set(key, new Map());
        const mMap = monthlyDist.get(key)!;
        mMap.set(month, (mMap.get(month) ?? 0) + (mvt.distributionStock ?? 0));
      });
    });

    const alerts: StockAlert[] = [];

    latestStock.forEach((available, key) => {
      const mMap = monthlyDist.get(key);
      const meta = intrantMeta.get(key);
      if (!mMap || mMap.size === 0 || !meta) return;

      const months = [...mMap.keys()].sort().slice(-3);
      const n      = months.length;
      const sumN   = months.reduce((s, m) => s + (mMap.get(m) ?? 0), 0);
      const cmmRaw = sumN / n;
      if (cmmRaw <= 0) return;

      // Multiply both by roundFactor as specified (rf cancels in MSD but kept for display)
      const adjAvail = available * meta.rf;
      const adjCmm   = cmmRaw   * meta.rf;
      const msd      = adjAvail / adjCmm;

      const level: StockAlert['level'] | null =
        msd < 1  ? 'critical' :
        msd < 2  ? 'low'      :
        msd < 3  ? 'warning'  :
        msd >= 6 ? 'surstock' : null;

      if (!level) return;

      const [siteId] = key.split('__');
      alerts.push({
        intrantName:    meta.name,
        intrantSku:     meta.sku,
        siteName:       siteMeta.get(siteId) ?? siteId,
        msd:            +msd.toFixed(1),
        level,
        availableStock: Math.round(adjAvail),
        cmm:            +adjCmm.toFixed(1),
      });
    });

    const levelOrder: Record<string, number> = { critical: 0, low: 1, warning: 2, surstock: 3 };
    return alerts.sort((a, b) => levelOrder[a.level] - levelOrder[b.level]);
  }

  // ── Chart 1: Activité Reçus / Testés ─────────────────────────────────────
  buildActivityChart(reports: any[], selectedPeriod: string): any {
    const periodReports = reports.filter(r => r.period.periodName === selectedPeriod);
    const siteMap = new Map<string, { name: string; vlR: number; vlT: number; eidR: number; eidT: number }>();

    periodReports.forEach(r => {
      const s = this.siteOf(r);
      if (!siteMap.has(s.id)) siteMap.set(s.id, { name: s.name, vlR: 0, vlT: 0, eidR: 0, eidT: 0 });
      const d = siteMap.get(s.id)!;
      r.labActivityData?.forEach((lad: any) => {
        const su = lad.information?.informationSubUnit?.id;
        const v  = lad.value ?? 0;
        if (su === SU.VL_RECEIVED)  d.vlR += v;
        if (su === SU.VL_TESTED)    d.vlT += v;
        if (su === SU.EID_RECEIVED) d.eidR += v;
        if ([SU.EID_TESTED, SU.EID_TESTED_POC].includes(su)) d.eidT += v;
      });
    });

    const sites = [...siteMap.values()];
    return {
      chart:       { type: 'bar', height: 300, toolbar: { show: false } },
      series:      [
        { name: 'VL Reçus',   data: sites.map(s => s.vlR) },
        { name: 'VL Testés',  data: sites.map(s => s.vlT) },
        { name: 'EID Reçus',  data: sites.map(s => s.eidR) },
        { name: 'EID Testés', data: sites.map(s => s.eidT) },
      ],
      xaxis:       { categories: sites.map(s => s.name.substring(0, 18)) },
      colors:      ['#2f75b5', '#1a3a6b', '#28a745', '#155724'],
      plotOptions: { bar: { columnWidth: '65%' } },
      dataLabels:  { enabled: false },
      legend:      { position: 'top' },
      title:       { text: `Activité — ${selectedPeriod}`, style: { fontSize: '12px', color: '#1e4e8c' } },
    };
  }

  // ── Chart 2: Tendance en attente ──────────────────────────────────────────
  buildTrendChart(reports: any[], allPeriods: PeriodInfo[], startName: string, endName: string): any {
    const filtered = this.periodSlice(allPeriods, startName, endName);
    const pData = new Map<string, { vl: number; eid: number }>();
    filtered.forEach(p => pData.set(p, { vl: 0, eid: 0 }));

    reports.filter(r => filtered.includes(r.period.periodName)).forEach(r => {
      const d = pData.get(r.period.periodName)!;
      r.labActivityData?.forEach((lad: any) => {
        const su = lad.information?.informationSubUnit?.id;
        const v  = lad.value ?? 0;
        if (su === SU.VL_PENDING)  d.vl  += v;
        if (su === SU.EID_PENDING) d.eid += v;
      });
    });

    const rows = filtered.map(p => pData.get(p) ?? { vl: 0, eid: 0 });
    return {
      chart:   { type: 'line', height: 280, toolbar: { show: false } },
      series:  [
        { name: 'VL En attente',  data: rows.map(r => r.vl) },
        { name: 'EID En attente', data: rows.map(r => r.eid) },
      ],
      stroke:     { curve: 'smooth', width: [2, 2] },
      markers:    { size: 4 },
      xaxis:      { categories: filtered.map(p => p.substring(0, 12)) },
      colors:     ['#e85d04', '#6a994e'],
      dataLabels: { enabled: false },
      legend:     { position: 'top' },
      yaxis:      { min: 0 },
      title:      { text: 'Tendance en attente', style: { fontSize: '12px', color: '#1e4e8c' } },
    };
  }

  // ── Chart 3: TAT vs SLA 10j ───────────────────────────────────────────────
  buildTatChart(reports: any[], allPeriods: PeriodInfo[], startName: string, endName: string): any {
    const filtered = this.periodSlice(allPeriods, startName, endName);
    const TAT_MAP: Record<string, string> = {
      [SU.TAT_VL1]: 'TAT VL Plasma1',
      [SU.TAT_PSC]: 'TAT VL PSC',
      [SU.TAT_EID]: 'TAT EID',
      [SU.TAT_VL2]: 'TAT VL Plasma2',
    };

    const acc = new Map<string, Record<string, { sum: number; cnt: number }>>();
    filtered.forEach(p => acc.set(p, {}));

    reports.filter(r => filtered.includes(r.period.periodName)).forEach(r => {
      const d = acc.get(r.period.periodName)!;
      r.labActivityData?.forEach((lad: any) => {
        const su = lad.information?.informationSubUnit?.id;
        if (!TAT_MAP[su]) return;
        const v = lad.value ?? 0;
        if (!d[su]) d[su] = { sum: 0, cnt: 0 };
        d[su].sum += v; d[su].cnt++;
      });
    });

    const series = Object.entries(TAT_MAP).map(([su, name]) => ({
      name,
      data: filtered.map(p => {
        const e = acc.get(p)?.[su];
        return e && e.cnt > 0 ? +(e.sum / e.cnt).toFixed(1) : null;
      }),
    }));

    return {
      chart:      { type: 'line', height: 280, toolbar: { show: false } },
      series,
      stroke:     { curve: 'smooth', width: [2, 2, 2, 2] },
      markers:    { size: 3 },
      xaxis:      { categories: filtered.map(p => p.substring(0, 12)) },
      colors:     ['#2f75b5', '#e85d04', '#6a994e', '#9b59b6'],
      dataLabels: { enabled: false },
      legend:     { position: 'top' },
      annotations: {
        yaxis: [{ y: 10, borderColor: '#f00', label: { text: 'SLA 10j', style: { color: '#fff', background: '#f00' } } }],
      },
      yaxis: { min: 0, title: { text: 'Jours' } },
      title: { text: 'Délai moyen TAT — vs SLA 10j', style: { fontSize: '12px', color: '#1e4e8c' } },
    };
  }

  // ── Chart 4: Pannes / interruptions (donut) ───────────────────────────────
  buildBreakdownChart(reports: any[]): any {
    const CATS: Record<string, string> = {
      '17': 'Rupture réactifs',    '18': 'Réactifs périmés',
      '19': 'Réactifs inutilisables', '20': 'Autres réactifs',
      '21': 'Panne équipement',    '22': 'Interruption courant',
      '23': 'Rupture consommables', '24': 'Personnel absent',
      '25': 'Autres incidents',
    };

    const counts: Record<string, number> = {};
    Object.keys(CATS).forEach(k => { counts[k] = 0; });
    reports.forEach(r => {
      r.labActivityData?.forEach((lad: any) => {
        const su = lad.information?.informationSubUnit?.id;
        if (su in counts) counts[su] += lad.value ?? 0;
      });
    });

    const nonZero = Object.entries(CATS).filter(([su]) => counts[su] > 0);
    if (!nonZero.length) return null;

    return {
      chart:       { type: 'donut', height: 280 },
      series:      nonZero.map(([su]) => counts[su]),
      labels:      nonZero.map(([, name]) => name),
      colors:      ['#e85d04','#f48c06','#ffd166','#90be6d','#2f75b5','#1a3a6b','#9b59b6','#c0392b','#7f8c8d'],
      legend:      { position: 'bottom', fontSize: '11px' },
      dataLabels:  { enabled: true, formatter: (val: number) => `${Math.round(val)}%` },
      title:       { text: 'Pannes & interruptions', style: { fontSize: '12px', color: '#1e4e8c' } },
      plotOptions: { pie: { donut: { size: '60%' } } },
    };
  }

  // ── Chart 5: Réalisation (radialBar) ─────────────────────────────────────
  buildRealizationChart(rate: number): any {
    return {
      chart:  { type: 'radialBar', height: 260 },
      series: [rate],
      labels: ['Réalisation'],
      colors: [rate >= 90 ? '#28a745' : rate >= 70 ? '#f48c06' : '#e85d04'],
      plotOptions: {
        radialBar: {
          dataLabels: {
            name:  { fontSize: '14px' },
            value: { fontSize: '22px', formatter: (v: number) => `${v}%` },
          },
          hollow: { size: '55%' },
        },
      },
      title: { text: 'Taux de réalisation', style: { fontSize: '12px', color: '#1e4e8c' } },
    };
  }

  // ── Chart 6: Testés vs En attente de retest ───────────────────────────────
  buildRetestChart(reports: any[], allPeriods: PeriodInfo[], startName: string, endName: string): any {
    const filtered = this.periodSlice(allPeriods, startName, endName);
    const pData = new Map<string, { tested: number; retest: number }>();
    filtered.forEach(p => pData.set(p, { tested: 0, retest: 0 }));

    reports.filter(r => filtered.includes(r.period.periodName)).forEach(r => {
      const d = pData.get(r.period.periodName)!;
      r.labActivityData?.forEach((lad: any) => {
        const su = lad.information?.informationSubUnit?.id;
        const v  = lad.value ?? 0;
        if ([SU.VL_TESTED, SU.EID_TESTED, SU.EID_TESTED_POC].includes(su)) d.tested += v;
        if ([SU.VL_FAILED_PENDING, SU.EID_FAILED_PENDING, SU.EID_FAILED_POC].includes(su)) d.retest += v;
      });
    });

    const rows = filtered.map(p => pData.get(p) ?? { tested: 0, retest: 0 });
    return {
      chart:       { type: 'bar', height: 260, toolbar: { show: false } },
      series:      [
        { name: 'Testés',             data: rows.map(r => r.tested) },
        { name: 'En attente retest',  data: rows.map(r => r.retest) },
      ],
      xaxis:       { categories: filtered.map(p => p.substring(0, 12)) },
      colors:      ['#28a745', '#f48c06'],
      plotOptions: { bar: { columnWidth: '60%' } },
      dataLabels:  { enabled: false },
      legend:      { position: 'top' },
      title:       { text: 'Testés vs En attente de retest', style: { fontSize: '12px', color: '#1e4e8c' } },
    };
  }

  // ── Chart 7: Testés vs À rejeter ──────────────────────────────────────────
  buildRejectChart(reports: any[], allPeriods: PeriodInfo[], startName: string, endName: string): any {
    const filtered = this.periodSlice(allPeriods, startName, endName);
    const pData = new Map<string, { tested: number; reject: number }>();
    filtered.forEach(p => pData.set(p, { tested: 0, reject: 0 }));

    reports.filter(r => filtered.includes(r.period.periodName)).forEach(r => {
      const d = pData.get(r.period.periodName)!;
      r.labActivityData?.forEach((lad: any) => {
        const su = lad.information?.informationSubUnit?.id;
        const v  = lad.value ?? 0;
        if ([SU.VL_TESTED, SU.EID_TESTED, SU.EID_TESTED_POC].includes(su)) d.tested += v;
        if ([SU.VL_FAILED_REJECT, SU.EID_FAILED_REJECT, SU.EID_FAILED_REJECT_POC].includes(su)) d.reject += v;
      });
    });

    const rows = filtered.map(p => pData.get(p) ?? { tested: 0, reject: 0 });
    return {
      chart:       { type: 'bar', height: 260, toolbar: { show: false } },
      series:      [
        { name: 'Testés',    data: rows.map(r => r.tested) },
        { name: 'À rejeter', data: rows.map(r => r.reject) },
      ],
      xaxis:       { categories: filtered.map(p => p.substring(0, 12)) },
      colors:      ['#28a745', '#e85d04'],
      plotOptions: { bar: { columnWidth: '60%' } },
      dataLabels:  { enabled: false },
      legend:      { position: 'top' },
      title:       { text: 'Testés vs À rejeter', style: { fontSize: '12px', color: '#1e4e8c' } },
    };
  }
}
