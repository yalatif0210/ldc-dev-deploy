import { Component, OnInit, OnDestroy, inject } from '@angular/core';
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
import { ActivatedRoute } from '@angular/router';
import { MtxGridModule } from '@ng-matero/extensions/grid';
import { TranslateModule } from '@ngx-translate/core';
import { FormBaseComponent, PageHeader } from '@shared';
import { ReportService } from '@shared/services/report.service';
import { InfoBox } from '@shared/components/info-box/user-info-box';
import { MatTabsModule } from '@angular/material/tabs';
import { CommonModule } from '@angular/common';
import { AuthService, UserRole } from '@core';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { ValidationService } from '@shared/validator/validation.service';

interface EquipmentInfo {
  information: {
    id: string;
    name: string;
    subUnit: {
      id: string;
      name: string;
      subSubUnit: {
        id: string;
        name: string;
      }[];
    };
  }[];
  intrants: {
    id: string;
    code: string;
    sku: string;
    name: string;
  }[];
}

interface Tab {
  label: string;
  content: string;
}

interface Intrant {
  id: string;
  code: string;
  sku: string;
  primary_sku: string;
  name: string;
  initial?: number;
  entry?: number;
  used?: number;
  adjustment?: number;
  instock?: number;
}

type IntrantsKeys = keyof Intrant;

@Component({
  selector: '[app-public-home]',
  templateUrl: './report-history.html',
  styleUrl: '../../report/lab-report/lab.scss',
  imports: [
    CommonModule,
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
    InfoBox,
    MatTabsModule,
  ],
})
export class ReportHistory extends FormBaseComponent implements OnInit, OnDestroy {
  private readonly router = inject(ActivatedRoute);
  private readonly service = inject(ReportService);
  private readonly auth = inject(AuthService);
  validationDialog = inject(MatDialog);
  form: FormGroup | undefined;
  lab_form: FormGroup | undefined;
  pharm_form: FormGroup | undefined;
  pharmInputs: Record<string, number> = {};
  equipments: any[] = [];
  information_unit?: any;
  information_units?: any;
  information_unit_label?: string;
  lastFinalizedReport?: any;
  report?: any;
  SPECIFIC_INFORMATION_LABEL = `Suivi Des Interventions de Maintenance (en cas de panne d'équipement)`;
  adjustments: Record<string, Record<string, any>[] | any> = {};
  adjustment_types: any;

  Tabs: Tab[] = [
    { label: 'Données de laboratoire', content: 'lab' },
    { label: 'Données logistiques', content: 'pharm' },
  ];

  selectedThreeD = 0;

  isLinear = false;
  firstFormGroup!: FormGroup;
  secondFormGroup!: FormGroup;

  equipmentInfo: EquipmentInfo = { information: [], intrants: [] };
  stock_table_header = [
    'Id',
    'Code',
    'Désignation',
    'Unité',
    'Quantité utilisée',
    'Stock disponible',
  ];
  intrant_datas_keys: IntrantsKeys[] = [
    'code',
    'name',
    'primary_sku',
    'initial',
    'entry',
    'used',
    'adjustment',
    'instock',
  ];
  page = 1;
  pageSize = 5;
  totalPages = 1;

  constructor() {
    super();
    this.form = this.buildFormFromArray([
      { key: 'information_unit', defaultValue: '', validators: [] },
    ]);
  }

  get threeDTabs() {
    return this.auth.userRoleByToken == UserRole.LAB_USER ||
      (this.auth.isUserAdminOrSupervisor(this.auth.userRoleByToken) &&
        this.report.labActivityData.length)
      ? this.Tabs
      : [this.Tabs[1]];
  }

  get isUserPharmUser() {
    return this.auth.userRoleByToken === UserRole.PHARM_USER;
  }

  changePage(direction: number) {
    this.page += direction;
    if (this.page < 1) this.page = 1;
    if (this.page > this.totalPages) this.page = this.totalPages;
  }

  paginate<T>(pageNumber: number): Intrant[] {
    const array = this.equipmentIntrants.slice();
    const start = (pageNumber - 1) * this.pageSize;
    const end = start + this.pageSize;
    return array.slice(start, end);
  }

  setCurrentPage(page: number) {
    this.page = page;
  }

  calculateTotalPages() {
    this.totalPages = Math.ceil(this.equipmentIntrants.length / this.pageSize);
  }

  get arrayFromTotalPages() {
    return Array.from({ length: this.totalPages }, (_, i) => i);
  }

  selectThreeD(index: number): void {
    this.selectedThreeD = index;
  }

  resloveDate(date: any) {
    const _date = new Date(date * 1000); // convertir en ms

    // transformer en YYYY-MM-DD
    const isoDate = _date.toISOString().split('T')[0];

    // injecter dans l'input
    return date ? isoDate : '';
  }

  setPharmInput(items: any) {
    for (const obj of items) {
      this.pharmInputs[obj.key] = obj.value;
    }
    console.log('pharmInputs - report-history.ts:210', this.pharmInputs);
  }

  get equipmentIntrants() {
    return this.equipmentInfo.intrants as Intrant[];
  }

  onInformationUnitChange(information_unit_label: string) {
    this.information_unit_label = information_unit_label;
    this.information_unit = this.equipmentInfo.information.find(
      i => i.name === information_unit_label
    );
  }

  createLabFromReportInformations() {
    const labformControls: any[] = [];
    this.report!.labActivityData.forEach((data: any, i: number) => {
      labformControls.push({
        key: `unit_${data.information.id}`,
        defaultValue: data.value,
        validators: [Validators.required],
      });
    });
    this.lab_form = this.buildFormFromArray(labformControls);
  }

  createPharmFromReportInformations() {
    const pharmFormControls: any[] = [];
    const lastFinalizedReport = this.lastFinalizedReport.find(
      (report: any) => report.id != this.report.id
    );
    this.report!.IntrantMvtData.forEach((data: any, i: number) => {
      pharmFormControls.push({
        key: `initial_qty_for_intrant_${data.intrant.id}`,
        value: lastFinalizedReport
          ? this.service.get_last_report_pharm_data(
              lastFinalizedReport?.IntrantMvtData,
              data.intrant.id
            )
          : 0,
      });
      pharmFormControls.push({
        key: `entry_qty_for_intrant_${data.intrant.id}`,
        value: data.entryStock || 0,
      });
      pharmFormControls.push({
        key: `used_qty_for_intrant_${data.intrant.id}`,
        value: data.distributionStock || 0,
      });
      pharmFormControls.push({
        key: `instock_qty_for_intrant_${data.intrant.id}`,
        value: data.availableStock || 0,
      });
    });
    this.setPharmInput(pharmFormControls);
    this.calculateTotalPages();
  }

  getSpecificFormValue(form: FormGroup, key: any) {
    return form.get(key)?.value;
  }

  ngOnInit(): void {
    this.form!.get('information_unit')?.valueChanges.subscribe(information_unit_label => {
      this.onInformationUnitChange(information_unit_label);
    });
    // Récupération du type d'ajustement
    this.service.get_adjustment_type().subscribe(res => {
      this.adjustment_types = res.data?.adjustmentTypes;
    });
    // Récupération de l'état
    this.router.queryParamMap.subscribe(params => {
      const data = JSON.parse(params.get('data')!);
      if (data) {
        this.service
          .findLastsFinalizedReportByEquipmentAndAccount(data.equipment)
          .subscribe(res => {
            console.log('lastsFinalizedReport - report-history.ts:287', res);
            this.lastFinalizedReport = res;
          });
        this.service.findReportById(data.id).subscribe(response => {
          const report = response.data.report;
          if (report) {
            console.log('report - report-history.ts:293', report);
            this.adjustments = this.service.compileAdjustments(
              this.service.getAdjustmentsFromExistingReport(report.IntrantMvtData),
              this.adjustment_types
            );
            this.report = report;
            this.service.getEquipmentInfo(report.equipment.name).subscribe(equipRes => {
              const equipmentInfo = equipRes.data.equipmentInformationByName;
              this.equipmentInfo = equipmentInfo;
              console.log('equipementInfo - report-history.ts:302', this.equipmentInfo);
              this.createLabFromReportInformations();
              this.createPharmFromReportInformations();
            });
          }
        });
      }
    });
  }

  openAdjustmentDialog(data: any) {
    const dialogRef = this.validationDialog.open(AdjustmentDialog, { data });
    dialogRef.afterClosed().subscribe(result => {
      console.log('Retour du dialog : - report-history.ts:315', result);
      if (result) {
        this.adjustments = this.service.compileAdjustments(result, this.adjustment_types);
      }
    });
  }

  ngOnDestroy(): void {}
}

@Component({
  selector: 'adjustment-dialog',
  templateUrl: 'adjustment-dialog.html',
  imports: [
    MatDialogModule,
    MatButtonModule,
    ReactiveFormsModule,
    FormsModule,
    MatInputModule,
    MatOptionModule,
    MatSelectModule,
  ],
})
export class AdjustmentDialog implements OnInit {
  public data: any = inject(MAT_DIALOG_DATA);
  public dialogRef = inject(MatDialogRef<AdjustmentDialog>);
  public readonly validationService = inject(ValidationService);
  public readonly reportService = inject(ReportService);

  index: any;
  adjustments: any;
  target: any;

  adjustment_type: any;
  disable = false;

  ngOnInit(): void {
    this.reportService.get_adjustment_type().subscribe(res => {
      this.adjustment_type = res.data?.adjustmentTypes;
    });
    this.index = this.data.index;
    this.adjustments = this.data.adjustments![this.data.index];
    this.target = this.data.target;
  }

  getAdjustmentName(index: any): string {
    return this.adjustment_type?.find((item: any) => item.id === index).name;
  }
}
