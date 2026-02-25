import { OnInit, OnDestroy, Component, inject } from '@angular/core';
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
import {
  EquipmentInterface,
  IntrantInterface,
  RegionInterface,
  StructureInterface,
} from '@shared/models/model.interface';
import { IntrantService } from '@shared/services/intrant.service';
import { PlateformManagementService } from '@shared/services/plateform-management.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-factor',
  standalone: true,
  templateUrl: './factor.html',
  styleUrls: ['../../../public/report/lab-report/lab.scss', './factor.scss'],
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
  ],
})
export class Factor extends FormBaseComponent implements OnInit, OnDestroy {
  service = inject(PlateformManagementService);
  intrant_service = inject(IntrantService);
  regions: RegionInterface[] = [];
  equipments: EquipmentInterface[] = [];
  equipments_intrants?: IntrantInterface[] = [];

  form: FormGroup | undefined;
  page = 1;
  pageSize = 5;
  totalPages = 1;

  show_intrant = false;
  updated = false;

  constructor() {
    super();
    this.form = this.buildFormFromArray([
      { key: 'equipments', defaultValue: '', validators: [Validators.required] },
    ]);
  }

  ngOnInit(): void {
    this.form!.get('equipments')?.valueChanges.subscribe(equipments => {
      this.equipments_intrants = this.sortByIntrantType(
        this.equipments?.find(e => e.id === equipments)?.intrants
      );
    });
    forkJoin([this.service.getEquipments()]).subscribe(([equipments]) => {
      this.equipments = equipments.data.equipments as EquipmentInterface[];
    });
  }

  sortByIntrantType(data: any[] | undefined) {
    return data?.sort((a, b) => {
      const nameA = a.intrantType?.name?.toLowerCase() || '';
      const nameB = b.intrantType?.name?.toLowerCase() || '';
      return nameA.localeCompare(nameB);
    });
  }

  updateValue(index?: string, field?: string, event?: Event) {
    const target = event?.target as HTMLElement;

    const rawValue = target.innerText.trim();
    const numericValue = Number(rawValue);
    const updatedValue = isNaN(numericValue) ? rawValue : numericValue;

    const item = this.equipments_intrants?.find(e => e.id === index);

    if (item) {
      (item as any)[field!] = updatedValue;
    }
    console.log('updated_value++++ - factor.ts:102', this.equipments_intrants);
  }

  /******* test paste ************************************************************/
  selectedRow = 0;
  selectedCol = 0;

  pastedCells = new Set<string>();

  selectCell(row: number, col: number) {
    this.selectedRow = row;
    this.selectedCol = col;
  }


  onPaste(event: ClipboardEvent) {
    event.preventDefault();

    const clipboard = event.clipboardData?.getData('text');
    if (!clipboard) return;

    const rows = clipboard.split(/\r?\n/);

    rows.forEach((rowData, r) => {
      if (!rowData.trim()) return;

      const cols = rowData.split('\t');

      const targetRowIndex = this.page * this.pageSize + (this.selectedRow + r) - this.pageSize;
      const targetRow = this.equipments_intrants![targetRowIndex];

      if (!targetRow) return;

      cols.forEach((value, c) => {
        const targetColIndex = this.selectedCol + c;

        this.setValue(targetRow, targetColIndex, value);

        // coloration temporaire
        const key = `${targetRowIndex}-${targetColIndex}`;
        this.pastedCells.add(key);

        setTimeout(() => {
          this.pastedCells.delete(key);
        }, 1500);
      });
    });
    console.log('paste+++ - factor.ts:149', this.equipments_intrants);
  }

  setValue(row: any, col: number, value: string) {
    const num = Number(value);
    switch (col) {
      case 0:
        row.sku = num || value;
        break;
      case 1:
        row.primary_sku = num || value;
        break;
      case 2:
        row.convertionFactor = num || value;
        break;
      case 3:
        row.roundFactor = num || value;
        break;
      case 4:
        row.otherFactor = num || value;
        break;
    }
  }

  isPasted(row: number, col: number) {
    return this.pastedCells.has(`${row}-${col}`);
  }

  /******* end test *************************************************************/

  onFocus(event: any) {
    // Empêche Angular de réécrire pendant édition
    const el = event.target;
    // eslint-disable-next-line no-self-assign
    el.innerText = el.innerText;
    if (!this.updated) {
      this.updated = true;
    }
  }

  handleUpdatedValue() {
    this.intrant_service.handleUpdatedValue(
      this.equipments_intrants!,
      this.toast,
      this.setShowIntrantFalse.bind(this)
    );
  }

  setShowIntrantFalse() {
    this.show_intrant = false;
    this.updated = false;
  }

  handleSubmit() {
    this.calculateTotalPages();
    this.show_intrant = true;
    console.log('intrants ++++ - factor.ts:205', this.equipments_intrants);
  }

  ngOnDestroy() {}

  changePage(direction: number) {
    this.page += direction;
    if (this.page < 1) this.page = 1;
    if (this.page > this.totalPages) this.page = this.totalPages;
  }

  paginate<T>(pageNumber: number): IntrantInterface[] {
    const array = this.equipments_intrants!.slice();
    const start = (pageNumber - 1) * this.pageSize;
    const end = start + this.pageSize;
    return array.slice(start, end);
  }

  setCurrentPage(page: number) {
    this.page = page;
  }

  calculateTotalPages() {
    this.totalPages = Math.ceil(this.equipments_intrants!.length / this.pageSize);
    console.log('total_pages - factor.ts:229', this.totalPages);
  }

  get arrayFromTotalPages() {
    return Array.from({ length: this.totalPages }, (_, i) => i);
  }
}
