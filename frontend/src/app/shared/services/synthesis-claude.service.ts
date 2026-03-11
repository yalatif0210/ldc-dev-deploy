import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { SharedService } from './shared.service';
import SynthesisClaudeModel from '@shared/models/synthesis-claude.model';
import TransactionModel from '@shared/models/transaction.model';
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
  subGroup?: string;    // REQ 3: 'Reçus' | 'Testés' | 'Testés (POC)'
  metricSku?: string;   // REQ 5: SKU column for stock weekly
  periodValues: Record<string, number>;
  total: number;
}

export interface ClaudeResult {
  type: string;
  title: string;
  periods: string[];
  rows: ClaudeRow[];
}

export interface StockRow {
  intrantCode: number;
  intrantName: string;
  intrantSku: string;
  siteValues: Record<string, number>;   // already rounded with roundFactor
}

export interface StockResult {
  structures: { id: string; name: string }[];
  rows: StockRow[];
}

export interface TransferRow {
  id: string;
  date: string;
  origin: string;
  destination: string;
  productName: string;
  quantity: number;
  approved: boolean;
  isRejected: boolean;
}

@Injectable({ providedIn: 'root' })
export class SynthesisClaudeService extends SharedService {

  constructor() { super(); }

  // ── FETCH ──────────────────────────────────────────────────────────────────
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

  fetchTransactions(startDate: string, endDate: string): Observable<TransferRow[]> {
    return this.query(TransactionModel.TRANSACTION_BY_DATE_RANGE, {
      request: { start_date: startDate, end_date: endDate },
    }).pipe(map((res: any) => res?.data?.transactionByDateRange ?? []));
  }

  // ── SHARED HELPERS ─────────────────────────────────────────────────────────

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

  private zeroPeriods(periods: string[]): Record<string, number> {
    return Object.fromEntries(periods.map(p => [p, 0]));
  }

  private roundStock(stock: number, roundFactor: number): number {
    const rf = Math.max(1, roundFactor ?? 1);
    return Math.ceil(stock / rf);
  }

  private buildLabCrossTab(
    reports: any[],
    subUnitIds: string[],
    metricLabelFn: (info: any) => { key: string; label: string; group?: string; subGroup?: string } | null
  ): { periods: string[]; rows: ClaudeRow[] } {
    const periods = this.extractPeriods(reports);
    const map = new Map<string, ClaudeRow>();

    reports.forEach(report => {
      const site   = this.siteOf(report);
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
            subGroup:    mapped.subGroup,
            periodValues: this.zeroPeriods(periods),
            total:       0,
          });
        }
        const row = map.get(rowKey)!;
        row.periodValues[period] = (row.periodValues[period] ?? 0) + (lad.value ?? 0);
      });
    });

    map.forEach(row => {
      row.total = Object.values(row.periodValues).reduce((s, v) => s + v, 0);
    });

    return { periods, rows: [...map.values()] };
  }

  // ── REQ 1 — Échantillons EN ATTENTE par plateforme ─────────────────────────
  computePendingSamples(reports: any[]): ClaudeResult {
    const PENDING_UNITS = [SU.VL_PENDING, SU.EID_PENDING];
    const { periods, rows } = this.buildLabCrossTab(reports, PENDING_UNITS, info => {
      const su  = info?.informationSubUnit?.id;
      const ssu = info?.informationSubSubUnit;
      if (su === SU.VL_PENDING) {
        if (!ssu) return { key: 'vl_pending_total', label: 'VL — En attente (total)', group: 'Charge Virale' };
        return { key: `vl_pending_${ssu.id}`, label: `VL — En attente ${ssu.name}`, group: 'Charge Virale' };
      }
      if (su === SU.EID_PENDING) {
        return { key: 'eid_pending', label: 'EID — En attente', group: 'EID' };
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
      [SU.VL_RECEIVED]:    'Reçus',
      [SU.VL_TESTED]:      'Testés',
      [SU.EID_RECEIVED]:   'Reçus',
      [SU.EID_TESTED]:     'Testés',
      [SU.EID_TESTED_POC]: 'Testés (POC)',
    };
    const { periods, rows } = this.buildLabCrossTab(reports, UNITS, info => {
      const su     = info?.informationSubUnit?.id;
      const ssu    = info?.informationSubSubUnit;
      const action = ACTION_LABEL[su] ?? '';

      if ([SU.VL_RECEIVED, SU.VL_TESTED].includes(su)) {
        const typeName = ssu ? ssu.name : 'VL';
        const group    = `VL ${typeName}`;
        return {
          key:      `${su}_${ssu?.id ?? 'vl'}`,
          label:    `${group} — ${action}`,
          group,
          subGroup: action,
        };
      }
      if ([SU.EID_RECEIVED, SU.EID_TESTED, SU.EID_TESTED_POC].includes(su)) {
        return {
          key:      `eid_${su}`,
          label:    `EID — ${action}`,
          group:    'EID',
          subGroup: action,
        };
      }
      return null;
    });
    return {
      type:    'RECEIVED_TESTED',
      title:   'Échantillons reçus et testés (Plasma / PSC / EID) — par site et semaine',
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
      if (ssu) return { key: `${su}_${ssu.id}`, label: `${base} — ${ssu.name}`, group: base };
      return { key: su, label: base };
    });
    return {
      type:  'FAILED',
      title: 'Échantillons échoués et en attente de retesting — par site et semaine',
      periods,
      rows,
    };
  }

  // ── REQ 5 — Stock disponible par site et par semaine ──────────────────────
  computeStockWeekly(reports: any[]): ClaudeResult {
    const periods    = this.extractPeriods(reports);
    const siteSet    = new Map<string, string>();
    const intrantMap = new Map<number, any>();
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
        const rf = Math.max(1, mvt.intrant?.roundFactor ?? 1);
        stockMap[site.id][code][period] =
          (stockMap[site.id][code][period] ?? 0) + this.roundStock(mvt.availableStock ?? 0, rf);
      });
    });

    const rows: ClaudeRow[] = [];
    siteSet.forEach((siteName, siteId) => {
      intrantMap.forEach((intrant, code) => {
        const periodValues = this.zeroPeriods(periods);
        if (stockMap[siteId]?.[code]) Object.assign(periodValues, stockMap[siteId][code]);
        const total = Object.values(periodValues).reduce((s, v) => s + v, 0);
        rows.push({
          siteId, siteName,
          metricKey:   `stock_${siteId}_${code}`,
          metricLabel: intrant.name,
          metricSku:   intrant.sku ?? '',
          group:       siteName,
          periodValues,
          total,
        });
      });
    });

    return { type: 'STOCK_WEEKLY', title: 'Stock disponible par site et par semaine', periods, rows };
  }

  // ── REQ 2 — Intrants disponibles en fin de période par plateforme ──────────
  computeEndOfPeriodStock(reports: any[]): StockResult {
    const siteSet    = new Map<string, string>();
    const intrantMap = new Map<number, any>();
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
        if (stockMap[site.id][code] === undefined) {
          const rf = Math.max(1, mvt.intrant?.roundFactor ?? 1);
          stockMap[site.id][code] = this.roundStock(mvt.availableStock ?? 0, rf);
        }
      });
    });

    const structures = [...siteSet.entries()].map(([id, name]) => ({ id, name }));
    const rows: StockRow[] = [];

    intrantMap.forEach((intrant, code) => {
      const siteValues: Record<string, number> = {};
      structures.forEach(s => { siteValues[s.id] = stockMap[s.id]?.[code] ?? 0; });
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

    const rowMap = new Map<string, ClaudeRow>();
    acc.forEach(({ sum, count }, key) => {
      const [siteId, su, period] = key.split('__');
      const rowKey = `${siteId}__${su}`;
      if (!rowMap.has(rowKey)) {
        const site = reports.flatMap(r => r.account?.structures ?? []).find((s: any) => s.id === siteId);
        rowMap.set(rowKey, {
          siteId,
          siteName:     site?.name ?? siteId,
          metricKey:    rowKey,
          metricLabel:  TAT_LABEL[su] ?? su,
          group:        TAT_LABEL[su] ?? su,   // group = indicator for subtotals per indicator
          periodValues: this.zeroPeriods(periods),
          total:        0,
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
      type:    'TAT',
      title:   "Délai moyen d'exécution des analyses (TAT) — par site et semaine",
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
      [SU.REJET_VL_PSC_OPP]: 'VL PSC (OPP BRUKER)',
    };
    const { periods, rows } = this.buildLabCrossTab(reports, REJET_UNITS, info => {
      const su  = info?.informationSubUnit?.id;
      const ssu = info?.informationSubSubUnit;
      if (!REJET_LABEL[su]) return null;
      const category   = REJET_LABEL[su];
      const motifLabel = ssu ? ssu.name : 'Total';
      return { key: `${su}_${ssu?.id ?? 'total'}`, label: `${category} — ${motifLabel}`, group: category };
    });
    return {
      type:  'REJECTIONS',
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
      [SU.RUPTURE_REACTIFS]:       { label: 'Rupture de réactifs (jours)',          group: 'Réactifs' },
      [SU.REACTIFS_PERIMES]:       { label: 'Réactifs périmés (jours)',              group: 'Réactifs' },
      [SU.REACTIFS_INUTILISABLES]: { label: 'Réactifs inutilisables',               group: 'Réactifs' },
      [SU.AUTRES_REACTIFS]:        { label: 'Autres (réactifs)',                     group: 'Réactifs' },
      [SU.PANNE_EQUIPEMENT]:       { label: 'Panne équipement (jours)',             group: 'Équipement & Infrastructure' },
      [SU.INTERRUPTION_COURANT]:   { label: 'Interruption courant (heures/jours)',  group: 'Équipement & Infrastructure' },
      [SU.RUPTURE_CONSOMMABLES]:   { label: 'Rupture de consommables (jours)',      group: 'Équipement & Infrastructure' },
      [SU.PERSONNEL_ABSENT]:       { label: 'Personnel absent',                     group: 'Ressources Humaines' },
      [SU.AUTRES_INCIDENTS]:       { label: 'Autres incidents techniques',           group: 'Ressources Humaines' },
    };
    const { periods, rows } = this.buildLabCrossTab(reports, BREAKDOWN_UNITS, info => {
      const su   = info?.informationSubUnit?.id;
      const meta = BREAKDOWN_LABEL[su];
      if (!meta) return null;
      return { key: su, label: meta.label, group: meta.group };
    });
    return {
      type:  'BREAKDOWNS',
      title: 'Interruptions de service et pannes — par site et semaine',
      periods,
      rows,
    };
  }

  // ── REQ 9 — Quantité d'intrants utilisés par site et par période ──────────
  computeIntrantsUsed(reports: any[]): ClaudeResult {
    const periods    = this.extractPeriods(reports);
    const siteSet    = new Map<string, string>();
    const intrantMap = new Map<number, any>();
    const usedMap: Record<string, Record<number, Record<string, number>>> = {};

    reports.forEach(report => {
      const site   = this.siteOf(report);
      const period = report.period.periodName;
      siteSet.set(site.id, site.name);
      if (!usedMap[site.id]) usedMap[site.id] = {};

      report.IntrantMvtData?.forEach((mvt: any) => {
        const code = mvt.intrant?.code;
        if (!code) return;
        if (!intrantMap.has(code)) intrantMap.set(code, mvt.intrant);
        if (!usedMap[site.id][code]) usedMap[site.id][code] = {};
        const rf = Math.max(1, mvt.intrant?.roundFactor ?? 1);
        usedMap[site.id][code][period] =
          (usedMap[site.id][code][period] ?? 0) + this.roundStock(mvt.distributionStock ?? 0, rf);
      });
    });

    const rows: ClaudeRow[] = [];
    siteSet.forEach((siteName, siteId) => {
      intrantMap.forEach((intrant, code) => {
        const periodValues = this.zeroPeriods(periods);
        if (usedMap[siteId]?.[code]) Object.assign(periodValues, usedMap[siteId][code]);
        const total = Object.values(periodValues).reduce((s, v) => s + v, 0);
        rows.push({
          siteId, siteName,
          metricKey:   `used_${siteId}_${code}`,
          metricLabel: intrant.name,
          metricSku:   intrant.sku ?? '',
          group:       siteName,
          periodValues,
          total,
        });
      });
    });

    return {
      type:  'INTRANTS_USED',
      title: "Quantité d'intrants utilisés par site et par période",
      periods,
      rows,
    };
  }

  // ── REQ 10 — Transferts d'échantillons entre sites par période ─────────────
  computeTransfers(transactions: any[], structureIds: string[]): TransferRow[] {
    const rows: TransferRow[] = [];
    transactions
      .filter(tx => structureIds.includes(String(tx.origin?.id)) || structureIds.includes(String(tx.destination?.id)))
      .forEach(tx => {
        tx.sanguineProductTransactions?.forEach((spt: any) => {
          rows.push({
            id:          tx.id,
            date:        tx.createdAt ? new Date(tx.createdAt).toLocaleDateString('fr-FR') : '—',
            origin:      tx.origin?.name ?? '?',
            destination: tx.destination?.name ?? '?',
            productName: spt.sanguineProduct?.name ?? '?',
            quantity:    spt.quantity ?? 0,
            approved:    tx.approved ?? false,
            isRejected:  tx.isRejected ?? false,
          });
        });
      });
    return rows.sort((a, b) => a.date.localeCompare(b.date));
  }

  // ── REQ 11 — Quantité d'intrants utilisés (pivot intrant × site) ─────────
  computeIntrantsUsedPivot(reports: any[]): StockResult {
    const siteSet    = new Map<string, string>();
    const intrantMap = new Map<number, any>();
    const usedMap: Record<string, Record<number, number>> = {};

    reports.forEach(report => {
      const site = this.siteOf(report);
      siteSet.set(site.id, site.name);
      if (!usedMap[site.id]) usedMap[site.id] = {};

      report.IntrantMvtData?.forEach((mvt: any) => {
        const code = mvt.intrant?.code;
        if (!code) return;
        if (!intrantMap.has(code)) intrantMap.set(code, mvt.intrant);
        const rf = Math.max(1, mvt.intrant?.roundFactor ?? 1);
        usedMap[site.id][code] =
          (usedMap[site.id][code] ?? 0) + this.roundStock(mvt.distributionStock ?? 0, rf);
      });
    });

    const structures = [...siteSet.entries()].map(([id, name]) => ({ id, name }));
    const rows: StockRow[] = [];

    intrantMap.forEach((intrant, code) => {
      const siteValues: Record<string, number> = {};
      structures.forEach(s => { siteValues[s.id] = usedMap[s.id]?.[code] ?? 0; });
      rows.push({
        intrantCode: code,
        intrantName: intrant.name,
        intrantSku:  intrant.sku ?? '',
        siteValues,
      });
    });

    return { structures, rows };
  }

  // ── DISPATCHER ──────────────────────────────────────────────────────────────
  compute(optionId: string, reports: any[]): ClaudeResult | null {
    switch (optionId) {
      case 'PENDING':         return this.computePendingSamples(reports);
      case 'RECEIVED_TESTED': return this.computeSamplesReceivedTested(reports);
      case 'FAILED':          return this.computeFailedSamples(reports);
      case 'STOCK_WEEKLY':    return this.computeStockWeekly(reports);
      case 'TAT':             return this.computeTat(reports);
      case 'REJECTIONS':      return this.computeRejections(reports);
      case 'BREAKDOWNS':      return this.computeBreakdowns(reports);
      case 'INTRANTS_USED':   return this.computeIntrantsUsed(reports);
      default: return null;
    }
  }

  computeStock(reports: any[]): StockResult {
    return this.computeEndOfPeriodStock(reports);
  }

  computeStockUsedPivot(reports: any[]): StockResult {
    return this.computeIntrantsUsedPivot(reports);
  }
}
