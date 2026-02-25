import { inject, Injectable } from '@angular/core';
import { SharedService } from './shared.service';
import { Observable } from 'rxjs';
import SynthesisModel from '@shared/models/synthesis.model';
import {
  compareDates,
  englishDate,
  frenchDate,
  frenchDateToEnglishDate,
} from '@shared/utils/french-date';
import { ReportService } from '@shared/services/report.service';
import { id } from 'date-fns/locale';
import { compileTargets } from '@shared/validator/rules';

const USER_ROLE_ID = {
  PHARMACY: 5,
  LABORATORY: 4,
};

const INTRANT_TYPE = {
  SPECIFIC_PRIMARY: '1',
  SPECIFIC_SECONDARY: '2',
};

const LABO_INFORMATIONS = {
  UNIT_VIRAL_LOAD: 'Viral Load',
  SUB_UNIT_VL_NUMBER_SAMPLE_PENDING: 'VL Number Sample Pending',
  SUB_SUB_UNIT_VL_PLASMA: 'Vl Plasma',
};

const COBAS_5800 = 'COBAS 5800';
const OPP_BRUKER = 'OPP (BRUKER)';

const SYNTHESE_HEBDOMMADAIRE = 10;

@Injectable({
  providedIn: 'root',
})
export class SynthesisService extends SharedService {
  constructor() {
    super();
  }

  get synthesis(): Observable<any> {
    return this.query(SynthesisModel.syntheses);
  }

  getCmmConfig(request: any): Observable<any> {
    return this.query(SynthesisModel.cmmConfig, { request });
  }

  isPeriodValid(date1: string, date2: string): boolean {
    return compareDates(frenchDateToEnglishDate(date1), frenchDateToEnglishDate(date2));
  }

  handleCmmInputToDTO(
    data: { structureId: number; equipmentId: number; toast?: any },
    pharmInputs: Record<string, number>
  ) {
    // Implement the logic to convert pharmInputs into a DTO
    const intrantsDTO: any[] = [];
    Object.keys(pharmInputs).forEach(e => {
      intrantsDTO.push({
        structureId: data.structureId,
        equipmentId: data.equipmentId,
        intrantId: Number(e.split('cmm_qty_for_intrant_')[1]),
        cmm: pharmInputs[e] as number,
      });
    });
    console.log('intrantsDTO  synthesis.ts:312 - synthesis.service.ts:70', intrantsDTO);
    return intrantsDTO;
  }

  handleSynthesisInputToDTO(
    form_value: {
      start_period: string;
      end_period: string;
      structure: string;
      synthesis_unit: string;
      equipment: string;
    },
    _this: any
  ) {
    // Implement the logic to convert synthesis inputs into a DTO
    return {
      structure_ids:
        form_value.structure === 'all'
          ? _this.structureList.map((s: any) => Number(s.id))
          : [Number(form_value.structure)],
      equipment: Number(form_value.equipment),
      start_date: _this.start_Date,
      end_date: _this.end_Date,
      synthesis_unit: form_value.synthesis_unit,
    };
  }

  handleCreateCmmConfig(inputs: any[]): Observable<any> {
    return this.query(SynthesisModel.createCmmConfig, { inputs });
  }

  startDate(start_period: string, _this: any) {
    const startDate = _this.periods?.find(
      (period: any) => period.periodName === start_period
    )?.startDate;
    _this.start_Date = startDate ? `${frenchDate(startDate)}` : '';
  }

  endDate(end_period: string, _this: any) {
    const endDate = _this.periods?.find((period: any) => period.periodName === end_period)?.endDate;
    _this.end_Date = endDate ? `${frenchDate(endDate)}` : '';
  }

  handleWeeklySynthesis(report: any, cmmConfigInstance: any[], synthese_id: any = null) {
    //Recupération différenciée des données des entités labo et pharmacy
    //const report_from_lab = report.filter((r: any)=> r.account.role.id === USER_ROLE_ID.LABORATORY);
    //const report_from_pharm = report.filter((r: any)=> r.account.role.id === USER_ROLE_ID.PHARMACY);

    const grouped = this.handleGroupIntrantMvtDatas(report);

    console.log('grouped_data - synthesis.service.ts:120', grouped);

    if (synthese_id === SYNTHESE_HEBDOMMADAIRE) {
      const normalized_data = this.handleDataNormalizer(
        cmmConfigInstance,
        grouped.mvt_grouped,
        grouped.lab_grouped,
        report
      );
      console.log('WX>>² - synthesis.service.ts:129', normalized_data);
      return normalized_data;
    }

    return this.createLabFromReportInformations(grouped.lab_grouped);
    //const lab_data = this.createLabFromReportInformations(grouped.lab_grouped);
    //console.log('WX>>² - synthesis.service.ts:131', normalized_data);
    //console.log('W - synthesis.service.ts:132', lab_data);
    //traitement de la compilation
  }

  handleLabDataSommation(data: any[]) {
    return data.reduce((sum: any, item: any): any => sum + item.value, 0);
  }

  handleAddLabData(
    lab_mvt_grouped: any,
    equipment_name: any,
    compileConfig: any,
    compiled_specific_primary: any
  ) {
    console.log('++++++ - synthesis.service.ts:150', lab_mvt_grouped);
    console.log('++++++ compileConfig - synthesis.service.ts:151', compileConfig);

    compiled_specific_primary?.forEach((e: any) => {
      const sample_tested_target = lab_mvt_grouped.filter((e: any) =>
        compileConfig.tested.includes(Number(e.information.id))
      );
      const sample_pending_target = lab_mvt_grouped.filter((e: any) =>
        compileConfig.pending.includes(Number(e.information.id))
      );
      if (equipment_name !== COBAS_5800 && equipment_name !== OPP_BRUKER) {
        const sample_tested_compiled = this.handleLabDataSommation(sample_tested_target);
        const sample_pending_compiled = this.handleLabDataSommation(sample_pending_target);

        e['sample_tested'] = sample_tested_compiled;
        e['sample_pending'] = sample_pending_compiled;
        e['qac'] = this.handleQac(e);
        e['test_realisable'] = this.handleTestRealisable(e);
      } else {
        compileConfig.tested.forEach((elt: any, index: number) => {
          e[compileConfig.schema[index] + '_tested'] = lab_mvt_grouped.find(
            (e: any) => Number(e.information.id) === elt
          )?.value;
        });
        compileConfig.pending.forEach((elt: any, index: number) => {
          e[compileConfig.schema[index] + '_pending'] = lab_mvt_grouped.find(
            (e: any) => Number(e.information.id) === elt
          )?.value;
        });
        if (equipment_name === COBAS_5800) {
          e['qac'] = this.handleCobas5800Qac(e);
        }
        if (equipment_name === OPP_BRUKER) {
          e['qac'] = this.handleOppBruckerQac(e);
        }
        e['test_realisable'] = this.handleTestRealisable(e);
      }
    });
    return compiled_specific_primary;
  }

  handleQac(e: any) {
    const ratio_sample_pendinf_and_conversion_factor =
      e.sample_pending / e.intrant.convertionFactor;
    if (ratio_sample_pendinf_and_conversion_factor >= 0) {
      const qac = 2 * e.cmm - (e.availableStock + ratio_sample_pendinf_and_conversion_factor);
      return qac > 0 ? qac.toFixed(0) : 0;
    }
    return 0;
  }

  handleCobas5800Qac(e: any) {
    if (e.intrant.code === 4040317) {
      const ratio_sample_pendinf_and_conversion_factor =
        e.vl_plasma_vih1_pending / e.intrant.convertionFactor;
      if (ratio_sample_pendinf_and_conversion_factor >= 0) {
        const qac = 2 * e.cmm - (e.availableStock + ratio_sample_pendinf_and_conversion_factor);
        return qac > 0 ? qac.toFixed(0) : 0;
      }
      return 0;
    }

    if (e.intrant.code === 40403172) {
      const ratio_sample_pendinf_and_conversion_factor = e.eid_pending / e.intrant.convertionFactor;
      if (ratio_sample_pendinf_and_conversion_factor >= 0) {
        const qac = 2 * e.cmm - (e.availableStock + ratio_sample_pendinf_and_conversion_factor);
        return qac > 0 ? qac.toFixed(0) : 0;
      }
      return 0;
    }

    if (e.intrant.code === 4040136) {
      const qac = 2 * e.cmm - e.availableStock;
      return qac > 0 ? qac.toFixed(0) : 0;
    }

    return 0;
  }

  handleOppBruckerQac(e: any) {
    if (e.intrant.code === 4040219) {
      const ratio_sample_pendinf_and_conversion_factor =
        e.vl_plasma_vih1_pending / e.intrant.convertionFactor;
      if (ratio_sample_pendinf_and_conversion_factor) {
        const qac = 2 * e.cmm - (e.availableStock + ratio_sample_pendinf_and_conversion_factor);
        return qac > 0 ? qac.toFixed(0) : 0;
      }
      return 0;
    }

    if (e.intrant.code === 4040438) {
      const ratio_sample_pendinf_and_conversion_factor =
        e.vl_plasma_vih2_pending / e.intrant.convertionFactor;
      if (ratio_sample_pendinf_and_conversion_factor) {
        const qac = 2 * e.cmm - (e.availableStock + ratio_sample_pendinf_and_conversion_factor);
        return qac > 0 ? qac.toFixed(0) : 0;
      }
      return 0;
    }

    return 0;
  }

  handleTestRealisable(e: any) {
    const t_r = e.intrant.convertionFactor * (e.availableStock + Number(e.qac));
    return t_r > 0 ? t_r.toFixed(0) : 0;
  }

  handleDataNormalizer(
    cmmConfigs: any,
    intrant_mvt_grouped: any,
    lab_mvt_grouped: any,
    report: any
  ) {
    //Recupération du nom de l'équipement et la configuration requise pour la synthèse
    const equipment_name = report[0]?.equipment?.name;
    const compileConfig = compileTargets[equipment_name as keyof typeof compileTargets];

    //intrant_mvt_grouped by intrant type
    const specific_primary: any[] = intrant_mvt_grouped.filter(
      (e: any) => e.intrant.intrantType.id === INTRANT_TYPE.SPECIFIC_PRIMARY
    );
    const specific_secondary: any[] = intrant_mvt_grouped.filter(
      (e: any) => e.intrant.intrantType.id === INTRANT_TYPE.SPECIFIC_SECONDARY
    );
    console.log('specific_primary - synthesis.service.ts:275', specific_primary);
    console.log('specific_secondary - synthesis.service.ts:276', specific_secondary);

    //get intrant_mvt_data and cmmConfig unique value
    const uniques_specific_primary: any[] = Array.from(
      new Map(specific_primary.map(item => [item.intrant.id, item])).values()
    );
    const uniques_specific_secondary: any[] = Array.from(
      new Map(specific_secondary.map(item => [item.intrant.id, item])).values()
    );
    const uniques_cmmConfig: any[] = Array.from(
      new Map(cmmConfigs.map((item: any) => [item.intrant.id, item])).values()
    );

    console.log('unique_specific_primary - synthesis.service.ts:289', uniques_specific_primary);
    console.log('unique_cmm_config - synthesis.service.ts:290', uniques_cmmConfig);

    //Compil cmmConfig data
    const compiled_cmm: any[] = [];
    uniques_cmmConfig.forEach(item => {
      const temp: any = cmmConfigs.filter((e: any) => e.intrant.code === item.intrant.code);
      const total_cmm: any = temp.reduce((sum: any, item: any): any => sum + item.cmm, 0);
      compiled_cmm.push({
        cmm: total_cmm,
        equipment: temp[0].equipment,
        id: temp[0].id,
        intrant: temp[0].intrant,
      });
    });

    //Compil specific_primary data
    const compiled_specific_primary: any[] = [];
    uniques_specific_primary.forEach(item => {
      const temp: any = specific_primary.filter((e: any) => e.intrant.code === item.intrant.code);
      const total_available_stock: any = temp.reduce(
        (sum: any, item: any): any => sum + item.availableStock,
        0
      );
      const total_distribution_stock: any = temp.reduce(
        (sum: any, item: any): any => sum + item.distributionStock,
        0
      );
      compiled_specific_primary.push({
        availableStock: total_available_stock,
        distributionStock: total_distribution_stock,
        intrant: temp[0].intrant,
        id: temp[0].id,
        cmm: compiled_cmm.find((e: any) => e.intrant.code === temp[0].intrant.code)?.cmm,
        msd: (
          total_available_stock /
            compiled_cmm.find((e: any) => e.intrant.code === temp[0].intrant.code)?.cmm || 0
        ).toFixed(2),
      });
    });

    console.log('compiled_specific_primary - synthesis.service.ts:330', compiled_specific_primary);

    //Compil specific_secondary data
    const compiled_specific_secondary: any[] = [];
    uniques_specific_secondary.forEach(item => {
      const temp: any = specific_secondary.filter((e: any) => e.intrant.code === item.intrant.code);
      const total_available_stock: any = temp.reduce(
        (sum: any, item: any): any => sum + item.availableStock,
        0
      );
      const total_distribution_stock: any = temp.reduce(
        (sum: any, item: any): any => sum + item.distributionStock,
        0
      );
      compiled_specific_secondary.push({
        availableStock: this.handleAvailableStock(temp[0], total_available_stock),
        distributionStock: total_distribution_stock,
        intrant: temp[0].intrant,
        id: temp[0].id,
      });
    });
    const result = {
      compiled_cmm,
      compiled_specific_primary: this.handleAddLabData(
        lab_mvt_grouped,
        equipment_name,
        compileConfig,
        compiled_specific_primary
      ),
      compiled_specific_secondary,
    };
    return this.handleFinalizeSpecificSecondary(result, equipment_name);
  }

  handleFinalizeSpecificSecondary(e: any, equipment_name: string) {
    e.compiled_specific_secondary.forEach((elt: any) => {
      if (equipment_name === COBAS_5800) {
        switch (elt.intrant.code) {
          case 40403173:
            elt['primary_unit'] = this.handlePrimaryUnit(
              e.compiled_specific_primary,
              [elt.intrant.convertionFactor],
              [40403172]
            );
            break;
          case 4030521:
            elt['primary_unit'] = this.handlePrimaryUnit(
              e.compiled_specific_primary,
              [elt.intrant.convertionFactor],
              [4040136, 40403172]
            );
            break;
          case 4040131:
            elt['primary_unit'] = this.handlePrimaryUnit(
              e.compiled_specific_primary,
              [elt.intrant.convertionFactor],
              [4040317, 4040136]
            );
            break;
          case 4040140:
            elt['primary_unit'] = this.handlePrimaryUnit(
              e.compiled_specific_primary,
              [elt.intrant.convertionFactor, elt.intrant.otherFactor],
              [40403172, 4040136]
            );
            break;
          default:
            elt['primary_unit'] = this.handlePrimaryUnit(
              e.compiled_specific_primary,
              [elt.intrant.convertionFactor],
              [4040317]
            );
            break;
        }
      } else {
        elt['primary_unit'] = this.handlePrimaryUnit(e.compiled_specific_primary, [
          elt.intrant.convertionFactor,
        ]);
      }
      elt['kit'] = this.handleKit(elt);
      elt['qac'] = this.handle_specific_secondary_qac(elt);
      elt['taux'] = this.handle_specific_secondary_taux(elt);
    });
    return e;
  }

 handleAvailableStock(elt: any, total_available_stock: any){
  const factor = elt.intrant.sku === elt.intrant.primary_sku ? 1 : elt.intrant.roundFactor;
  return elt.intrant.code === 4040140
            ? total_available_stock > 2
              ? Math.ceil(total_available_stock / factor || 0)
              : (total_available_stock / factor || 0).toFixed(0)
            : (total_available_stock / factor || 0).toFixed(0);
 }

  handleKit(elt: any) {
    if (elt.intrant.sku === elt.intrant.primary_sku) {
      return Math.ceil(Number(elt.primary_unit));
    }
    return Math.ceil(Number(elt.primary_unit) / elt.intrant.roundFactor || 0);
  }

  handle_specific_secondary_qac(elt: any) {
    const qac = Number(elt.kit) - elt.availableStock;
    return qac > 0 ? qac : 0;
  }

  handle_specific_secondary_taux(elt: any) {
    const taux = Number(elt.kit) ? (elt.availableStock / Number(elt.kit)) * 100 : 0;
    return taux.toFixed(0);
  }

  handlePrimaryUnit(
    e: any,
    conversion_factor: number[],
    targeted_intrant_code: number[] | null = null
  ) {
    let cumul = 0;
    console.log('e++++ - synthesis.service.ts:448', e);
    if (targeted_intrant_code && targeted_intrant_code.length !== 0) {
      const filter_result = e.filter((i: any) => targeted_intrant_code.includes(i.intrant.code));
      console.log('filter_result - synthesis.service.ts:451', filter_result);
      if (
        targeted_intrant_code.length === 1 ||
        (targeted_intrant_code.includes(4040136) && targeted_intrant_code.includes(40403172))
      ) {
        filter_result.forEach((element: any) => {
          cumul += Number(element.test_realisable) * conversion_factor[0];
        });
      }

      if (targeted_intrant_code.includes(4040136) && targeted_intrant_code.includes(4040317)) {
        filter_result.forEach((element: any) => {
          if (element.intrant.code === 4040136) {
            cumul -= Number(element.test_realisable) * conversion_factor[0];
          } else {
            cumul += Number(element.test_realisable) * conversion_factor[0];
          }
        });
      }

      if (targeted_intrant_code.includes(4040136) && targeted_intrant_code.includes(40403172)) {
        filter_result.forEach((element: any) => {
          if (element.intrant.code === 4040136) {
            cumul -= Number(element.test_realisable) * conversion_factor[1];
          } else {
            cumul += Number(element.test_realisable) * conversion_factor[0];
          }
        });
      }
    } else {
      e.forEach((element: any) => {
        cumul += Number(element.test_realisable) * conversion_factor[0];
      });
    }
    console.log('factor - synthesis.service.ts:485', conversion_factor, cumul);
    return Math.ceil(cumul);
  }

  handleGroupIntrantMvtDatas(report: any[]) {
    const mvt_grouped: any[] = [];
    const lab_grouped: any[] = [];
    report.forEach(r => {
      mvt_grouped.push(...r.IntrantMvtData);
      lab_grouped.push(...r.labActivityData);
    });
    return {
      mvt_grouped,
      lab_grouped,
    };
  }

  createLabFromReportInformations(lab_grouped: any[]) {
    const labformControls: any[] = [];
    lab_grouped!.forEach((data: any, i: number) => {
      labformControls.push({
        key: `unit_${data.information.id}`,
        value: data.value,
      });
    });
    return this.setLabInput(labformControls);
  }

  setLabInput(items: any) {
    const labInputs: Record<string, any> = {};
    for (const obj of items) {
      labInputs[obj.key] = obj.value;
    }
    return labInputs;
  }
}
