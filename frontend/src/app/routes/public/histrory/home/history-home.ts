import {
  Component,
  OnInit,
  OnDestroy,
  inject,
  AfterViewInit,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatOptionModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatStepperModule } from '@angular/material/stepper';
import { MtxGridModule } from '@ng-matero/extensions/grid';
import { TranslateModule } from '@ngx-translate/core';
import { FormBaseComponent, PageHeader } from '@shared';
import { AppTable } from '@shared/components/table/app-table';
import { PeriodManagementService } from '@shared/services/period-management.service';
import { PublicHomeService } from '@shared/services/public-home.service';
import { forkJoin } from 'rxjs';
import flatpickr from 'flatpickr';
import { MatDividerModule } from '@angular/material/divider';
import { ReportHistoryService } from '@shared/services/report-history.service';
import { AuthService } from '@core';
import { SharedService } from '@shared/services/shared.service';

@Component({
  selector: '[app-history-home]',
  templateUrl: './history-home.html',
  styleUrl: './history-home.scss',
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
    MatRadioModule,
    MatDividerModule,
    AppTable,
  ],
})
export class HistoryHome extends FormBaseComponent implements OnInit, OnDestroy, AfterViewInit {
  service = inject(ReportHistoryService);
  private readonly shared_service = inject(SharedService);
  private readonly authService = inject(AuthService);
  home_form: FormGroup | undefined;
  account: any;
  structure_list: any;
  structure_by_equipment: any;

  @ViewChild('datepicker_start') datepicker_start!: ElementRef;
  @ViewChild('datepicker_end') datepicker_end!: ElementRef;

  constructor() {
    super();
    this.home_form = this.buildFormFromArray([
      { key: 'equipment', defaultValue: '', validators: [Validators.required] },
      { key: 'structure', defaultValue: '', validators: [] },
      { key: 'start_date', defaultValue: '', validators: [Validators.required] },
      { key: 'end_date', defaultValue: '', validators: [Validators.required] },
    ]);
  }

  ngOnInit(): void {
    this.home_form?.get('equipment')?.valueChanges.subscribe(value => {
      console.log('ert', value);
      this.structure_by_equipment = this.structure_list.filter((s: any) =>
        s.equipments.some((e: any) => e.id === value)
      );
      console.log('coi', this.structure_by_equipment);
    });
    forkJoin([this.service.getEquipments()]).subscribe(([response]) => {
      console.log('user', response);
      this.account = response.data.account;
      this.structure_list = response.data.account.structures;
    });
  }

  get equipmentList() {
    return this.service.getEquipmentList(this.account);
  }

  get isUserAdminOrSupervisor() {
    return this.authService.isUserAdminOrSupervisor(this.authService.userRoleByToken);
  }

  onSubmit() {
    this.service.onSubmit(this.home_form?.value, this.isUserAdminOrSupervisor);
  }

  ngAfterViewInit(): void {
    flatpickr(this.datepicker_start.nativeElement, {
      dateFormat: 'd/m/Y', // Format dd/mm/yyyy
      allowInput: true,
    });
    flatpickr(this.datepicker_end.nativeElement, {
      dateFormat: 'd/m/Y', // Format dd/mm/yyyy
      allowInput: true,
    });
  }

  ngOnDestroy(): void {
    this.service.clearList();
  }
}
