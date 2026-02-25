import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Cacheable, LocalStorageStrategy } from 'ts-cacheable';

import { GraphqlService } from '@core/api-services/graphql.service';
import EquipmentModel from '@shared/models/equipment.model';
import RegionModel from '@shared/models/region.model';
import StructureModel from '@shared/models/structure.model';
import UserModel from '@shared/models/user.model';
import { Dispatcher } from '@shared/services/dispatcher';
import { RestService } from '@core/api-services/rest.service';
import AccountModel from '@shared/models/account.model';
import { AuthService } from '@core/authentication/auth.service';
import { PeriodModel } from '@shared/models/period.model';
import ReportModel from '@shared/models/report.model';

export interface TestDatas {
  name: string;
  position: string;
  office: string;
  ext: string;
  startDate: string;
  salary: number;
  // Add other user properties as needed
}

@Injectable({
  providedIn: 'root',
})
export class SharedService extends GraphqlService {
  public list: { datas: any[]; columns: any[] } = { datas: [], columns: [] };
  private readonly dispatcher = inject(Dispatcher);
  protected readonly rest = inject(RestService);
  protected readonly authService = inject(AuthService);
  constructor() {
    super();
  }

  @Cacheable({ storageStrategy: LocalStorageStrategy, maxAge: 60 * 60 * 1000 })
  getUserRolesFromRemote(): Observable<any> {
    return this.query(UserModel.userRole());
  }

  @Cacheable({ storageStrategy: LocalStorageStrategy, maxAge: 60 * 60 * 1000 })
  getRegion(): Observable<any> {
    return this.query(RegionModel.regions());
  }

  @Cacheable({ storageStrategy: LocalStorageStrategy, maxAge: 60 * 60 * 1000 })
  getStructure(): Observable<any> {
    return this.query(StructureModel.structures());
  }

  getEquipments(): Observable<any> {
    return this.query(EquipmentModel.equipments());
  }

  userInformation(): Observable<any> {
    return this.query(AccountModel.accountById, { id: this.authService.userAccountId });
  }

  userStructureByReportId(id: any): Observable<any> {
    return this.query(ReportModel.structureByReportId, { id });
  }

  isUserAdminOrSupervisor(): boolean {
    return this.authService.isUserAdminOrSupervisor(this.authService.userRoleByToken);
  }

  @Cacheable({ storageStrategy: LocalStorageStrategy, maxAge: 60 * 60 * 1000 })
  getAccountEquipments(): Observable<any> {
    return this.query(AccountModel.accountEquipment(), { id: this.authService.userAccountId });
  }

  @Cacheable({ storageStrategy: LocalStorageStrategy, maxAge: 60 * 60 * 1000 })
  getEquipmentById(id: number): Observable<any> {
    return this.query(EquipmentModel.equipmentById(id));
  }

  getPeriods(): Observable<any> {
    return this.query(PeriodModel.periods());
  }

  getColumns(datas: any): any[] {
    const columns = Object.keys(datas[0]);
    return columns.map((col: any, i: number) => {
      return {
        headerName: col
          .split('_')
          .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' '),
        field: col,
      };
    });
  }

  setList(datas: any[]) {
    console.log('setList - shared.service.ts:98', datas);
    this.dispatcher.dispatch(
      datas.length ? { datas, columns: this.getColumns(datas) } : { datas: [], columns: [] }
    );
  }

  get getList(): { datas: any[]; columns: any[] } {
    return this.list;
  }

  clearList() {
    this.dispatcher.clear();
  }
}
