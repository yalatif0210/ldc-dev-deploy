class SynthesisModel {
  static syntheses = `{
      syntheses {
        id
        item
        synthesisType{
          id
          type
        }
        informationUnit{
          id
          name
        }
      }
    }
   `;

  static cmmConfig = `query ($request: IntrantCmmConfigByStructureAndEquipmentInput) {
    intrantCmmConfigByStructureAndEquipment(request: $request) {
      id
      intrant {
        id
        code
        name
        sku
        intrantType{
          id
          name
        }
      }
      equipment {
        id
        name
      }
      structure {
        id
        name
      }
      createdAt
      cmm
    }
  }
`;

  static createCmmConfig = `mutation($inputs: [IntrantCmmConfigInput]){
    createCmmConfigs(inputs: $inputs){
      id
    }
  }`;
}
export default SynthesisModel;
