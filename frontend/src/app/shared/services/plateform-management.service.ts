import { inject, Injectable } from '@angular/core';
import { SharedService } from './shared.service';
import { FormGroup } from '@angular/forms';
import StructureModel from '@shared/models/structure.model';
import { forkJoin, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PlateformManagementService extends SharedService {
  constructor() {
    super();
  }
  submit(form: FormGroup) {
    if (form.valid) {
      this.rest.setRestEndpoint('/api/structure/create-platform');
      this.rest.query({
          structure: Number(form.value.structure) || null,
          equipments: [form.value.equipments],
        }).subscribe({
          next: response => this.onPlateformCreate(),
          error: error => {},
        });
    }
  }

  onPlateformCreate() {
    forkJoin([this.getPlateforms()]).subscribe(([platforms]) => {
      this.setList(this.structureToPlatformList(platforms.data.platforms as any[]));
    });
  }

  getPlateforms(): Observable<any> {
    return this.query(StructureModel.platforms());
  }

  structureToPlatformList(platforms: any[]) {
    const result: any[] = [];
    platforms.map((platform: any, index: number) =>
      result.push({
        id: index + 1,
        region: platform.district?.region?.name || '',
        district: platform.district?.name || '',
        structure: platform.name || '',
        ['nbre équipement']: platform.equipments.length || 0,
        ['équipment(s)']: platform.equipments
          .map((equipment: any) => equipment?.name || '')
          .join(' ; '),
      })
    );
    return result;
  }
}
