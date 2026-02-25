import { inject, Injectable, output } from '@angular/core';
import { AbstractControl, ValidationErrors, ValidatorFn, FormGroup } from '@angular/forms';
import { SharedService } from '../services/shared.service';
import { map, Observable, of, tap } from 'rxjs';
import ReportModel from '@shared/models/report.model';
import { ReportService } from '@shared/services/report.service';

export enum ValidationTargets {
  CHECK1 = 'Received + Pending (last week) >= Tested',
  CHECK2 = 'Tested >= Failed',
  CHECK3 = 'Pending = Received + Pending (last week) - Tested',
  CHECK4 = 'Failed = ∑Rejection',
}

@Injectable({ providedIn: 'root' })
export class ValidationService extends SharedService {
  private reportService: ReportService = inject(ReportService);
  constructor() {
    super();
  }

  last_report(account_id: number, equipment_id: number): Observable<any> {
    return this.query(ReportModel.reportByAccountAndEquipment, {
      request: { account_id, equipment_id },
    });
  }

  get_last_report_lab_data(data: any, data_id: any): number {
    if (data && data.labActivityData && data.labActivityData.length > 0) {
      const found = data.labActivityData.find(
        (item: any) => Number(item.information.id) === data_id
      );
      return found ? found.value : 0;
    }
    return 0;
  }

  /*########################## LAB VALIDATORS ##########################*/

  lab_value_extraction(
    form_value: { id: string; value: any }[],
    control: any[]
  ): Record<string, any> {
    const values: Record<string, any> = {};
    control.forEach((ctrl: any) => {
      const found = form_value.find((f: any) => f.id === `${ctrl}`);
      if (found) {
        values[ctrl] = Number(found.value);
      }
    });
    return values;
  }

  validateFormGroup(form_value: any) {
    return (
      form_value.filter(
        (field: any) => field.value === null || field.value === undefined || field.value === ''
      ).length === 0
    );
  }

  procedToValidation(
    form_value: any,
    validator_schema: any,
    account_id: number,
    equipment_id: number
  ) {
    console.log('validator_schema', validator_schema);
    return this.last_report(account_id, equipment_id).pipe(
      map(response => {
        const last_report = response.data.reportByAccountAndEquipment;
        const validation_data = this.validationData(form_value, validator_schema, last_report);

        for (const rule of validation_data.results) {
          for (const value of rule.values) {
            value.isValid = this.evaluateRule(value);
          }
        }

        console.log('ok', validation_data);
        return validation_data; // 👉 retourné à l'observable
      })
    );
  }

  evaluateRule(rule: {
    name: string;
    description: string;
    left: number;
    right: number;
    operator: string;
  }): boolean {
    //console.log('Evaluating rule:', rule);
    switch (rule.operator) {
      case '>':
        return rule.left > rule.right;
      case '<':
        return rule.left < rule.right;
      case '>=':
        return rule.left >= rule.right;
      case '<=':
        return rule.left <= rule.right;
      case '=':
        return rule.left === rule.right;
      case '!=':
        return rule.left !== rule.right;
      default:
        throw new Error('Unsupported relation ' + rule.operator);
    }
  }

  validationData(
    form_value: any,
    validator_schema: any,
    last_report_data: any
  ): { target: any; results: any[] } {
    const outPut: { target: any; results: any[] } = {
      target: validator_schema.target,
      results: [],
    };
    for (const rule of validator_schema.rules) {
      const result: { subject: any; values: any[] } = {
        subject: rule.subject,
        values: [],
      };
      console.log('form_value:', form_value);
      const field__list_data = this.lab_value_extraction(form_value, rule.field_list);
      console.log('field__list_data:', field__list_data);
      for (const check of rule.checks) {
        result.values.push({
          name: check.name,
          description: check.description,
          left: this.evaluateSide(check.content.left, field__list_data, last_report_data),
          right: this.evaluateSide(check.content.right, field__list_data, last_report_data),
          operator: check.content.operator,
        });
      }
      outPut.results.push(result);
    }
    //console.log('validation data:', outPut);
    return outPut;
  }

  evaluateSide(
    conditions: { field: string; operator: string | null; isPassDataNeeded: boolean }[],
    field__list_data: Record<string, number>,
    last_report_data: any
  ): number {
    let result = 0;

    for (const cond of conditions) {
      const value = cond.isPassDataNeeded
        ? this.get_last_report_lab_data(last_report_data, cond.field)
        : field__list_data[cond.field];

      if (value === undefined) {
        throw new Error(`Field ${cond.field} not found in dataset`);
      }

      // appliquer l'opérateur
      switch (cond.operator) {
        case '+':
          result += value;
          break;
        case '-':
          result -= value;
          break;
        case '*':
          result *= value;
          break;
        case '/':
          result /= value;
          break;
        case null:
          // opérateur null = ignore, ou remplace ?
          // on suppose: remplace
          result = value;
          break;
        default:
          throw new Error(`Unsupported operator: ${cond.operator}`);
      }
    }

    return result ?? 0;
  }

  // helper pour retourner label lisible
  getLabel(status: boolean): string {
    switch (status) {
      case true:
        return '✔️';
      default:
        return '❌';
    }
  }

  /*########################## END LAB VALIDATORS ##########################*/

  /*########################## PHARM VALIDATORS ##########################*/

  pharm_value_validation(
    initial_qty: number,
    entry_qty: number,
    used_qty: number,
    adjustment: number,
    instock_qty: number
  ): boolean {
    return initial_qty + entry_qty - used_qty + adjustment === instock_qty;
  }

  /*########################## END PHARM VALIDATORS ##########################*/

  areAllValid(
    lab_validation_data: any[],
    pharm_validation_data: any[],
    adjustment_type: any): boolean {
    const lab_all_valid = lab_validation_data.every((result: any) =>
      result.values.every((value: any) => value.isValid)
    );
    console.log('XXX>>>', pharm_validation_data);
    const pharm_all_valid = pharm_validation_data.every(
      (item: any) =>
        item.initial +
          item.entry -
          item.used +
          this.reportService.getCompiledAdjustmentValue(item.adjustments, adjustment_type) ===
        item.stock
    );
    return lab_all_valid && pharm_all_valid;
  }
}
