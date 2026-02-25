import { KeyValue, KeyValuePipe } from '@angular/common';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule, MatCard, MatCardContent } from '@angular/material/card';
import { DateAdapter, MatOptionModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatStepperModule } from '@angular/material/stepper';
import { AuthService } from '@core';
import { MtxGridModule } from '@ng-matero/extensions/grid';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

import { FormBaseComponent, PageHeader } from '@shared';
import {
  RoleInterface,
  RegionInterface,
  StructureInterface,
  AccountInterface,
} from '@shared/models/model.interface';
import { AccountList, UserManagementService } from '@shared/services/user-management.service';
import { forkJoin, Subscription } from 'rxjs';
import { AppTable } from '@shared/components/table/app-table';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';

@Component({
  selector: 'app-users',
  standalone: true,
  templateUrl: './manage-users.html',
  styleUrl: '../../../public/report/lab-report/lab.scss',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatCardModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatOptionModule,
    MatSelectModule,
    TranslateModule,
    MatStepperModule,
    MtxGridModule,
    AppTable,
  ],
})
export class ManageUsers extends FormBaseComponent implements OnInit, OnDestroy {
  private readonly dateAdapter = inject(DateAdapter);
  private readonly translate = inject(TranslateService);
  protected readonly service = inject(UserManagementService);
  private readonly authService = inject(AuthService);
  roles: RoleInterface[] = [];
  regions: RegionInterface[] = [];
  plateformes: StructureInterface[] = [];
  filteredPlatforms: StructureInterface[] = [];
  form: FormGroup | undefined;

  accountsToList: AccountList[] = [];

  isLinear = false;

  constructor() {
    super();
    this.form = this.buildFormFromArray([
      { key: 'name', defaultValue: '', validators: [Validators.required] },
    ]);
  }

  private translateSubscription = Subscription.EMPTY;

  ngOnInit(): void {
    this.service.clearList();
    this.translateSubscription = this.translate.onLangChange.subscribe((res: { lang: any }) => {
      this.dateAdapter.setLocale(res.lang);
    });
    forkJoin([
      this.service.getUserRolesFromRemote(),
      this.service.getRegion(),
      this.service.getStructure(),
      this.service.getAccount(),
    ]).subscribe(([roles, regions, plateformes, accounts]) => {
      this.roles = roles.data.roles.filter((el: any) => el.id != 1) as RoleInterface[];
      this.regions = regions.data.regions as RegionInterface[];
      this.plateformes = plateformes.data.structures as StructureInterface[];
      this.accountsToList = this.service.accountsToList(
        accounts.data.accounts as AccountInterface[],
        true
      );
      //this.service.setList(
      //  this.service.accountsToList(accounts.data.accounts as AccountInterface[], true)
      //);
      //this.filteredPlateformes = plateformes.data.structures as Structure[]
    });
  }

  submitForm(form: FormGroup): void {
    if (form.valid) {
      const name = form.get('name')?.value;
      const result = this.accountsToList.filter(item =>
        item.name.toLowerCase().includes(name.toLowerCase())
      );
      this.service.setList(result);
    }
  }

  ngOnDestroy() {
    this.translateSubscription.unsubscribe();
  }
}

