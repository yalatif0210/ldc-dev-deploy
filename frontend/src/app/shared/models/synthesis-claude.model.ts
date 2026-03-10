class SynthesisClaudeModel {
  static reportsForMultiSynthesis = `query ($request: SynthesisRequestInput) {
    reportsBySupervisedStructuresAndEquipmentWithinDateRange(request: $request) {
      id
      createdAt
      period {
        id
        periodName
        startDate
        endDate
      }
      equipment { id name }
      status { id status }
      account {
        id
        structures { id name }
      }
      IntrantMvtData {
        id
        intrant {
          id code name sku primary_sku convertionFactor roundFactor
          intrantType { id name }
        }
        entryStock
        distributionStock
        availableStock
      }
      labActivityData {
        id
        value
        information {
          id
          informationUnit { id name }
          informationSubUnit { id name }
          informationSubSubUnit { id name }
        }
      }
    }
  }`;
}
export default SynthesisClaudeModel;
