import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SharedService } from './shared.service';
import SynthesisClaudeModel from '@shared/models/synthesis-claude.model';
import { englishFromFrenchDate } from '@shared/utils/french-date';

// ── InformationSubUnit IDs ────────────────────────────────────────────────────
const SU = {
  VL_RECEIVED:        '1',
  VL_TESTED:          '2',
  VL_FAILED_PENDING:  '3',
  VL_PENDING:         '4',
  EID_RECEIVED:       '5',
  EID_TESTED:         '6',
  EID_TESTED_POC:     '7',
  EID_FAILED_PENDING: '8',
  EID_FAILED_POC:     '9',
  EID_PENDING:        '10',
  TAT_VL_PLASMA1:     '11',
  TAT_VL_PSC:         '12',
  TAT_EID:            '13',
  TAT_VL_PLASMA2:     '33',
  REJET_VL_PLASMA1:   '14',
  REJET_VL_PSC:       '15',
  REJET_EID:          '16',
  REJET_VL_PSC_OPP:   '32',
  RUPTURE_REACTIFS:   '17',
  REACTIFS_PERIMES:   '18',
  REACTIFS_INUTILISABLES: '19',
  AUTRES_REACTIFS:    '20',
  PANNE_EQUIPEMENT:   '21',
  INTERRUPTION_COURANT: '22',
  RUPTURE_CONSOMMABLES: '23',
  PERSONNEL_ABSENT:   '24',
  AUTRES_INCIDENTS:   '25',
  VL_FAILED_REJECT:   '34',
  EID_FAILED_REJECT:  '35',
  EID_FAILED_REJECT_POC: '36',
} as const;

// ── Types ────────────────────────────────────────────────────────────────────
export interface ClaudeRow {
  siteId: string;
  siteName: string;
  metricKey: string;
  metricLabel: string;
  group?: string;
  periodValues: Record<string, number>;
  total: number;
}

export interface ClaudeResult {
  type: string;
  title: string;
  periods: string[];          // ordered period names (columns)
  rows: ClaudeRow[];
}

export interface StockRow {
  intrantCode: number;
  intrantName: string;
  intrantSku: string;
  siteValues: Record<string, number>;   // siteId → availableStock
}

export interface StockResult {
  structures: { id: string; name: string }[];
  rows: StockRow[];
}

export interface StockWeeklyRow {
  intrantCode: number;
  intrantName: string;
  periodValues: Record<string, Record<string, number>>; // periodName → siteId → stock
}

@Injectable({ providedIn: 'root' })
export class SynthesisClaudeService extends SharedService {

  constructor() { super(); }

  fetchReports(request: {
    structure_ids: number[];
    equipment: number;
    start_date: string;
    end_date: string;
  }): Observable<any> {
    return this.query(SynthesisClaudeModel.reportsForMultiSynthesis, {
      request: {
        supervised_structure_ids: request.structure_ids,
        equipment_id: request.equipment,
        start_date: englishFromFrenchDate(request.start_date),
        end_date:   englishFromFrenchDate(request.end_date),
        status_id:  4,
      },
    });
  }

  // ── SHARED HELPERS ─────────────────────────────────────────────────────────

  /** Extract the primary structure from a report (lab users have 1 structure) */
  private siteOf(report: any): { id: string; name: string } {
    return report.account?.structures?.[0] ?? { id: '?', name: 'Inconnu' };
  }

  /** Return all unique periods in chronological order */
  private extractPeriods(reports: any[]): string[] {
    const seen = new Map<string, string>(); // periodName → startDate
    reports.forEach(r => seen.set(r.period.periodName, r.period.startDate));
    return [...seen.entries()]
      .sort(([, a], [, b]) => a.localeCompare(b))
      .map(([name]) => name);
  }

  /** Build an empty period map { periodName: 0 } */
  private zeroPeriods(periods: string[]): Record<string, number> {
    return Object.fromEntries(periods.map(p => [p, 0]));
  }

  /**
   * Generic cross-tab builder.
   * For each report, for each labActivityData entry matching subUnitIds,
   * aggregate by site × period.
   * metricLabelFn maps the lab datum to a human-readable label.
   */
  private buildLabCrossTab(
    reports: any[],
    subUnitIds: string[],
    metricLabelFn: (info: any) => { key: string; label: string; group?: string } | null
  ): ClaudeResult['rows'] & any {
    const periods = this.extractPeriods(reports);
    const map = new Map<string, ClaudeRow>();

    reports.forEach(report => {
      const site = this.siteOf(report);
      const period = report.period.periodName;

      report.labActivityData?.forEach((lad: any) => {
        const suId = lad.information?.informationSubUnit?.id;
        if (!subUnitIds.includes(suId)) return;

        const mapped = metricLabelFn(lad.information);
        if (!mapped) return;

        const rowKey = `${site.id}__${mapped.key}`;
        if (!map.has(rowKey)) {
          map.set(rowKey, {
            siteId:      site.id,
            siteName:    site.name,
            metricKey:   mapped.key,
            metricLabel: mapped.label,
            group:       mapped.group,
            periodValues: this.zeroPeriods(periods),
            total:       0,
          });
        }
        const row = map.get(rowKey)!;
        row.periodValues[period] = (row.periodValues[period] ?? 0) + (lad.value ?? 0);
      });
    });

    // compute totals
    map.forEach(row => {
      row.total = Object.values(row.periodValues).reduce((s, v) => s + v, 0);
    });

    return { periods, rows: [...map.values()] };
  }

  // ── REQ 1 — Échantillons EN ATTENTE par plateforme ─────────────────────────
  computePendingSamples(reports: any[]): ClaudeResult {
    const PENDING_UNITS = [SU.VL_PENDING, SU.EID_PENDING];
    const { periods, rows } = this.buildLabCrossTab(reports, PENDING_UNITS, info => {
      const su = info?.informationSubUnit?.id;
      const ssu = info?.informationSubSubUnit;
      if (su === SU.VL_PENDING) {
        if (!ssu) return { key: 'vl_pending', label: 'VL - En attente (total)' };
        return {
          key:   `vl_pending_${ssu.id}`,
          label: `VL Pending — ${ssu.name}`,
          group: 'Viral Load',
        };
      }
      if (su === SU.EID_PENDING) {
        return { key: 'eid_pending', label: 'EID - En attente', group: 'EID' };
      }
      return null;
    });
    return { type: 'PENDING', title: 'Échantillons en attente par plateforme', periods, rows };
  }

  // ── REQ 3 — Reçus / Testés (Plasma, PSC, EID) par site et semaine ──────────
  computeSamplesReceivedTested(reports: any[]): ClaudeResult {
    const UNITS = [
      SU.VL_RECEIVED, SU.VL_TESTED,
      SU.EID_RECEIVED, SU.EID_TESTED, SU.EID_TESTED_POC,
    ];
    const ACTION_LABEL: Record<string, string> = {
      [SU.VL_RECEIVED]:  'Reçus',
      [SU.VL_TESTED]:    'Testés',
      [SU.EID_RECEIVED]: 'Reçus',
      [SU.EID_TESTED]:   'Testés',
      [SU.EID_TESTED_POC]: 'Testés (POC)',
    };
    const { periods, rows } = this.buildLabCrossTab(reports, UNITS, info => {
      const su  = info?.informationSubUnit?.id;
      const ssu = info?.informationSubSubUnit;
      const action = ACTION_LABEL[su] ?? '';

      if ([SU.VL_RECEIVED, SU.VL_TESTED].includes(su)) {
        const typeName = ssu ? ssu.name : 'VL';
        return {
          key:   `${su}_${ssu?.id ?? 'vl'}`,
          label: `VL ${typeName} — ${action}`,
          group: `VL ${typeName}`,
        };
      }
      if ([SU.EID_RECEIVED, SU.EID_TESTED, SU.EID_TESTED_POC].includes(su)) {
        return { key: `eid_${su}`, label: `EID — ${action}`, group: 'EID' };
      }
      return null;
    });
    return {
      type: 'RECEIVED_TESTED',
      title: 'Échantillons reçus et testés (Plasma / PSC / EID) — par site et semaine',
      periods,
      rows,
    };
  }

  // ── REQ 4 — Échoués et en attente de retesting ────────────────────────────
  computeFailedSamples(reports: any[]): ClaudeResult {
    const UNITS = [
      SU.VL_FAILED_PENDING, SU.VL_FAILED_REJECT,
      SU.EID_FAILED_PENDING, SU.EID_FAILED_POC,
      SU.EID_FAILED_REJECT, SU.EID_FAILED_REJECT_POC,
    ];
    const LABEL: Record<string, string> = {
      [SU.VL_FAILED_PENDING]:     'VL — Échoués / Retesting',
      [SU.VL_FAILED_REJECT]:      'VL — Échoués / À rejeter',
      [SU.EID_FAILED_PENDING]:    'EID — Échoués / Retesting',
      [SU.EID_FAILED_POC]:        'EID POC — Échoués / Retesting',
      [SU.EID_FAILED_REJECT]:     'EID — Échoués / À rejeter',
      [SU.EID_FAILED_REJECT_POC]: 'EID POC — Échoués / À rejeter',
    };
    const { periods, rows } = this.buildLabCrossTab(reports, UNITS, info => {
      const su  = info?.informationSubUnit?.id;
      const ssu = info?.informationSubSubUnit;
      if (!LABEL[su]) return null;
      const base = LABEL[su];
      if (ssu) {
        return { key: `${su}_${ssu.id}`, label: `${base} — ${ssu.name}`, group: base };
      }
      return { key: su, label: base };
    });
    return {
      type: 'FAILED',
      title: 'Échantillons échoués et en attente de retesting — par site et semaine',
      periods,
      rows,
    };
  }

  // ── REQ 5 — Stock disponible par site et par semaine ──────────────────────
  computeStockWeekly(reports: any[]): ClaudeResult {
    const periods  = this.extractPeriods(reports);
    const siteSet  = new Map<string, string>();   // siteId → siteName
    const intrantMap = new Map<number, any>();
    // [siteId][intrantCode][period] = availableStock
    const stockMap: Record<string, Record<number, Record<string, number>>> = {};

    reports.forEach(report => {
      const site   = this.siteOf(report);
      const period = report.period.periodName;
      siteSet.set(site.id, site.name);
      if (!stockMap[site.id]) stockMap[site.id] = {};

      report.IntrantMvtData?.forEach((mvt: any) => {
        const code = mvt.intrant?.code;
        if (!code) return;
        if (!intrantMap.has(code)) intrantMap.set(code, mvt.intrant);
        if (!stockMap[site.id][code]) stockMap[site.id][code] = {};
        stockMap[site.id][code][period] =
          (stockMap[site.id][code][period] ?? 0) + (mvt.availableStock ?? 0);
      });
    });

    // Build flat rows: one row per (site × intrant)
    const rows: ClaudeRow[] = [];
    siteSet.forEach((siteName, siteId) => {
      intrantMap.forEach((intrant, code) => {
        const periodValues = this.zeroPeriods(periods);
        if (stockMap[siteId]?.[code]) {
          Object.assign(periodValues, stockMap[siteId][code]);
        }
        const total = Object.values(periodValues).reduce((s, v) => s + v, 0);
        rows.push({
          siteId, siteName,
          metricKey:   `stock_${siteId}_${code}`,
          metricLabel: `${intrant.name} (${intrant.sku ?? ''})`,
          group:       siteName,
          periodValues,
          total,
        });
      });
    });

    return {
      type: 'STOCK_WEEKLY',
      title: 'Stock disponible par site et par semaine',
      periods,
      rows,
    };
  }

  // ── REQ 2 — Intrants disponibles en fin de période par plateforme ──────────
  computeEndOfPeriodStock(reports: any[]): StockResult {
    // Keep only the last report per (site × intrant)
    const siteSet  = new Map<string, string>();
    const intrantMap = new Map<number, any>();
    // siteId → intrantCode → latestStock
    const stockMap: Record<string, Record<number, number>> = {};

    const sorted = [...reports].sort(
      (a, b) => new Date(b.period.endDate).getTime() - new Date(a.period.endDate).getTime()
    );

    sorted.forEach(report => {
      const site = this.siteOf(report);
      siteSet.set(site.id, site.name);
      if (!stockMap[site.id]) stockMap[site.id] = {};

      report.IntrantMvtData?.forEach((mvt: any) => {
        const code = mvt.intrant?.code;
        if (!code) return;
        if (!intrantMap.has(code)) intrantMap.set(code, mvt.intrant);
        // only set if not already set (we sorted desc so first = latest)
        if (stockMap[site.id][code] === undefined) {
          stockMap[site.id][code] = mvt.availableStock ?? 0;
        }
      });
    });

    const structures = [...siteSet.entries()].map(([id, name]) => ({ id, name }));
    const rows: StockRow[] = [];

    intrantMap.forEach((intrant, code) => {
      const siteValues: Record<string, number> = {};
      structures.forEach(s => {
        siteValues[s.id] = stockMap[s.id]?.[code] ?? 0;
      });
      rows.push({
        intrantCode: code,
        intrantName: intrant.name,
        intrantSku:  intrant.sku ?? '',
        siteValues,
      });
    });

    return { structures, rows };
  }

  // ── REQ 6 — Moyenne TAT par site et semaine ───────────────────────────────
  computeTat(reports: any[]): ClaudeResult {
    const TAT_UNITS = [SU.TAT_VL_PLASMA1, SU.TAT_VL_PSC, SU.TAT_EID, SU.TAT_VL_PLASMA2];
    const TAT_LABEL: Record<string, string> = {
      [SU.TAT_VL_PLASMA1]: 'TAT — VL Plasma VIH1',
      [SU.TAT_VL_PSC]:     'TAT — VL PSC',
      [SU.TAT_EID]:        'TAT — EID',
      [SU.TAT_VL_PLASMA2]: 'TAT — VL Plasma VIH2',
    };

    const periods = this.extractPeriods(reports);
    // accumulate: siteId_metricKey_period → { sum, count }
    const acc = new Map<string, { sum: number; count: number }>();

    reports.forEach(report => {
      const site   = this.siteOf(report);
      const period = report.period.periodName;

      report.labActivityData?.forEach((lad: any) => {
        const su = lad.information?.informationSubUnit?.id;
        if (!TAT_UNITS.includes(su)) return;
        const key = `${site.id}__${su}__${period}`;
        const existing = acc.get(key) ?? { sum: 0, count: 0 };
        existing.sum   += lad.value ?? 0;
        existing.count += 1;
        acc.set(key, existing);
      });
    });

    // Build rows
    const rowMap = new Map<string, ClaudeRow>();
    acc.forEach(({ sum, count }, key) => {
      const [siteId, su, period] = key.split('__');
      const rowKey = `${siteId}__${su}`;
      if (!rowMap.has(rowKey)) {
        const site = reports.flatMap(r =>
          r.account?.structures ?? []
        ).find((s: any) => s.id === siteId);
        rowMap.set(rowKey, {
          siteId,
          siteName:    site?.name ?? siteId,
          metricKey:   rowKey,
          metricLabel: TAT_LABEL[su] ?? su,
          group:       'TAT',
          periodValues: this.zeroPeriods(periods),
          total:       0,
        });
      }
      const row = rowMap.get(rowKey)!;
      row.periodValues[period] = count > 0 ? +(sum / count).toFixed(1) : 0;
    });

    const rows = [...rowMap.values()];
    rows.forEach(r => {
      const vals = Object.values(r.periodValues).filter(v => v > 0);
      r.total = vals.length ? +(vals.reduce((s, v) => s + v, 0) / vals.length).toFixed(1) : 0;
    });

    return {
      type: 'TAT',
      title: 'Délai moyen d\'exécution des analyses (TAT) — par site et semaine',
      periods,
      rows,
    };
  }

  // ── REQ 7 — Qualité et rejets par catégorie ───────────────────────────────
  computeRejections(reports: any[]): ClaudeResult {
    const REJET_UNITS = [SU.REJET_VL_PLASMA1, SU.REJET_VL_PSC, SU.REJET_EID, SU.REJET_VL_PSC_OPP];
    const REJET_LABEL: Record<string, string> = {
      [SU.REJET_VL_PLASMA1]: 'VL Plasma VIH1',
      [SU.REJET_VL_PSC]:     'VL PSC',
      [SU.REJET_EID]:        'EID',
      [SU.REJET_VL_PSC_OPP]: 'VL PSC (OPP)',
    };
    const { periods, rows } = this.buildLabCrossTab(reports, REJET_UNITS, info => {
      const su  = info?.informationSubUnit?.id;
      const ssu = info?.informationSubSubUnit;
      if (!REJET_LABEL[su]) return null;
      const category   = REJET_LABEL[su];
      const motifLabel = ssu ? ssu.name : 'Total';
      return {
        key:   `${su}_${ssu?.id ?? 'total'}`,
        label: `${category} — ${motifLabel}`,
        group: category,
      };
    });
    return {
      type: 'REJECTIONS',
      title: 'Qualité des échantillons à la réception — Rejets par catégorie',
      periods,
      rows,
    };
  }

  // ── REQ 8 — Interruptions et pannes par site et semaine ───────────────────
  computeBreakdowns(reports: any[]): ClaudeResult {
    const BREAKDOWN_UNITS = [
      SU.RUPTURE_REACTIFS, SU.REACTIFS_PERIMES, SU.REACTIFS_INUTILISABLES,
      SU.AUTRES_REACTIFS, SU.PANNE_EQUIPEMENT, SU.INTERRUPTION_COURANT,
      SU.RUPTURE_CONSOMMABLES, SU.PERSONNEL_ABSENT, SU.AUTRES_INCIDENTS,
    ];
    const BREAKDOWN_LABEL: Record<string, { label: string; group: string }> = {
      [SU.RUPTURE_REACTIFS]:       { label: 'Rupture de réactifs (jours)',           group: 'Réactifs' },
      [SU.REACTIFS_PERIMES]:       { label: 'Réactifs périmés (jours)',               group: 'Réactifs' },
      [SU.REACTIFS_INUTILISABLES]: { label: 'Réactifs inutilisables',                group: 'Réactifs' },
      [SU.AUTRES_REACTIFS]:        { label: 'Autres (réactifs)',                      group: 'Réactifs' },
      [SU.PANNE_EQUIPEMENT]:       { label: 'Panne équipement (jours)',              group: 'Équipement & Infrastructure' },
      [SU.INTERRUPTION_COURANT]:   { label: 'Interruption courant (heures/jours)',   group: 'Équipement & Infrastructure' },
      [SU.RUPTURE_CONSOMMABLES]:   { label: 'Rupture de consommables (jours)',       group: 'Équipement & Infrastructure' },
      [SU.PERSONNEL_ABSENT]:       { label: 'Personnel absent',                      group: 'Ressources Humaines' },
      [SU.AUTRES_INCIDENTS]:       { label: 'Autres incidents techniques',            group: 'Ressources Humaines' },
    };
    const { periods, rows } = this.buildLabCrossTab(reports, BREAKDOWN_UNITS, info => {
      const su = info?.informationSubUnit?.id;
      const meta = BREAKDOWN_LABEL[su];
      if (!meta) return null;
      return { key: su, label: meta.label, group: meta.group };
    });
    return {
      type: 'BREAKDOWNS',
      title: 'Interruptions de service et pannes — par site et semaine',
      periods,
      rows,
    };
  }

  /** Dispatch to correct compute method based on synthesis option id */
  compute(optionId: string, reports: any[]): ClaudeResult | null {
    switch (optionId) {
      case 'PENDING':         return this.computePendingSamples(reports);
      case 'RECEIVED_TESTED': return this.computeSamplesReceivedTested(reports);
      case 'FAILED':          return this.computeFailedSamples(reports);
      case 'STOCK_WEEKLY':    return this.computeStockWeekly(reports);
      case 'TAT':             return this.computeTat(reports);
      case 'REJECTIONS':      return this.computeRejections(reports);
      case 'BREAKDOWNS':      return this.computeBreakdowns(reports);
      default: return null;
    }
  }

  computeStock(reports: any[]): StockResult {
    return this.computeEndOfPeriodStock(reports);
  }
}
