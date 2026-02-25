/* eslint-disable @typescript-eslint/prefer-for-of */
import { CommonModule } from '@angular/common';
import {
  OnInit,
  OnDestroy,
  Component,
  inject,
  ViewChild,
  ElementRef,
  AfterViewInit,
} from '@angular/core';
import * as XLSX from 'xlsx';
import { Workbook } from 'exceljs';
import { saveAs } from 'file-saver';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
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
import { MatTabsModule } from '@angular/material/tabs';
import { MtxGridModule } from '@ng-matero/extensions/grid';
import { TranslateModule } from '@ngx-translate/core';
import { FormBaseComponent } from '@shared';
import { SynthesisService } from '@shared/services/synthesis.service';
import { forkJoin, takeUntil } from 'rxjs';
import { AppTable } from '@shared/components/table/app-table';
import { ReportHistoryService } from '@shared/services/report-history.service';
import flatpickr from 'flatpickr';
import { frenchDate, frenchDateToEnglishDate } from '@shared/utils/french-date';
import { th } from 'date-fns/locale';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ReportService } from '@shared/services/report.service';
import { Router } from '@angular/router';

const SYNTHESIS_UNIT_ID = '10';
const REDIRECTION = 'zver/public/settings';

@Component({
  selector: '[app-synthesis]',
  templateUrl: './synthesis.html',
  styleUrls: ['../report/lab-report/lab.scss', './synthesis.scss'],
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
    MatTabsModule,
  ],
})
export class Synthesis extends FormBaseComponent implements OnInit, OnDestroy {
  form: FormGroup | undefined;
  private readonly service = inject(SynthesisService);
  private readonly reportHistoryService = inject(ReportHistoryService);
  private readonly reportService = inject(ReportService);
  private readonly router = inject(Router);
  cmmConfigInstance: any;
  syntheses?: any[];
  account?: any;
  periods?: any[];
  start_Date = '';
  end_Date = '';
  enabledSubmit = true;
  lockedButton = false;
  synthesis_data: any;
  synthesis_unit: any;
  equipment_info: any;
  information_unit: any;
  SYNTHESE_HBDOMMADAIRE = '10';
  SHEET_TITLE = 'FEUILLE DE CALCUL DES QUANTITES DE CONSOMMABLES DE CHARGE VIRALE';

  @ViewChild('tableExport', { static: false })
  table!: ElementRef;

  @ViewChild('tableContainer') tableContainer!: ElementRef;

  constructor() {
    super();
    this.form = this.buildFormFromArray([
      { key: 'synthesis_unit', defaultValue: '', validators: [Validators.required] },
      { key: 'equipment', defaultValue: '', validators: [Validators.required] },
      { key: 'structure', defaultValue: '', validators: [Validators.required] },
      { key: 'start_period', defaultValue: '', validators: [Validators.required] },
      { key: 'end_period', defaultValue: '', validators: [Validators.required] },
    ]);
  }

  ngOnInit(): void {
    this.form!.get('start_period')
      ?.valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe(start_period => {
        this.service.startDate(start_period, this);
        this.periodChecker();
      });
    this.form!.get('end_period')
      ?.valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe(end_period => {
        this.service.endDate(end_period, this);
        this.periodChecker();
      });
    this.form!.get('structure')
      ?.valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe(structure => {
        this.handleStructureChange(this.handleStructureId(structure));
      });
    forkJoin([
      this.service.synthesis,
      this.reportHistoryService.getEquipments(),
      this.service.getPeriods(),
    ]).subscribe(([synthesis, account, periods]) => {
      if (synthesis && synthesis.data) {
        this.syntheses = synthesis.data.syntheses;
        console.log('synthesis - synthesis.ts:131', this.syntheses);
      }
      if (account && account.data) {
        this.account = account.data.account;
        console.log('account - synthesis.ts:135', this.account);
      }
      if (periods && periods.data) {
        this.periods = periods.data.periods;
        console.log('periods - synthesis.ts:139', this.periods);
      }
    });
  }

  periodChecker() {
    if (this.start_Date !== '' && this.end_Date != '') {
      if (!this.service.isPeriodValid(this.end_Date, this.start_Date)) {
        this.toast.error(
          'Ereur sur la période : La date de fin doit être supérieure à la date de début.'
        );
        this.enabledSubmit = false;
      } else {
        this.enabledSubmit = true;
      }
    }
  }

  handleEquipmentChange(equipment_id: any) {
    const equimpent_name = this.equipmentList.find(e => e.id === equipment_id)?.name;
    const synthesis_unit = this.form!.get('synthesis_unit')?.value;
    const information_unit_label = this.syntheses?.find(e => e.id === synthesis_unit)
      ?.informationUnit?.name;
    this.reportService.getEquipmentInfo(equimpent_name).subscribe(res => {
      this.equipment_info = res.data.equipmentInformationByName;
      this.information_unit = this.equipment_info?.information?.find(
        (i: any) => i.name === information_unit_label
      );
    });
  }

  handleStructureChange(structure_Id: any) {
    const equipment = this.form!.get('equipment')?.value;
    this.handleCmmInstance(structure_Id, equipment);
  }

  handleCmmInstance(structure_Id: any, equipment: any) {
    this.service
      .getCmmConfig({ structureId: structure_Id, equipmentId: Number(equipment) })
      .subscribe((config: any) => {
        console.log('cmmConfig - synthesis.ts:179', config);
        if (
          config &&
          config.data &&
          config?.data?.intrantCmmConfigByStructureAndEquipment?.length === 0
        ) {
          const confirm = window.confirm(
            `Aucune CMM n'est configuré pour
               cet équipement. Voulez-vous continuer ?`
          );
          this.lockedButton = !confirm;
          if (confirm) {
            this.router.navigateByUrl(REDIRECTION);
          } else {
            this.lockedButton = true;
            return;
          }
        } else if (
          config &&
          config.data &&
          config.data.intrantCmmConfigByStructureAndEquipment.length !== 0
        ) {
          this.cmmConfigInstance = config.data.intrantCmmConfigByStructureAndEquipment;
        }
      });
  }

  get equipmentList() {
    return this.reportHistoryService.getEquipmentList(this.account);
  }

  get structureList() {
    return (
      this.account &&
      this.account!.structures!.filter((structure: any) => {
        return structure.equipments!.some(
          (eq: any) => eq.id === this.form!.get('equipment')!.value
        );
      })
    );
  }

  get syntheseOptionsList() {
    const title: any[] = [];
    this.syntheses &&
      this.syntheses!.map((e: any) => {
        if (!title.includes(e.synthesisType)) {
          title.push(e.synthesisType);
        }
      });
    return title;
  }

  handleStructureId(structure: any) {
    return structure === 'all'
      ? this.structureList.map((s: any) => Number(s.id))
      : [Number(structure)];
  }

  onSubmit() {
    if (this.form?.valid) {
      this.synthesis_data = null;
      const equipment = this.form!.value!.equipment;
      const structure = this.form!.value!.structure;
      const queryInput = this.service.handleSynthesisInputToDTO(this.form!.value, this);
      this.handleEquipmentChange(equipment);
      this.handleCmmInstance(this.handleStructureId(structure), equipment);
      if (this.cmmConfigInstance) {
        this.reportHistoryService
          .getReportsBySupervisedStructuresAndEquipmentWithinDateRange(queryInput)
          .subscribe(res => {
            console.log('synthesis reports - synthesis.ts:250', res);
            console.log('cmmConfigInstance - synthesis.ts:251', this.cmmConfigInstance);
            this.synthesis_unit = this.form?.value.synthesis_unit;
            this.synthesis_data = this.service.handleWeeklySynthesis(
              res.data.reportsBySupervisedStructuresAndEquipmentWithinDateRange,
              this.cmmConfigInstance,
              Number(this.form?.value.synthesis_unit)
            );
            console.log('++++ - synthesis.ts:258', this.synthesis_data);
          });
      }
    }
  }

  ngOnDestroy(): void {}
  // Add methods and properties as required
  exportExcel() {
    const element = this.table.nativeElement;

    const worksheet: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);

    const workbook: XLSX.WorkBook = {
      Sheets: { data: worksheet },
      SheetNames: ['Feuille1'],
    };

    const excelBuffer: any = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array',
    });

    const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });

    saveAs(blob, 'tableau.xlsx');
  }

  exportPDF() {
    const data = this.table.nativeElement;

    html2canvas(data, { scale: 2 }).then(canvas => {
      const imgWidth = 295; // A4 paysage
      const pageHeight = 210;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      const contentDataURL = canvas.toDataURL('image/png');

      const pdf = new jsPDF('landscape', 'mm', 'a4');

      pdf.addImage(contentDataURL, 'PNG', 0, 0, imgWidth, imgHeight);

      pdf.save('tableau.pdf');
    });
  }

  /******************** other version export to excel */
  async exportExcelPro() {
    const workbook = new Workbook();
    const worksheet = workbook.addWorksheet('Feuille');

    const table: HTMLTableElement = this.tableContainer.nativeElement.querySelector('table');

    const rows = table.rows;

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      const excelRow = worksheet.addRow([]);

      let colIndex = 1; // position réelle dans Excel

      for (let j = 0; j < row.cells.length; j++) {
        const cell = row.cells[j];

        const excelCell = excelRow.getCell(colIndex);
        excelCell.value = cell.innerText;

        // ===== STYLE =====

        const style = window.getComputedStyle(cell);

        // background color
        const bg = style.backgroundColor;
        if (bg && bg !== 'rgba(0, 0, 0, 0)') {
          const rgb = this.rgbToHex(bg);
          excelCell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FF' + rgb },
          };
        }

        // border
        excelCell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' },
        };

        // align
        excelCell.alignment = {
          vertical: 'middle',
          horizontal: 'center',
          wrapText: true,
        };

        // font bold
        if (style.fontWeight === '700') {
          excelCell.font = { bold: true };
        }

        // ===== COLSPAN / MERGE =====

        const colspan = cell.colSpan || 1;

        if (colspan > 1) {
          const startCol = colIndex;
          const endCol = colIndex + colspan - 1;

          try {
            worksheet.mergeCells(i + 1, startCol, i + 1, endCol);
          } catch (e) {
            console.warn('Fusion ignorée: - synthesis.ts:371', e);
          }
        }

        // avancer index réel
        colIndex += colspan;
      }
    }

    const buffer = await workbook.xlsx.writeBuffer();

    saveAs(new Blob([buffer]), 'tableau.xlsx');
  }

  // ===== convert RGB → HEX =====
  rgbToHex(rgb: string) {
    const result = rgb.match(/\d+/g);
    if (!result) return 'FFFFFF';

    return result.map(x => ('0' + parseInt(x).toString(16)).slice(-2)).join('');
  }

  /************ okther version export to pdf */

  async exportPDFMulti() {
    const element = this.tableContainer.nativeElement;

    const canvas = await html2canvas(element, {
      scale: 2,
    });

    const imgData = canvas.toDataURL('image/png');

    const pdf = new jsPDF('landscape', 'mm', 'a4');

    const imgWidth = 297;
    const pageHeight = 210;

    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    let heightLeft = imgHeight;
    let position = 0;

    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);

    heightLeft -= pageHeight;

    while (heightLeft > 0) {
      position = heightLeft - imgHeight;

      pdf.addPage();

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);

      heightLeft -= pageHeight;
    }

    pdf.save('tableau.pdf');
  }
}

