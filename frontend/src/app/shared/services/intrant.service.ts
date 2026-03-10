import { Injectable } from '@angular/core';
import { SharedService } from './shared.service';
import { Observable } from 'rxjs';
import { IntrantModel } from '@shared/models/intrant.model';
import { IntrantInterface } from '@shared/models/model.interface';

@Injectable({
  providedIn: 'root'
})
export class IntrantService extends SharedService {

  UPDATE_SUCCESS_MESSAGE = 'Modifications bien enregistrées !';

  updateIntrantFactors(intrantInputList: any[]): Observable<any>{
    return this.query(IntrantModel.updateIntrantFactors, {intrantInputList});
  }


  handleUpdatedValue(equipment_intrants: IntrantInterface[], toast: any, unshow: any){
    if (equipment_intrants) {
      const intrantInputList: any[] = [];
      for(const intrant of equipment_intrants){
        intrantInputList.push({
          id: intrant.id,
          conversionFactor: intrant.convertionFactor,
          roundFactor: intrant.roundFactor,
          otherFactor: intrant.otherFactor,
          sku: intrant.sku,
          primary_sku: intrant.primary_sku
        });
      }
      this.updateIntrantFactors(intrantInputList).subscribe((res: any) =>{
        if(!res.errors){
          toast.success(this.UPDATE_SUCCESS_MESSAGE);
          unshow();
        }
      });
    }
  }
}
