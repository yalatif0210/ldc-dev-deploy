import { inject, Injectable } from '@angular/core';
import { SharedService } from './shared.service';
import { AuthService } from '@core/authentication/auth.service';
import AccountModel from '@shared/models/account.model';
import { last, Observable } from 'rxjs';
import ReportModel from '@shared/models/report.model';
import { PeriodModel } from '@shared/models/period.model';
import { englishDate, englishFromFrenchDate, frenchDate } from '@shared/utils/french-date';
import { CustomButtonComponent } from '@shared/components/custom-button/custom-button';
import { Router } from '@angular/router';
import { ReportStatus, UserRole } from '@core';

export const REQUEST_BY_SYNTHESIS_UNIT = {
  3: ReportModel.reportsBySupervisedStructuresAndEquipmentWithinDateRange,
  4: ReportModel.reportsBySupervisedStructuresAndEquipmentWithinDateRange,
  5: ReportModel.reportsBySupervisedStructuresAndEquipmentWithinDateRange,
  6: ReportModel.reportsBySupervisedStructuresAndEquipmentWithinDateRange,
  7: ReportModel.reportsBySupervisedStructuresAndEquipmentWithinDateRange,
  8: ReportModel.reportsBySupervisedStructuresAndEquipmentWithinDateRange,
  9: ReportModel.reportsBySupervisedStructuresAndEquipmentWithinDateRange,
  10: ReportModel.reportsBySupervisedStructuresAndEquipmentWithinDateRange,
};

@Injectable({
  providedIn: 'root',
})
export class ReportHistoryService extends SharedService {
  private readonly router = inject(Router);

  constructor() {
    super();
  }

  getEquipments(): Observable<any> {
    return this.query(AccountModel.accountEquipment(), { id: this.authService.userAccountId });
  }

  get accountId(): any {
    return this.authService.userAccountId;
  }

  getEquipmentList(account: any) {
    const equipments: any[] = [];
    account &&
      account!.structures!.map((e: any) => {
        e.equipments!.map((eq: any) => {
          equipments.push({ id: eq.id, name: eq.name });
        });
      });
    const uniques = Array.from(new Map(equipments.map(eq => [eq.id, eq])).values());
    return uniques;
  }

  getAdminSuperivisedStructuresIds(structures: any[]): number[] {
    return structures.map(s => Number(s.id));
  }

  getReportsByAccountAndEquipmentWithinDateRange(form_value: any): Observable<any> {
    return this.query(ReportModel.reportsByAccountAndEquipmentWithinDateRange, {
      request: {
        account_id: this.accountId,
        equipment_id: Number(form_value.equipment),
        start_date: englishDate(form_value.start_date),
        end_date: englishDate(form_value.end_date),
        status_id: 4,
      },
    });
  }

  getReportsBySupervisedStructureAndEquipmentWithinDateRange(form_value: any): Observable<any> {
    return this.query(ReportModel.reportsBySupervisedStructureAndEquipmentWithinDateRange, {
      request: {
        supervised_structure_id: Number(form_value.structure),
        equipment_id: Number(form_value.equipment),
        start_date: englishDate(form_value.start_date),
        end_date: englishDate(form_value.end_date),
        status_id: 4,
      },
    });
  }

  // New method to handle multiple supervised structures report fetching
  getReportsBySupervisedStructuresAndEquipmentWithinDateRange(form_value: any): Observable<any> {
    return this.query(
      REQUEST_BY_SYNTHESIS_UNIT[
        form_value.synthesis_unit as keyof typeof REQUEST_BY_SYNTHESIS_UNIT
      ],
      {
        request: {
          supervised_structure_ids: form_value.structure_ids,
          equipment_id: Number(form_value.equipment),
          start_date: englishFromFrenchDate(form_value.start_date),
          end_date: englishFromFrenchDate(form_value.end_date),
          status_id: 4,
        },
      }
    );
  }

  onSubmit(form_value: any, isUserAdminOrSupervisor: boolean) {
    if (isUserAdminOrSupervisor) {
      this.getReportsBySupervisedStructureAndEquipmentWithinDateRange(form_value).subscribe(
        response => {
          console.log('response>>> - report-history.service.ts:104', response);
          if (response.data.reportsBySupervisedStructureAndEquipmentWithinDateRange) {
            this.setList(
              this.reportsToList(
                response.data.reportsBySupervisedStructureAndEquipmentWithinDateRange as any[]
              )
            );
          }
        }
      );
      return;
    }
    this.getReportsByAccountAndEquipmentWithinDateRange(form_value).subscribe(response => {
      console.log('response>>> - report-history.service.ts:117', response);
      if (response.data.reportsByAccountAndEquipmentWithinDateRange) {
        this.setList(
          this.reportsToList(response.data.reportsByAccountAndEquipmentWithinDateRange as any[])
        );
      }
    });
  }

  getColumns(datas: any): any[] {
    const columns = Object.keys(datas[0]);
    return columns.map((col: any, i: number) => {
      if (col === 'action') {
        return {
          headerName: col
            .split('_')
            .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' '),
          field: col,
          cellRenderer: CustomButtonComponent,
          cellRendererParams: (params: any) => ({
            params,
            onClick: this.onAction.bind(this, params),
          }),
        };
      }
      return {
        headerName: col
          .split('_')
          .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' '),
        field: col,
      };
    });
  }

  onAction(params: any) {
    const navigateTo = '/zver/public/report/history';
    this.router.navigate([navigateTo], {
      queryParams: {
        data: JSON.stringify({
          id: params.data.id,
          equipment: params.data.equipment,
          period: params.data.periode,
        }),
      },
    });
    //
  }

  reportsToList(reports: any[]): any[] {
    return reports.map((report: any, index: number) => ({
      id: 'r-' + report.id,
      mois: report.period.month.month,
      ['crée le']: report.createdAt,
      ['entité']: report.account.role.role.split('_')[0],
      equipment: report.equipment.name,
      periode: report.period.periodName,
      ['date de début']: frenchDate(report.period.startDate),
      ['date de fin']: frenchDate(report.period.endDate),
      statut: report.status.status,
      consulter: {
        id: report.id,
        equipment: report.equipment.name,
        period: report.period.periodName,
      },
    }));
  }
}
