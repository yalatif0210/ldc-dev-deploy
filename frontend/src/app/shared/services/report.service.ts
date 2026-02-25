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
    console.log('intrantsDTO - report.service.ts:45', intrantsDTO);
    return intrantsDTO;
  }

  createInformationsDTO(informstions: Record<string, number>, report: any = false) {
    const keys = Object.keys(informstions);
    const informationsDTO: any[] = [];
    keys.map(key => {
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
    console.log('informationsDTO - report.service.ts:63', informationsDTO);
    return informationsDTO;
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
    console.log(keys);
    keys.forEach((key: any) => {
      let somme = 0;
      const datas = adjustments[key];
      if (isIterable(datas)) {
        for (const item of datas) {
          const signe = adjustment_types.find((e: any) => e.id === item.type)?.type;
          console.log(signe);
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
    }).pipe(map((response: any) => {
      console.log('lastFinalizedReportByEquipmentAndAccount - report.service.ts:177', response);
      return response.data.lastFinalizedReportByEquipmentAndAccount;
    }));
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
