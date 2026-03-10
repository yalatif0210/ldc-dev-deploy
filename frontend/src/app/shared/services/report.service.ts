import { inject, Injectable } from '@angular/core';
import { SharedService } from './shared.service';
import { FormGroup } from '@angular/forms';
import StructureModel from '@shared/models/structure.model';
import { forkJoin, map, Observable, takeUntil } from 'rxjs';
import { AuthService } from '@core';
import ReportModel from '@shared/models/report.model';
import EquipmentModel from '@shared/models/equipment.model';
import { isIterable } from 'rxjs/internal/util/isIterable';
import { PeriodModel } from '@shared/models/period.model';
import TransactionModel from '@shared/models/transaction.model';

@Injectable({
  providedIn: 'root',
})
export class ReportService extends SharedService {
  constructor() {
    super();
  }

  createIntrantDTO(intrantsInfos: Record<string, number>, adjustments: any, report: any = false) {
    const keys = Object.keys(intrantsInfos);
    const instock_qty_keys = keys.filter(e => e.includes('instock_qty_for_intrant_'));
    const intrantsDTO: any[] = [];
    instock_qty_keys.forEach(e => {
      const used_qty_key = e.replace('instock_qty_for_intrant_', 'used_qty_for_intrant_');
      const entry_qty_key = e.replace('instock_qty_for_intrant_', 'entry_qty_for_intrant_');
      const initial_qty_key = e.replace('instock_qty_for_intrant_', 'initial_qty_for_intrant_');
      const intrant_id = e.split('instock_qty_for_intrant_')[1];
      const intrantMvtData_id =
        (report &&
          report.IntrantMvtData.find(
            (elmt: any) => elmt.intrant.id === e.split('instock_qty_for_intrant_')[1]
          ).id) ||
        false;
      intrantsDTO.push({
        id: intrantMvtData_id ? intrantMvtData_id : e.split('instock_qty_for_intrant_')[1],
        stock: intrantsInfos[e],
        used: intrantsInfos[used_qty_key],
        entry: intrantsInfos[entry_qty_key],
        adjustments: adjustments[intrant_id] ? adjustments[intrant_id] : [],
        initial: intrantsInfos[initial_qty_key],
      });
    });
    return intrantsDTO;
  }

  createInformationsDTO(informstions: Record<string, number>, report: any = false) {
    const keys = Object.keys(informstions);
    const informationsDTO: any[] = [];
    keys.forEach(key => {
      const labActivityData_id =
        (report &&
          report.labActivityData.find((elmt: any) => elmt.information.id === key.split('unit_')[1])
            .id) ||
        false;
      informationsDTO.push({
        id: labActivityData_id ? labActivityData_id : key.split('unit_')[1],
        value: informstions[key],
      });
    });
    return informationsDTO;
  }

  handleNormalizedAdjustmentMvtForValidation(adjustment_mvt: Record<string, any>) {
    const keys = Object.keys(adjustment_mvt);
    const adjustment_mvt_dto: any[] = [];
    keys.forEach(key => {
      adjustment_mvt_dto.push({
        id: key,
        value: adjustment_mvt[key],
      });
    });
    return adjustment_mvt_dto;
  }

  compareFeedBackDate(
    feedBackDate: string,
    period: { start_date: string; end_date: string }
  ): boolean {
    const feedbackDate = new Date(feedBackDate.split('T')[0]);
    const startDate = new Date(period.start_date);
    const endDate = new Date(period.end_date);

    return feedbackDate >= startDate && feedbackDate <= endDate;
  }

  handleTransactions(
    equipment_name: string,
    transactionByDateRange: any,
    adjustment_mvt: any,
    period: any,
    callback: any = null
  ): any {
    this.getUserInfo().subscribe(res => {
      const transfer_mvt_out = transactionByDateRange.filter(
        (e: any) => e.origin.id === res.structures[0].id &&
          this.compareFeedBackDate(e.createdAt, period) &&
          e.equipment.name === equipment_name
      );
      const transfer_mvt_in = transactionByDateRange.filter(
        (e: any) =>
          e.destination.id === res.structures[0].id &&
          e.equipment_destinataire.name === equipment_name &&
          this.compareFeedBackDate(e.feedbackAt, period) &&
          e.approved == true
      );
      const transfer_mvt_out_result: any[] = [];
      const transfer_mvt_in_result: any[] = [];

      transfer_mvt_in.forEach((e: any) =>
        transfer_mvt_in_result.push(...e.sanguineProductTransactions)
      );

      transfer_mvt_out.forEach((e: any) =>
        transfer_mvt_out_result.push(...e.sanguineProductTransactions)
      );
      this.handleTransactionCompilation(
        transfer_mvt_in_result,
        transfer_mvt_out_result,
        adjustment_mvt
      );
      if (callback) callback({ transfer_mvt_in, transfer_mvt_out });
    });
  }

  handleTransactionCompilation(
    transfer_mvt_in: any[],
    transfer_mvt_out: any[],
    adjustment_mvt: any
  ) {
    const sample = ['Vl Plasma VIH1', 'Vl Plasma VIH2', 'Vl PSC', 'EID Sample'];
    sample.forEach((item: string) => {
      let in_mvt_qty = 0;
      let out_mvt_qty = 0;
      const in_mvt = transfer_mvt_in.filter(
        (e: any) => e.sanguineProduct.name.trim() === item.trim()
      );
      const out_mvt = transfer_mvt_out.filter(
        (e: any) => e.sanguineProduct.name.trim() === item.trim()
      );
      in_mvt.forEach((e: any) => {
        in_mvt_qty += e!.quantity || 0;
      });
      out_mvt.forEach((e: any) => {
        out_mvt_qty += e!.quantity || 0;
      });
      adjustment_mvt[item] = in_mvt_qty - out_mvt_qty;
    });
  }

  //fonction d'injection des données de laboratoire (pending last week & adjustments) dans le formulaire
  handleLabDataInjection(
    information_unit_label: string,
    information_unit: any,
    VIRAL_LOAD_LABEL: string,
    EID_LABEL: string
  ) {
    const copie = JSON.parse(JSON.stringify(information_unit)); // Créer une copie de l'array pour éviter de modifier l'original

    if (information_unit_label.trim() === VIRAL_LOAD_LABEL.trim()) {
      // definition des données de "VL Number Sample Pending (Last Week)"
      const copiedInformationUnit_subUnits_1 = JSON.parse(JSON.stringify(copie.subUnits));
      const vl_number_sample_pending_last_week = copiedInformationUnit_subUnits_1[3];
      vl_number_sample_pending_last_week['name'] = 'VL Number Sample Pending (Last Week)';
      vl_number_sample_pending_last_week.subSubUnits.forEach((subSubUnit: any) => {
        subSubUnit['isPendingLastWeek'] = true;
      });

      // definition des données de "VL Number Sample On Adjustment"
      const copiedInformationUnit_subUnits_2 = JSON.parse(JSON.stringify(copie.subUnits));
      const vl_number_sample_on_adjustment = copiedInformationUnit_subUnits_2[0];
      vl_number_sample_on_adjustment['name'] = 'VL Number Sample On Adjustment';
      vl_number_sample_on_adjustment.subSubUnits.forEach((subSubUnit: any) => {
        subSubUnit['isOnAdjustment'] = true;
      });

      // Insérer "vl_number_sample_on_adjustment" à l'index 4 (dans le tableau initial)
      information_unit.subUnits.splice(3, 0, vl_number_sample_on_adjustment);

      // Insérer "vl_number_sample_pending_last_week" à l'index 0
      information_unit.subUnits.splice(0, 0, vl_number_sample_pending_last_week);
    }

    if (information_unit_label.trim() === EID_LABEL.trim()) {
      // definition des données de "EID Number Sample Pending (Last Week)"
      const copiedInformationUnit_subUnits_1 = JSON.parse(JSON.stringify(copie.subUnits));
      const eid_number_sample_pending_last_week = copiedInformationUnit_subUnits_1[3];
      eid_number_sample_pending_last_week['name'] = 'EID Number Sample Pending (Last Week)';
      eid_number_sample_pending_last_week['isPendingLastWeek'] = true;

      // definition des données de "EID Number Sample On Adjustment"
      const copiedInformationUnit_subUnits_2 = JSON.parse(JSON.stringify(copie.subUnits));
      const eid_number_sample_on_adjustment = copiedInformationUnit_subUnits_2[0];
      eid_number_sample_on_adjustment['name'] = 'EID Number Sample On Adjustment';
      eid_number_sample_on_adjustment['isOnAdjustment'] = true;

      // Insérer "eid_number_sample_on_adjustment" à l'index 4 (dans le tableau initial)
      information_unit.subUnits.splice(3, 0, eid_number_sample_on_adjustment);

      // Insérer "eid_number_sample_pending_last_week" à l'index 0
      information_unit.subUnits.splice(0, 0, eid_number_sample_pending_last_week);
    }
    return information_unit;
  }

  createReportDetails(
    report_id: any,
    status_id: any,
    lab_information_data_inputs: any,
    intrant_information_data_inputs: any,
    for_update: any = false
  ) {
    this.rest.setRestEndpoint(
      for_update ? '/api/report/update-report-details' : '/api/report/create-report-details'
    );
    this.rest
      .query({
        report_id,
        status_id,
        lab_information_data_inputs,
        intrant_information_data_inputs,
      })
      .subscribe({
        next: response => {},
        error: error => {},
      });
  }

  getUserInfo() {
    return this.userInformation().pipe(
      map((res: any) => {
        if (res.data && res.data.account) {
          return res.data.account;
        }
      })
    );
  }

  findReportByAccountAndEquipmentAndPeriodAlso(
    equipment_name: string,
    period_name: string
  ): Observable<any> {
    return this.query(ReportModel.reportByAccountAndEquipmentAndPeriodAlso, {
      request: {
        account_id: this.authService.userAccountId,
        equipment_name,
        period_name,
      },
    });
  }

  getAdjustmentsFromExistingReport(intrant_mvt_data: any) {
    const adjustments: Record<string, Record<string, any>[] | any> = {};
    intrant_mvt_data?.forEach((item: any) => {
      const intrant_adjustment: any[] = [];
      item?.adjustments?.forEach((adjustment: any) => {
        intrant_adjustment.push({
          id: adjustment.id,
          type: adjustment.adjustmentType.id,
          quantity: adjustment.quantity,
          comment: adjustment.comment,
        });
      });
      adjustments[item.intrant.id] = intrant_adjustment;
    });
    return adjustments;
  }

  getCompiledAdjustmentValue(adjustments: Record<string, any>[], adjustment_types: any): number {
    const keys = Object.keys(adjustments);
    let somme = 0;
    for (const item of adjustments) {
      const signe = adjustment_types.find((e: any) => e.id === item.type)?.type;
      //console.log(signe);
      if (signe === 'positif') {
        somme += item.quantity;
      } else {
        somme -= item.quantity;
      }
    }
    return somme;
  }

  compileAdjustments(
    adjustments: Record<string, Record<string, any>[] | any>,
    adjustment_types: any
  ) {
    const keys = Object.keys(adjustments);
    keys.forEach((key: any) => {
      let somme = 0;
      const datas = adjustments[key];
      if (isIterable(datas)) {
        for (const item of datas) {
          const signe = adjustment_types.find((e: any) => e.id === item.type)?.type;
          if (signe === 'positif') {
            somme += item.quantity;
          } else {
            somme -= item.quantity;
          }
        }
      }
      adjustments['somme_' + key] = somme;
    });
    return adjustments;
  }

  findLastFinalizedReportByEquipmentAndAccount(equipment_name: string) {
    return this.query(ReportModel.lastFinalizedReportByEquipmentAndAccount, {
      request: {
        account_id: this.authService.userAccountId,
        equipment_name,
      },
    }).pipe(
      map((response: any) => {
        return response.data.lastFinalizedReportByEquipmentAndAccount;
      })
    );
  }

  findPeriodByName(name: string) {
    return this.query(PeriodModel.periodByName, { name }).pipe(
      map((response: any) => response.data.periodByName)
    );
  }

  findTransactionByDateRange(request: any) {
    return this.query(TransactionModel.TRANSACTION_BY_DATE_RANGE, { request }).pipe(
      map((response: any) => response.data.transactionByDateRange)
    );
  }

  findLastsFinalizedReportByEquipmentAndAccount(equipment_name: string) {
    return this.query(ReportModel.lastsFinalizedReportByEquipmentAndAccount, {
      request: {
        account_id: this.authService.userAccountId,
        equipment_name,
      },
    }).pipe(map((response: any) => response.data.lastsFinalizedReportByEquipmentAndAccount));
  }

  findReportById(id: any): Observable<any> {
    return this.query(ReportModel.reportById, {
      id,
    });
  }

  get_adjustment_type(): Observable<any> {
    return this.query(ReportModel.adjustment_type);
  }

  get_last_report_pharm_data(data: any, data_id: any): number {
    if (data && data.length > 0) {
      const found = data.find((item: any) => item.intrant.id === data_id);
      return found ? found.availableStock : 0;
    }
    return 0;
  }

  createReport(equipment_name: string, period_name: string): Observable<any> {
    return this.query(ReportModel.createReport, {
      input: {
        account_id: this.authService.userAccountId,
        equipment_name,
        period_name,
      },
    });
  }

  getEquipmentInfo(equipment_name: string): Observable<any> {
    return this.query(EquipmentModel.equipmentInforamtionByName, {
      name: equipment_name,
    });
  }

  getEquipmentId(equipment_name: string): Observable<any> {
    return this.query(EquipmentModel.equipmentIdByName, {
      name: equipment_name,
    });
  }

  getInformationDTOForValidation(
    lab_information_data_inputs: Record<string, number>
  ): Record<string, number>[] {
    const informationDTO: any[] = [];
    for (const key in lab_information_data_inputs) {
      informationDTO.push({
        id: key.split('unit_')[1],
        value: lab_information_data_inputs[key],
      });
    }
    return informationDTO;
  }
}
