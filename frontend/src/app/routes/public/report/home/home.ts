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
import { PublicHomeService } from '@shared/services/public-home.service';
import { forkJoin } from 'rxjs';
import { MtxAlert } from '@ng-matero/extensions/alert';
import { MatListItem } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';

@Component({
  selector: '[app-public-home]',
  templateUrl: './home.html',
  styleUrl: './home.scss',
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
    MatDividerModule
],
})
export class PublicHome extends FormBaseComponent implements OnInit, OnDestroy {
  service = inject(PublicHomeService);
  home_form: FormGroup | undefined;
  equipments: any[] = [];
  constructor() {
    super();
    this.home_form = this.buildFormFromArray([
      { key: 'equipment', defaultValue: '', validators: [Validators.required] },
    ]);
  }

  ngOnInit(): void {
    forkJoin([this.service.getEquipments()]).subscribe(([response]) => {
      this.equipments = response.data.account.structures[0].equipments;
      //this.service.setList(this.service.periodToList(response.data.periods as any[]));
    });
    this.home_form!.get('equipment')?.valueChanges.subscribe(selectedEquipment => {
      this.onEquipmentChange(this.service.accountId, selectedEquipment);
    });
  }

  onEquipmentChange(accountId: any, equipmentId: any) {
    this.service.getLastReportPeriod(equipmentId, accountId).subscribe(response => {
      console.log('last report period', response);
      this.service.attachReportToPeriod(response, this.equipments.find(e => e.id === equipmentId));
    });
  }

  ngOnDestroy(): void {
    this.service.clearList();
  }
}
