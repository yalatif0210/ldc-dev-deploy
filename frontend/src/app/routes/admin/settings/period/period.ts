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
import { MtxGridModule } from '@ng-matero/extensions/grid';
import { TranslateModule } from '@ngx-translate/core';
import { FormBaseComponent, PageHeader } from '@shared';
import { AppTable } from '@shared/components/table/app-table';
import { PeriodManagementService } from '@shared/services/period-management.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: '[app-period]',
  templateUrl: './period.html',
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
    AppTable,
  ],
})
export class Period extends FormBaseComponent implements OnInit, OnDestroy {
  service = inject(PeriodManagementService);
  periodform: FormGroup | undefined;
  minBirthday = new Date('2026-01-01');
  constructor() {
    super();
    this.periodform = this.buildFormFromArray([
      { key: 'start_date', defaultValue: '', validators: [Validators.required] },
      { key: 'end_date', defaultValue: '', validators: [Validators.required] },
    ]);
  }

  ngOnInit(): void {
    forkJoin([this.service.getPeriods()]).subscribe(([response]) => {
      this.service.setList(this.service.periodToList(response.data.periods as any[]));
    });
  }

  ngOnDestroy(): void {
     this.service.clearList();
  }
}
