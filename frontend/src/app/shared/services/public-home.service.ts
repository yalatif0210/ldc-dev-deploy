import { inject, Injectable } from '@angular/core';
import { SharedService } from './shared.service';
import { AuthService } from '@core/authentication/auth.service';
import AccountModel from '@shared/models/account.model';
import { last, Observable } from 'rxjs';
import ReportModel from '@shared/models/report.model';
import { PeriodModel } from '@shared/models/period.model';
import { frenchDate } from '@shared/utils/french-date';
import { CustomButtonComponent } from '@shared/components/custom-button/custom-button';
import { Router } from '@angular/router';
import { ReportStatus, UserRole } from '@core';

@Injectable({
  providedIn: 'root',
})
export class PublicHomeService extends SharedService {
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

  findPeriodByIdGreaterThan(id: any): Observable<any> {
    return this.query(PeriodModel.periodById, { id });
  }

  getLastReportPeriod(equipment_id: any, account_id: any): Observable<any> {
    console.log(
      'Fetching last report period...',
      equipment_id,
      account_id
    );
    return this.query(ReportModel.reportByAccountAndEquipment, {
      request: { account_id, equipment_id },
    });
  }

  attachReportToPeriod(lastReport: any, equipment: any = null) {
    if (lastReport.data.reportByAccountAndEquipment) {
      if (
        [ReportStatus.DRAFT, ReportStatus.SUGGESTED, ReportStatus.SUBMITTED].includes(
          lastReport.data.reportByAccountAndEquipment.status.status
        )
      ) {
        this.periodByIdGreaterThan(
          lastReport.data.reportByAccountAndEquipment.period.id - 1,
          equipment
        );
      } else {
        this.periodByIdGreaterThan(
          lastReport.data.reportByAccountAndEquipment.period.id,
          equipment
        );
      }
    } else {
      this.periodByIdGreaterThan(0, equipment);
    }
  }

  periodByIdGreaterThan(id: any, equipment: any) {
    this.findPeriodByIdGreaterThan(id).subscribe(response => {
      if (response.data.periodsById) {
        this.setList(this.periodToList(response.data.periodsById as any[], equipment));
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
    const navigateTo = '/zver/public/report/fill/laboratory';
    this.router.navigate([navigateTo], {
      queryParams: {
        data: JSON.stringify({ equipment: params.data.equipment, period: params.data.periode }),
      },
    });
    //
  }

  periodToList(periods: any[], equipment: any = null): any[] {
    return periods.map((period: any, index: number) => ({
      mois: period.month.month,
      equipement: equipment ? equipment.name : 'N/A',
      periode: period.periodName,
      ['date de début']: frenchDate(period.startDate),
      ['date de fin']: frenchDate(period.endDate),
      actions: { isActive: index === 0 ? true : false, equipment, period },
    }));
  }
}
