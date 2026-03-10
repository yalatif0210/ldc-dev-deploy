import { Injectable } from '@angular/core';
import { SharedService } from './shared.service';
import { FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class EquipementServiceService extends SharedService {

  private equipment: any;

  submit(form: FormGroup) {
    if (form.valid) {
      this.equipment = form.value
    }
  }
}
