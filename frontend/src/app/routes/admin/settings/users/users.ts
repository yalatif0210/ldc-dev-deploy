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
import { MatCardModule } from '@angular/material/card';
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

import {  FormBaseComponent, PageHeader } from '@shared';
import {
  RoleInterface,
  RegionInterface,
  StructureInterface,
  AccountInterface,
} from '@shared/models/model.interface';
import { UserManagementService } from '@shared/services/user-management.service';
import { forkJoin, Subscription } from 'rxjs';
import { AppTable } from '@shared/components/table/app-table';

@Component({
  selector: 'app-users',
  standalone: true,
  templateUrl: './users.html',
  styleUrl: './users.scss',
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
    AppTable
],
})
export class Users extends FormBaseComponent implements OnInit, OnDestroy {
  private readonly dateAdapter = inject(DateAdapter);
  private readonly translate = inject(TranslateService);
  protected readonly service = inject(UserManagementService);
  private readonly authService = inject(AuthService);
  roles: RoleInterface[] = [];
  regions: RegionInterface[] = [];
  plateformes: StructureInterface[] = [];
  filteredPlatforms: StructureInterface[] = [];
  reactiveStep1: FormGroup | undefined;
  reactiveStep2: FormGroup | undefined;

  isLinear = false;

  constructor() {
    super();
    this.reactiveStep1 = this.buildFormFromArray([
      { key: 'role', defaultValue: '', validators: [Validators.required] },
      { key: 'region', defaultValue: '', validators: [Validators.required] },
      { key: 'platform', defaultValue: '', validators: [Validators.required] },
    ]);

    this.reactiveStep2 = this.buildFormFromArray([
      { key: 'name', defaultValue: '', validators: [Validators.required] },
      { key: 'phone', defaultValue: '', validators: [Validators.required] },
    ]);
  }

  private translateSubscription = Subscription.EMPTY;

  ngOnInit(): void {
    this.service.clearList();
    this.reactiveStep1!.get('region')?.valueChanges.subscribe(selectedRegion => {
      this.onRegionChange(selectedRegion);
    });
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
      this.service.setList(
        this.service.accountsToList(accounts.data.accounts as AccountInterface[])
      );
      //this.filteredPlateformes = plateformes.data.structures as Structure[]
    });
  }

  submitForm(form: FormGroup): void {
    this.authService
      .register(this.authService.getNewUser(this.reactiveStep1?.value, form.value))
      .subscribe((value: any) => {
        this._dialog_props = {
          title: 'IDENTIFIANTS :',
          content: `Username : ${value.username}     ||     Mote de passe : ${value.phone}`,
        };
        this.openDialog();
        this.service.onCreate();
      });
  }

  ngOnDestroy() {
    this.translateSubscription.unsubscribe();
  }

  onRegionChange(region: any[]) {
    this.filteredPlatforms = this.plateformes.filter(element =>
      region.includes(element!.district!.region!.id) && element.active
    );
    console.log('+++> - users.ts:131', region);
    console.log('+++>> - users.ts:132', this.plateformes);
    console.log('+++ - users.ts:133', this.filteredPlatforms);
  }
}
