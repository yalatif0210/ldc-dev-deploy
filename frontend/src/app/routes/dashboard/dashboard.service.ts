import { Injectable } from '@angular/core';
import { Observable, forkJoin, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { SharedService } from '@shared/services/shared.service';
import SynthesisClaudeModel from '@shared/models/synthesis-claude.model';

// ── Sub-unit IDs ──────────────────────────────────────────────────────────────
const SU = {
  VL_RECEIVED: '1', VL_TESTED: '2', VL_PENDING: '4',
  EID_RECEIVED: '5', EID_TESTED: '6', EID_TESTED_POC: '7', EID_PENDING: '10',
  TAT_VL1: '11', TAT_PSC: '12', TAT_EID: '13', TAT_VL2: '33',
  RUPTURE_REACTIFS: '17', REACTIFS_PERIMES: '18', REACTIFS_INUTILISABLES: '19',
  AUTRES_REACTIFS: '20', PANNE_EQUIP: '21', INTERRUPTION: '22',
  RUPTURE_CONSOMM: '23', PERSONNEL: '24', AUTRES: '25',
} as const;

// ── Interfaces publiques ──────────────────────────────────────────────────────
export interface DashboardKpi {
  vlPending:       number;
  eidPending:      number;
  vlReceived:      number;
  vlTested:        number;
  eidReceived:     number;
  eidTested:       number;
  realizationRate: number;   // %
  avgTat:          number;   // jours
  activeSites:     number;
  lastPeriod:      string;
}

export interface StockAlert {
  intrantName:    string;
  intrantSku:     string;
  siteName:       string;
  coverageMonths: number;
  level:          'critical' | 'low' | 'warning';
  availableStock: number;
  cmm:            number;
}

@Injectable({ providedIn: 'root' })
export class DashboardService extends SharedService {

  // ── Date range : 13 semaines (≈ 3 mois) ──────────────────────────────────
  static defaultRange(): { start: string; end: string } {
    const end   = new Date();
    const start = new Date(end.getTime() - 13 * 7 * 24 * 3600 * 1000);
    const fmt   = (d: Date) => d.toISOString().split('T')[0];
    return { start: fmt(start), end: fmt(end) };
  }

  // ── Chargement des rapports ────────────────────────────────────────────────
  loadReports(structureIds: number[], equipmentId: number): Observable<any[]> {
    const { start, end } = DashboardService.defaultRange();
    return this.query(SynthesisClaudeModel.reportsForMultiSynthesis, {
      request: {
        supervised_structure_ids: structureIds,
        equipment_id:  equipmentId,
        start_date:    start,
        end_date:      end,
        status_id:     4,
      },
    }).pipe(
      map((res: any) =>
        res?.data?.reportsBySupervisedStructuresAndEquipmentWithinDateRange ?? []
      )
    );
  }

  /** Charge les rapports pour tous les équipements en forkJoin et fusionne */
  loadAllEquipments(structureIds: number[], equipmentIds: number[]): Observable<any[]> {
    if (!equipmentIds.length) return of([]);
    return forkJoin(
      equipmentIds.map(eqId => this.loadReports(structureIds, eqId))
    ).pipe(map(results => results.flat()));
  }

  // ── Helpers privés ────────────────────────────────────────────────────────
  private siteOf(report: any): { id: string; name: string } {
    return report.account?.structures?.[0] ?? { id: '?', name: 'Inconnu' };
  }

  private extractPeriods(reports: any[]): string[] {
    const seen = new Map<string, string>();
    reports.forEach(r => seen.set(r.period.periodName, r.period.startDate));
    return [...seen.entries()]
      .sort(([, a], [, b]) => a.localeCompare(b))
      .map(([name]) => name);
  }

  // ── KPIs ──────────────────────────────────────────────────────────────────
  computeKpis(reports: any[]): DashboardKpi {
    const periods   = this.extractPeriods(reports);
    const lastP     = periods[periods.length - 1];
    const lastReps  = lastP ? reports.filter(r => r.period.periodName === lastP) : reports;
    const TAT_SU    = [SU.TAT_VL1, SU.TAT_PSC, SU.TAT_EID, SU.TAT_VL2];
    const activeSites = new Set<string>();

    let vlPending = 0, eidPending = 0, vlReceived = 0, vlTested = 0,
        eidReceived = 0, eidTested = 0, tatSum = 0, tatCount = 0;

    lastReps.forEach(report => {
      activeSites.add(this.siteOf(report).id);
      report.labActivityData?.forEach((lad: any) => {
        const su = lad.information?.informationSubUnit?.id;
        const v  = lad.value ?? 0;
        if (su === SU.VL_PENDING)   vlPending   += v;
        if (su === SU.EID_PENDING)  eidPending  += v;
        if (su === SU.VL_RECEIVED)  vlReceived  += v;
        if (su === SU.VL_TESTED)    vlTested    += v;
        if (su === SU.EID_RECEIVED) eidReceived += v;
        if ([SU.EID_TESTED, SU.EID_TESTED_POC].includes(su)) eidTested += v;
        if (TAT_SU.includes(su) && v > 0) { tatSum += v; tatCount++; }
      });
    });

    return {
      vlPending, eidPending, vlReceived, vlTested, eidReceived, eidTested,
      realizationRate: vlReceived > 0 ? Math.round(vlTested / vlReceived * 100) : 0,
      avgTat:          tatCount   > 0 ? +(tatSum / tatCount).toFixed(1)         : 0,
      activeSites:     activeSites.size,
      lastPeriod:      lastP ?? '—',
    };
  }

  // ── Alertes CMM stock ─────────────────────────────────────────────────────
  computeStockAlerts(reports: any[]): StockAlert[] {
    const siteMeta    = new Map<string, string>();           // siteId → name
    const intrantMeta = new Map<string, { name: string; sku: string }>();
    const distSums    = new Map<string, { sum: number; cnt: number }>();
    const latestStock = new Map<string, { available: number; rf: number }>();

    // Tri desc pour détecter le rapport le plus récent en premier
    const sorted = [...reports].sort(
      (a, b) => new Date(b.period.endDate).getTime() - new Date(a.period.endDate).getTime()
    );

    sorted.forEach(report => {
      const site = this.siteOf(report);
      siteMeta.set(site.id, site.name);

      report.IntrantMvtData?.forEach((mvt: any) => {
        const code = mvt.intrant?.code;
        if (!code) return;
        const key = `${site.id}__${code}`;

        if (!intrantMeta.has(key)) {
          intrantMeta.set(key, { name: mvt.intrant.name ?? '', sku: mvt.intrant.sku ?? '' });
        }

        // Stock disponible = plus récent rapport
        if (!latestStock.has(key)) {
          latestStock.set(key, {
            available: mvt.availableStock ?? 0,
            rf:        Math.max(1, mvt.intrant?.roundFactor ?? 1),
          });
        }

        // Cumul des distributions (pour CMM)
        const existing = distSums.get(key) ?? { sum: 0, cnt: 0 };
        existing.sum += mvt.distributionStock ?? 0;
        existing.cnt += 1;
        distSums.set(key, existing);
      });
    });

    const alerts: StockAlert[] = [];

    latestStock.forEach(({ available, rf }, key) => {
      const dist = distSums.get(key);
      if (!dist || dist.cnt === 0) return;

      const adjAvailable   = Math.ceil(available / rf);
      const avgWeeklyRaw   = dist.sum / dist.cnt;
      const avgWeekly      = avgWeeklyRaw / rf;
      const cmm            = avgWeekly * 4;          // ≈ mensuel
      if (cmm <= 0) return;

      const coverage = adjAvailable / cmm;
      if (coverage >= 3) return;                     // OK → pas d'alerte

      const level: StockAlert['level'] =
        coverage < 1 ? 'critical' : coverage < 2 ? 'low' : 'warning';

      const [siteId] = key.split('__');
      const meta     = intrantMeta.get(key);

      alerts.push({
        intrantName:    meta?.name    ?? key,
        intrantSku:     meta?.sku     ?? '',
        siteName:       siteMeta.get(siteId) ?? siteId,
        coverageMonths: +coverage.toFixed(1),
        level,
        availableStock: adjAvailable,
        cmm:            +cmm.toFixed(1),
      });
    });

    return alerts.sort((a, b) => {
      const o: Record<string, number> = { critical: 0, low: 1, warning: 2 };
      return o[a.level] - o[b.level];
    });
  }

  // ── Chart 1 : Activité Reçus / Testés ────────────────────────────────────
  buildActivityChart(reports: any[], isAdmin: boolean): any {
    const periods = this.extractPeriods(reports);
    const last6   = periods.slice(-6);

    if (isAdmin) {
      // Barres groupées par site (dernière période)
      const lastP   = periods[periods.length - 1];
      const lastReps = reports.filter(r => r.period.periodName === lastP);
      const map = new Map<string, { name: string; vlR: number; vlT: number; eidR: number; eidT: number }>();

      lastReps.forEach(r => {
        const s = this.siteOf(r);
        if (!map.has(s.id)) map.set(s.id, { name: s.name, vlR: 0, vlT: 0, eidR: 0, eidT: 0 });
        const d = map.get(s.id)!;
        r.labActivityData?.forEach((lad: any) => {
          const su = lad.information?.informationSubUnit?.id;
          const v  = lad.value ?? 0;
          if (su === SU.VL_RECEIVED)  d.vlR += v;
          if (su === SU.VL_TESTED)    d.vlT += v;
          if (su === SU.EID_RECEIVED) d.eidR += v;
          if ([SU.EID_TESTED, SU.EID_TESTED_POC].includes(su)) d.eidT += v;
        });
      });

      const sites = [...map.values()];
      return {
        chart:   { type: 'bar', height: 300, toolbar: { show: false } },
        series:  [
          { name: 'VL Reçus',   data: sites.map(s => s.vlR) },
          { name: 'VL Testés',  data: sites.map(s => s.vlT) },
          { name: 'EID Reçus',  data: sites.map(s => s.eidR) },
          { name: 'EID Testés', data: sites.map(s => s.eidT) },
        ],
        xaxis:        { categories: sites.map(s => s.name.substring(0, 18)) },
        colors:       ['#2f75b5', '#1a3a6b', '#28a745', '#155724'],
        plotOptions:  { bar: { columnWidth: '65%' } },
        dataLabels:   { enabled: false },
        legend:       { position: 'top' },
        title:        { text: `Activité — ${lastP}`, style: { fontSize: '12px', color: '#1e4e8c' } },
      };
    } else {
      // Barres par période (mon site)
      const pData = new Map<string, { vlR: number; vlT: number; eidR: number; eidT: number }>();
      last6.forEach(p => pData.set(p, { vlR: 0, vlT: 0, eidR: 0, eidT: 0 }));

      reports.filter(r => last6.includes(r.period.periodName)).forEach(r => {
        const d = pData.get(r.period.periodName)!;
        r.labActivityData?.forEach((lad: any) => {
          const su = lad.information?.informationSubUnit?.id;
          const v  = lad.value ?? 0;
          if (su === SU.VL_RECEIVED)  d.vlR += v;
          if (su === SU.VL_TESTED)    d.vlT += v;
          if (su === SU.EID_RECEIVED) d.eidR += v;
          if ([SU.EID_TESTED, SU.EID_TESTED_POC].includes(su)) d.eidT += v;
        });
      });

      const rows = last6.map(p => pData.get(p) ?? { vlR: 0, vlT: 0, eidR: 0, eidT: 0 });
      return {
        chart:   { type: 'bar', height: 300, toolbar: { show: false } },
        series:  [
          { name: 'VL Reçus',   data: rows.map(r => r.vlR) },
          { name: 'VL Testés',  data: rows.map(r => r.vlT) },
          { name: 'EID Reçus',  data: rows.map(r => r.eidR) },
          { name: 'EID Testés', data: rows.map(r => r.eidT) },
        ],
        xaxis:       { categories: last6.map(p => p.substring(0, 12)) },
        colors:      ['#2f75b5', '#1a3a6b', '#28a745', '#155724'],
        plotOptions: { bar: { columnWidth: '65%' } },
        dataLabels:  { enabled: false },
        legend:      { position: 'top' },
        title:       { text: 'Mon activité — 6 dernières semaines', style: { fontSize: '12px', color: '#1e4e8c' } },
      };
    }
  }

  // ── Chart 2 : Tendance en attente (line) ─────────────────────────────────
  buildTrendChart(reports: any[], isAdmin: boolean): any {
    const periods = this.extractPeriods(reports);
    const last8   = periods.slice(-8);

    const pPending = new Map<string, { vl: number; eid: number }>();
    last8.forEach(p => pPending.set(p, { vl: 0, eid: 0 }));

    reports.filter(r => last8.includes(r.period.periodName)).forEach(r => {
      const d = pPending.get(r.period.periodName)!;
      r.labActivityData?.forEach((lad: any) => {
        const su = lad.information?.informationSubUnit?.id;
        const v  = lad.value ?? 0;
        if (su === SU.VL_PENDING)  d.vl  += v;
        if (su === SU.EID_PENDING) d.eid += v;
      });
    });

    const rows = last8.map(p => pPending.get(p) ?? { vl: 0, eid: 0 });
    return {
      chart:       { type: 'line', height: 280, toolbar: { show: false } },
      series:      [
        { name: 'VL En attente',  data: rows.map(r => r.vl),  type: 'line' },
        { name: 'EID En attente', data: rows.map(r => r.eid), type: 'line' },
      ],
      stroke:      { curve: 'smooth', width: [2, 2] },
      markers:     { size: 4 },
      xaxis:       { categories: last8.map(p => p.substring(0, 12)) },
      colors:      ['#e85d04', '#6a994e'],
      dataLabels:  { enabled: false },
      legend:      { position: 'top' },
      title:       { text: `Tendance en attente (${isAdmin ? 'tous sites' : 'mon site'})`, style: { fontSize: '12px', color: '#1e4e8c' } },
      yaxis:       { min: 0 },
    };
  }

  // ── Chart 3 : TAT vs SLA (line + annotation) ─────────────────────────────
  buildTatChart(reports: any[]): any {
    const periods = this.extractPeriods(reports);
    const last8   = periods.slice(-8);
    const TAT_MAP: Record<string, string> = {
      [SU.TAT_VL1]: 'TAT VL Plasma1',
      [SU.TAT_PSC]: 'TAT VL PSC',
      [SU.TAT_EID]: 'TAT EID',
      [SU.TAT_VL2]: 'TAT VL Plasma2',
    };
    const acc = new Map<string, Record<string, { sum: number; cnt: number }>>();
    last8.forEach(p => acc.set(p, {}));

    reports.filter(r => last8.includes(r.period.periodName)).forEach(r => {
      const d = acc.get(r.period.periodName)!;
      r.labActivityData?.forEach((lad: any) => {
        const su = lad.information?.informationSubUnit?.id;
        if (!TAT_MAP[su]) return;
        const v = lad.value ?? 0;
        if (!d[su]) d[su] = { sum: 0, cnt: 0 };
        d[su].sum += v;
        d[su].cnt += 1;
      });
    });

    const series = Object.entries(TAT_MAP).map(([su, name]) => ({
      name,
      data: last8.map(p => {
        const e = acc.get(p)?.[su];
        return e && e.cnt > 0 ? +(e.sum / e.cnt).toFixed(1) : 0;
      }),
    }));

    return {
      chart:      { type: 'line', height: 280, toolbar: { show: false } },
      series,
      stroke:     { curve: 'smooth', width: [2, 2, 2, 2] },
      markers:    { size: 3 },
      xaxis:      { categories: last8.map(p => p.substring(0, 12)) },
      colors:     ['#2f75b5', '#e85d04', '#6a994e', '#9b59b6'],
      dataLabels: { enabled: false },
      legend:     { position: 'top' },
      annotations: {
        yaxis: [{
          y:           14,
          borderColor: '#f00',
          label:       { text: 'SLA 14j', style: { color: '#fff', background: '#f00' } },
        }],
      },
      yaxis: { min: 0, title: { text: 'Jours' } },
      title: { text: 'Délai moyen TAT — vs SLA 14j', style: { fontSize: '12px', color: '#1e4e8c' } },
    };
  }

  // ── Chart 4 : Pannes / interruptions (donut) ──────────────────────────────
  buildBreakdownChart(reports: any[]): any {
    const CATS: Record<string, string> = {
      [SU.RUPTURE_REACTIFS]:    'Rupture réactifs',
      [SU.REACTIFS_PERIMES]:    'Réactifs périmés',
      [SU.REACTIFS_INUTILISABLES]: 'Réactifs inutilisables',
      [SU.AUTRES_REACTIFS]:     'Autres réactifs',
      [SU.PANNE_EQUIP]:         'Panne équipement',
      [SU.INTERRUPTION]:        'Interruption courant',
      [SU.RUPTURE_CONSOMM]:     'Rupture consommables',
      [SU.PERSONNEL]:           'Personnel absent',
      [SU.AUTRES]:              'Autres incidents',
    };

    const counts: Record<string, number> = {};
    Object.keys(CATS).forEach(k => { counts[k] = 0; });

    reports.forEach(r => {
      r.labActivityData?.forEach((lad: any) => {
        const su = lad.information?.informationSubUnit?.id;
        if (su in counts) counts[su] += lad.value ?? 0;
      });
    });

    const labels = Object.entries(CATS)
      .filter(([su]) => counts[su] > 0)
      .map(([, name]) => name);
    const data   = Object.entries(CATS)
      .filter(([su]) => counts[su] > 0)
      .map(([su]) => counts[su]);

    if (!data.length) return null;

    return {
      chart:   { type: 'donut', height: 280 },
      series:  data,
      labels,
      colors:  ['#e85d04', '#f48c06', '#ffd166', '#90be6d', '#2f75b5', '#1a3a6b', '#9b59b6', '#c0392b', '#7f8c8d'],
      legend:  { position: 'bottom', fontSize: '11px' },
      dataLabels: { enabled: true, formatter: (val: number) => `${Math.round(val)}%` },
      title:   { text: 'Pannes & interruptions', style: { fontSize: '12px', color: '#1e4e8c' } },
      plotOptions: { pie: { donut: { size: '60%' } } },
    };
  }

  // ── Chart 5 : Taux de réalisation (radialBar — user only) ─────────────────
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
}
