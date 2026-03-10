export class IntrantModel {
  static updateIntrantFactors = `mutation($intrantInputList: [UpdateIntrantInput]){
    updateIntrantFactors(intrantInputList: $intrantInputList){
      id
    }
  }`;
}
