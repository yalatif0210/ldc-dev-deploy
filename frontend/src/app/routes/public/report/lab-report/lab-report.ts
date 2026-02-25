import { Component, OnInit, OnDestroy, inject, signal, Output, EventEmitter } from '@angular/core';
import { Form, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
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
import { MatTabGroup, MatTabsModule } from '@angular/material/tabs';
import { CommonModule } from '@angular/common';
import { MtxAlert } from '@ng-matero/extensions/alert';
import { AuthService, UserRole } from '@core';
import { MatDivider } from '@angular/material/divider';
import { takeUntil } from 'rxjs';
import { ValidationService } from '@shared/validator/validation.service';
import { validatorRules } from '@shared/validator/rules';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { isIterable } from 'rxjs/internal/util/isIterable';

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
  templateUrl: './lab-report.html',
  styleUrls: ['./lab.scss', '../../synthesis/synthesis.scss'],
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
    MtxAlert,
    MatRadioModule,
    InfoBox,
    MatTabsModule,
  ],
})
export class LabReport extends FormBaseComponent implements OnInit, OnDestroy {
  private readonly router = inject(ActivatedRoute);
  private readonly service = inject(ReportService);
  private readonly auth = inject(AuthService);
  private readonly validationService = inject(ValidationService);
  validationDialog = inject(MatDialog);
  form: FormGroup | undefined;
  lab_form: FormGroup | undefined;
  pharm_form!: FormGroup;
  equipmentId!: any;
  equipmentName!: string;
  information_unit?: any;
  information_units?: any;
  information_unit_label?: string;
  report?: any;
  lastFinalizedReport?: any;
  _pharmFormControls = signal<Record<string, any>[]>([]);
  SPECIFIC_INFORMATION_LABEL = `Suivi Des Interventions de Maintenance (en cas de panne d'équipement)`;

  disable = false;
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
    'Stock initial',
    'Quantité reçue',
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
  pharmInputs: Record<string, number> = {};
  labInputs: Record<string, number> = {};
  adjustments: Record<string, Record<string, any>[] | any> = {};
  transactionByDateRange: any;

  constructor() {
    super();
    this.form = this.buildFormFromArray([
      { key: 'information_unit', defaultValue: '', validators: [] },
    ]);
  }

  getMaintenanceDate(tagret: any, event: any) {
    const timestampSeconds = Math.floor(new Date(event.target.value).getTime() / 1000);
    this.labInputs['unit_' + tagret] = timestampSeconds;
    console.log(this.labInputs);
  }

  resloveDate(date: any) {
    const _date = new Date(date * 1000); // convertir en ms

    // transformer en YYYY-MM-DD
    const isoDate = _date.toISOString().split('T')[0];

    // injecter dans l'input
    return date ? isoDate : '';
  }

  get threeDTabs() {
    return this.auth.userRoleByToken == UserRole.LAB_USER ? this.Tabs : [this.Tabs[1]];
  }

  get isUserPharmUser() {
    return this.auth.userRoleByToken === UserRole.PHARM_USER;
  }

  onPharmitemChange(key: string, value: any) {
    console.log('£££££ - lab-report.ts:195', this.pharmInputs);
  }

  isPharmDataValid(intrant_id: any): boolean {
    return this.validationService.pharm_value_validation(
      Number(this.pharmInputs[`initial_qty_for_intrant_${intrant_id}`]),
      Number(this.pharmInputs[`entry_qty_for_intrant_${intrant_id}`]),
      Number(this.pharmInputs[`used_qty_for_intrant_${intrant_id}`]),
      (this.adjustments['somme_' + intrant_id] &&
        Number(this.adjustments['somme_' + intrant_id])) ||
        0,
      Number(this.pharmInputs[`instock_qty_for_intrant_${intrant_id}`])
    );
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

  get equipmentIntrants() {
    return this.equipmentInfo.intrants as Intrant[];
  }

  get_item_value(key: string, form: FormGroup) {
    return form?.get(key)?.value;
  }

  pharm_form_value(key: string) {
    return this.pharm_form?.get(key)?.value;
  }

  onInformationUnitChange(information_unit_label: string) {
    this.information_unit_label = information_unit_label;
    this.information_unit = this.equipmentInfo.information.find(
      i => i.name === information_unit_label
    );
  }

  createLabFormFromEquipmentInformations() {
    //create lab form
    const labformControls: any[] = [];
    this.equipmentInfo.information.forEach((unit: any, index: number) => {
      unit.subUnits.forEach((subUnits: any, i: number) => {
        if (subUnits.subSubUnits.length) {
          subUnits.subSubUnits.forEach((subSubUnits: any, i: number) => {
            labformControls.push({
              key: `unit_${subSubUnits.id}`,
              value: 0,
            });
          });
        } else {
          labformControls.push({
            key: `unit_${subUnits.id}`,
            value: 0,
          });
        }
      });
    });
    console.log('labformControls - lab-report.ts:278', labformControls);
    this.setLabInput(labformControls);
  }

  createLabFromReportInformations() {
    const labformControls: any[] = [];
    this.report!.labActivityData.forEach((data: any, i: number) => {
      labformControls.push({
        key: `unit_${data.information.id}`,
        value: data.value,
      });
    });
    this.setLabInput(labformControls);
  }

  createPharmFormEquipmentIntrants() {
    //create pharm form
    const pharmFormControls: any[] = [];
    this.equipmentInfo.intrants.forEach((intrant: any, i: number) => {
      pharmFormControls.push({
        key: `initial_qty_for_intrant_${intrant.id}`,
        value: this.lastFinalizedReport
          ? this.service.get_last_report_pharm_data(
              this.lastFinalizedReport?.IntrantMvtData,
              intrant.id
            )
          : 0,
      });
      pharmFormControls.push({
        key: `entry_qty_for_intrant_${intrant.id}`,
        value: 0,
      });
      pharmFormControls.push({
        key: `used_qty_for_intrant_${intrant.id}`,
        value: 0,
      });
      pharmFormControls.push({
        key: `instock_qty_for_intrant_${intrant.id}`,
        value: 0,
      });
    });
    console.log('pharmFormControls - lab-report.ts:319', pharmFormControls);
    this.setPharmInput(pharmFormControls);
    this.calculateTotalPages();
  }

  setPharmInput(items: any) {
    for (const obj of items) {
      this.pharmInputs[obj.key] = obj.value;
    }
    console.log('pharmInputs - lab-report.ts:328', this.pharmInputs);
  }

  setLabInput(items: any) {
    for (const obj of items) {
      this.labInputs[obj.key] = obj.value;
    }
    console.log('labInputs - lab-report.ts:335', this.labInputs);
  }

  createPharmFromReportInformations() {
    const pharmFormControls: any[] = [];
    this.report!.IntrantMvtData.forEach((data: any, i: number) => {
      pharmFormControls.push({
        key: `initial_qty_for_intrant_${data.intrant.id}`,
        value: this.lastFinalizedReport
          ? this.service.get_last_report_pharm_data(
              this.lastFinalizedReport?.IntrantMvtData,
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

  disableRegisterButton() {
    this.disable = true;
  }

  onRegister(status_id: any) {
    const intrantsDTO = this.service.createIntrantDTO(
      this.pharmInputs,
      this.adjustments,
      this.report?.IntrantMvtData?.length || this.report?.labActivityData?.length
        ? this.report
        : false
    );
    if (!this.isUserPharmUser && this.equipmentId !== 8) {
      const informationDTO = this.service.createInformationsDTO(
        this.labInputs,
        this.report?.IntrantMvtData?.length || this.report?.labActivityData?.length
          ? this.report
          : false
      );
      this.validationService
        .procedToValidation(
          this.report?.IntrantMvtData?.length || this.report?.labActivityData?.length
            ? this.service.getInformationDTOForValidation(this.labInputs)
            : informationDTO,
          validatorRules[this.equipmentName as keyof typeof validatorRules],
          this.auth.userAccountId!,
          Number(this.equipmentId)
        )
        .subscribe(response => {
          console.log('Validation réussie - lab-report.ts:396', response);
          this.openValidationDialog({
            validation_result: response,
            report: this.report,
            status_id,
            informationDTO,
            intrantsDTO,
            disableAction: this.disableRegisterButton.bind(this),
            adjustment_type: this.adjustment_types,
          });
          /*this.service.createReportDetails(
            this.report.id,
            status_id,
            informationDTO,
            intrantsDTO,
            this.report?.IntrantMvtData.length || this.report?.labActivityData.length ? true : false
          );*/
        });
    } else {
      this.service.createReportDetails(
        this.report.id,
        status_id,
        [],
        intrantsDTO,
        this.report?.IntrantMvtData?.length ? true : false
      );
      this.disableRegisterButton();
    }
  }

  transfer_mvt_out: any[] = [];
  transfer_mvt_in: any[] = [];

  handleTransactions(equipment_name: string) {
    this.service.getUserInfo().subscribe(res => {
      const transfer_mvt_out = this.transactionByDateRange.filter(
        (e: any) => e.origin.id === res.structures[0].id && e.equipment.name === equipment_name
      );
      const transfer_mvt_in = this.transactionByDateRange.filter(
        (e: any) => e.destination.id === res.structures[0].id && e.equipment.name === equipment_name
      );
      const transfer_mvt_out_result: any[] = [];
      const transfer_mvt_in_result: any[] = [];

      transfer_mvt_in.forEach((e: any) =>
        transfer_mvt_in_result.push(...e.sanguineProductTransactions)
      );

      transfer_mvt_out.forEach((e: any) =>
        transfer_mvt_out_result.push(...e.sanguineProductTransactions)
      );

      this.transfer_mvt_in = this.handleCompileTransaction(transfer_mvt_in_result);
      this.transfer_mvt_out = this.handleCompileTransaction(transfer_mvt_out_result);
      console.log('mvt_info - lab-report.ts:450', this.transfer_mvt_out);
    });
  }

  handleCompileTransaction(data: any) {
    if (!data.length) {
      return [];
    }
    return Object.values(
      data.reduce((acc: any, item: any) => {
        const key = item.sanguineProduct.id;

        if (!acc[key]) {
          acc[key] = {
            ...item,
            quantity: 0,
          };
        }

        acc[key].quantity += item.quantity;

        return acc;
      }, {})
    );
  }

  ngOnInit(): void {
    this.form!.get('information_unit')
      ?.valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe(information_unit_label => {
        this.onInformationUnitChange(information_unit_label);
      });
    //Recuperation des types d'ajustement
    this.service.get_adjustment_type().subscribe(res => {
      this.adjustment_types = res.data?.adjustmentTypes;
    });
    // Récupération de l'état
    this.router.queryParamMap.subscribe(params => {
      const data = JSON.parse(params.get('data')!);
      if (data) {
        this.service.getEquipmentId(data.equipment).subscribe(equipRes => {
          const equipmentId = equipRes.data.equipmentByNameOther.id;
          this.equipmentId = Number(equipmentId);
          this.equipmentName = data.equipment;
        });
        this.service.findPeriodByName(data.period).subscribe(res => {
          if (res) {
            console.log(res);
            this.service
              .findTransactionByDateRange({
                start_date: res.startDate,
                end_date: res.endDate,
              })
              .subscribe(response => {
                this.transactionByDateRange = response;
                this.handleTransactions(data.equipment);
              });
          }
        });
        this.service.findLastFinalizedReportByEquipmentAndAccount(data.equipment).subscribe(res => {
          console.log('lastFinalizedReport - lab-report.ts:510', res);
          this.lastFinalizedReport = res;
        });
        this.service
          .findReportByAccountAndEquipmentAndPeriodAlso(data.equipment, data.period)
          .subscribe(response => {
            const report = response.data.reportByAccountAndEquipmentAndPeriodAlso;
            if (report) {
              this.report = report;
              console.log('report>>> - lab-report.ts:519', report);
              this.adjustments = this.service.compileAdjustments(
                this.service.getAdjustmentsFromExistingReport(report.IntrantMvtData),
                this.adjustment_types
              );
              this.service.getEquipmentInfo(data.equipment).subscribe(equipRes => {
                const equipmentInfo = equipRes.data.equipmentInformationByName;
                console.log('equipmentInfo - lab-report.ts:526', equipmentInfo);
                this.equipmentInfo = equipmentInfo;
                if (!report?.IntrantMvtData.length || !report?.labActivityData.length) {
                  if (!this.isUserPharmUser) {
                    this.createLabFormFromEquipmentInformations();
                  }
                  if (this.isUserPharmUser || this.equipmentId === 5) {
                    if (report?.IntrantMvtData.length) {
                      this.createPharmFromReportInformations();
                    } else {
                      this.createPharmFormEquipmentIntrants();
                    }
                  } else {
                    this.createPharmFormEquipmentIntrants();
                  }
                } else {
                  if (!this.isUserPharmUser) {
                    this.createLabFromReportInformations();
                  }
                  this.createPharmFromReportInformations();
                }
              });
            } else {
              this.service.createReport(data.equipment, data.period).subscribe(res => {
                if (res.data.createReport) {
                  this.report = res.data.createReport;
                  this.service.getEquipmentInfo(data.equipment).subscribe(equipRes => {
                    const equipmentInfo = equipRes.data.equipmentInformationByName;
                    this.equipmentInfo = equipmentInfo;
                    console.log(
                      'equipeinfo',
                      data.equipment,
                      equipRes.data.equipmentInformationByName
                    );
                    if (!this.isUserPharmUser) {
                      this.createLabFormFromEquipmentInformations();
                    }
                    this.createPharmFormEquipmentIntrants();
                  });
                }
              });
            }
          });
      }
    });
  }

  openValidationDialog(data: any) {
    this.validationDialog.open(ValidationDialog, { data });
  }

  openAdjustmentDialog(data: any) {
    const dialogRef = this.validationDialog.open(AdjustmentDialog, { data });
    dialogRef.afterClosed().subscribe(result => {
      console.log('Retour du dialog : - lab-report.ts:580', result);
      if (result) {
        this.adjustments = this.service.compileAdjustments(result, this.adjustment_types);
      }
    });
  }
  ngOnDestroy(): void {}
}

@Component({
  selector: 'validation-dialog',
  templateUrl: 'validation-dialog.html',
  imports: [MatDialogModule, MatButtonModule, ReactiveFormsModule],
})
export class ValidationDialog implements OnInit {
  public data: any = inject(MAT_DIALOG_DATA);
  public readonly validationService = inject(ValidationService);
  public readonly reportService = inject(ReportService);
  disable = false;

  ngOnInit(): void {
    console.log('data - lab-report.ts:601', this.data);
  }

  get allValid(): boolean {
    return this.validationService.areAllValid(
      this.data.validation_result.results,
      this.data.intrantsDTO,
      this.data.adjustment_type
    );
  }

  get buttonLabel(): string {
    return this.allValid ? 'Confirmer et transmettre' : 'Transmettre malgré les erreurs';
  }

  get actionStatus(): number {
    if (this.data.status_id === 2) {
      return this.data.status_id;
    }

    return this.allValid ? this.data.status_id : 3;
  }

  onConfirm() {
    this.disable = true;
    this.data.disableAction();
    this.reportService.createReportDetails(
      this.data.report.id,
      this.actionStatus,
      this.data.informationDTO,
      this.data.intrantsDTO,
      this.data.report?.IntrantMvtData?.length || this.data.report?.labActivityData?.length
        ? true
        : false
    );
  }
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

  selected_adjustment_type: any;
  adjustment_quantity: any;
  comment: any = '';

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

  onConfirm() {
    const datas = this.data.adjustments;
    if (datas[this.data.index]) {
      datas[this.data.index].push({
        id: 0,
        type: this.selected_adjustment_type,
        quantity: this.adjustment_quantity,
        comment: this.comment,
      });
    } else {
      datas[this.data.index] = [
        {
          id: 0,
          type: this.selected_adjustment_type,
          quantity: this.adjustment_quantity,
          comment: this.comment,
        },
      ];
    }
    this.dialogRef.close(datas);
  }
}
