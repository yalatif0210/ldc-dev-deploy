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
import { ActivatedRoute, Router } from '@angular/router';
import { MtxGridModule } from '@ng-matero/extensions/grid';
import { TranslateModule } from '@ngx-translate/core';
import { FormBaseComponent, PageHeader } from '@shared';
import { AppTable } from '@shared/components/table/app-table';
import { forkJoin } from 'rxjs';

@Component({
  selector: '[app-public-home]',
  templateUrl: './pharm-report.html',
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
    PageHeader,
    MatRadioModule,
    AppTable,
  ],
})
export class PharmReport extends FormBaseComponent implements OnInit, OnDestroy {
  private readonly router = inject(ActivatedRoute);
  home_form: FormGroup | undefined;
  equipments: any[] = [];
  constructor() {
    super();
    this.home_form = this.buildFormFromArray([
      { key: 'equipment', defaultValue: '', validators: [Validators.required] },
    ]);
  }

  ngOnInit(): void {
     // Récupération de l'état
    this.router.queryParamMap.subscribe(params => {
      console.log('Params:', params);
      const data = JSON.parse(params.get('data')!);
      console.log('Période:', data);
    });
  }

  ngOnDestroy(): void {}
}
