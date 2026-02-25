import { Injectable } from '@angular/core';
import { SharedService } from './shared.service';
import { FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class EquipementServiceService extends SharedService {

  private equipment: any;

  submit(form: FormGroup) {
    console.log('kut', form.value)
    if (form.valid) {
      console.log(form.value)
      this.equipment = form.value
    }
  }
}
