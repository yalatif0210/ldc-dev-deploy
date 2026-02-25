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
  RegionInterface,
  StructureInterface,
} from '@shared/models/model.interface';
import { PlateformManagementService } from '@shared/services/plateform-management.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-platform',
  standalone: true,
  templateUrl: './platform.html',
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
    MatRadioModule,
    AppTable
],
})
export class Platform extends FormBaseComponent implements OnInit, OnDestroy {
  service = inject(PlateformManagementService);
  regions: RegionInterface[] = [];
  equipments: EquipmentInterface[] = [];
  plateformes: StructureInterface[] = [];
  filteredPlatforms: StructureInterface[] = [];

  reactiveform: FormGroup | undefined;

  constructor() {
    super();
    this.reactiveform = this.buildFormFromArray([
      { key: 'structure', defaultValue: '', validators: [Validators.required] },
      { key: 'equipments', defaultValue: '', validators: [Validators.required] },
      { key: 'region', defaultValue: '', validators: [Validators.required] },
    ]);
  }

  ngOnInit(): void {
    this.service.clearList();
    this.reactiveform!.get('region')?.valueChanges.subscribe(selectedRegion => {
      this.onRegionChange(selectedRegion);
    });
    forkJoin([
      this.service.getRegion(),
      this.service.getStructure(),
      this.service.getEquipments(),
      this.service.getPlateforms()
    ]).subscribe(([regions, plateformes, equipments, platforms]) => {
      this.regions = regions.data.regions as RegionInterface[];
      this.plateformes = plateformes.data.structures as StructureInterface[];
      this.equipments = equipments.data.equipments as EquipmentInterface[];
      this.service.setList(
        this.service.structureToPlatformList(platforms.data.platforms as any[])
      );
    });
  }

  onRegionChange(region: any) {
    this.filteredPlatforms = this.plateformes.filter(element =>
      Number(element.district?.region?.id) === Number(region)
    );
  }
  ngOnDestroy() {
    this.service.clearList();
  }
}
