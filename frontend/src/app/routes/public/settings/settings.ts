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
import { SynthesisService } from '@shared/services/synthesis.service';
import { ReportHistoryService } from '@shared/services/report-history.service';

const SPECIFIC_PRIMARY_INTRANT = 1;
const CONSOMMABLES_GENERAUX = 8;

@Component({
  selector: '[app-public-settings]',
  templateUrl: './settings.html',
  styleUrls: ['./settings.scss', '../report/lab-report/lab.scss'],
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
  ],
})
export class PublicSettings extends FormBaseComponent implements OnInit, OnDestroy {
  private readonly service = inject(SynthesisService);
  private readonly reportHistoryService = inject(ReportHistoryService);
  equipmentInfo: { id: string; name: string; intrants: [] } = { id: '', name: '', intrants: [] };
  equipmentIntrants: any;
  pharmInputs: Record<string, number> = {};
  disabledConfirm = false;
  home_form: FormGroup | undefined;
  equipments: any[] = [];
  structure: any;
  cmmConfigInstance: any;

  constructor() {
    super();
    this.home_form = this.buildFormFromArray([
      { key: 'equipment', defaultValue: '', validators: [Validators.required] },
    ]);
  }

  ngOnInit(): void {
    forkJoin([this.reportHistoryService.getEquipments()]).subscribe(([response]) => {
      this.equipments = response.data.account.structures[0].equipments.filter((e: any) =>
        Number(e.id) !== CONSOMMABLES_GENERAUX
      );
      this.structure = response.data.account.structures[0];
      //this.service.setList(this.service.periodToList(response.data.periods as any[]));
    });
    this.home_form!.get('equipment')?.valueChanges.subscribe((selectedEquipmentId: any) => {
      this.onEquipmentChange(this.structure.id, selectedEquipmentId);
    });
  }

  handleCmmInstance(structure_Id: any, equipmentId: any) {
    this.service
      .getCmmConfig({ structureId: structure_Id, equipmentId: Number(equipmentId) })
      .subscribe((config: any) => {
        console.log('cmmConfig  synthesis.ts:177 - settings.ts:87', config);
        if (
          config &&
          config.data &&
          config?.data?.intrantCmmConfigByStructureAndEquipment?.length === 0
        ) {
          const confirm = window.confirm(
            `Aucune CMM n'est configuré pour
                 cet équipement. Voulez-vous continuer ?`
          );
          //this.lockedButton = !confirm;
          if (confirm) {
            this.cmmConfigInstance = null;
            this.service.getEquipmentById(equipmentId).subscribe((equipment: any) => {
              if (equipment && equipment.data) {
                this.equipmentInfo = equipment.data.equipment;
                this.equipmentIntrants = this.equipmentInfo.intrants.filter(
                  (e: any) => Number(e.intrantType.id) === SPECIFIC_PRIMARY_INTRANT
                ) as any[];
              }
              console.log('equipment  synthesis.ts:528 - settings.ts:107', equipment);
            });
          } else {
            return;
          }
        } else {
          this.equipmentIntrants = null;
          this.cmmConfigInstance = config?.data?.intrantCmmConfigByStructureAndEquipment;
        }
      });
  }

  onEquipmentChange(structureId: any, equipmentId: any) {
    this.disabledConfirm = false;
    this.equipmentIntrants = null;
    this.cmmConfigInstance = null;
    this.handleCmmInstance(structureId, equipmentId);
  }

  ngOnDestroy(): void {
    this.service.clearList();
  }

  onConfirm() {
    this.disabledConfirm = true;
    this.service
      .handleCreateCmmConfig(
        this.service.handleCmmInputToDTO(
          { structureId: this.structure.id, equipmentId: this.home_form?.value.equipment },
          this.pharmInputs
        )
      )
      .subscribe((r: any) => {
        console.log('CMM config created  synthesis.ts:542 - settings.ts:140', r);
        this.toast.success('CMM configurées avec succès.');
      });
  }
}
