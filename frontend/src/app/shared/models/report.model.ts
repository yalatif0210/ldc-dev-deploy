class ReportModel {
  static reportByAccountAndEquipment = `query($request: ReportByAccountAndEquipmentInput) {
    reportByAccountAndEquipment(request: $request) {
      id
      period {
        id
        periodName
      }
      status {
        id
        status
      }
    }
  }`;

  static createReport = `mutation ($input: ReportInput) {
    createReport(input: $input) {
      id
    }
  }`;

  static reportByAccountAndEquipmentAndPeriodAlso = `query ($request: ReportByEquipmentAccountPeriodInput) {
    reportByAccountAndEquipmentAndPeriodAlso(request: $request) {
      id
      createdAt
      period {
        id
        month {
          month
        }
        periodName
        startDate
        endDate
      }
      equipment {
        id
        name
      }
      account {
        id
      }
      status {
        id
        status
      }
      labActivityData {
        id
        information {
          id
        }
        value
      }
      IntrantMvtData {
        id
        intrant {
          id
          sku
          primary_sku
          code
          convertionFactor
          roundFactor
          otherFactor
          name
        }
        entryStock
        availableStock
        distributionStock
        adjustments{
          id
          adjustmentType{
            id
            type
            name
          }
          quantity
          comment
        }
      }
    }
  }`;

  static lastFinalizedReportByEquipmentAndAccount = `query ($request: LastFinalizedReportByEquipmentAndAccountInput) {
  lastFinalizedReportByEquipmentAndAccount(request: $request) {
    id
    createdAt
    period {
      id
      month {
        month
      }
      periodName
      startDate
      endDate
    }
    equipment {
      id
      name
    }
    account {
      id
    }
    status {
      id
      status
    }
    labActivityData {
      id
      information {
        id
        informationUnit {
          id
          name
        }
        informationSubUnit {
          id
          name
        }
        informationSubSubUnit {
          id
          name
        }
      }
      value
    }
    IntrantMvtData {
      id
      intrant {
        id
        sku
        primary_sku
        code
        convertionFactor
        roundFactor
        otherFactor
        intrantType {
          name
        }
        name
      }
      availableStock
      distributionStock
    }
  }
} `;

  static lastsFinalizedReportByEquipmentAndAccount = `query ($request: LastFinalizedReportByEquipmentAndAccountInput) {
  lastsFinalizedReportByEquipmentAndAccount(request: $request) {
    id
    createdAt
    period {
      id
      month {
        month
      }
      periodName
      startDate
      endDate
    }
    equipment {
      id
      name
    }
    account {
      id
    }
    status {
      id
      status
    }
    labActivityData {
      id
      information {
        id
        informationUnit {
          id
          name
        }
        informationSubUnit {
          id
          name
        }
        informationSubSubUnit {
          id
          name
        }
      }
      value
    }
    IntrantMvtData {
      id
      intrant {
        id
        sku
        primary_sku
        code
        convertionFactor
        roundFactor
        otherFactor
        intrantType {
          name
        }
        name
      }
      availableStock
      distributionStock
    }
  }
} `;

  static reportsByAccountAndEquipmentWithinDateRangeAndReportId = `query ($request: ReportHistoryInput) {
    reportsByAccountAndEquipmentWithinDateRang(request: $request) {
      id
      createdAt
      period {
        id
        month {
          month
        }
        periodName
        startDate
        endDate
      }
      equipment {
        id
        name
      }
      account {
        id
      }
      status {
        id
        status
      }
      labActivityData {
        id
        information {
          id
        }
        value
      }
      IntrantMvtData {
        id
        intrant {
          id
          sku
          primary_sku
          code
          convertionFactor
          roundFactor
          otherFactor
        }
        availableStock
        distributionStock
      }
    }
  }`;

  static reportsByAccountAndEquipmentWithinDateRange = `query ($request: ReportHistoryInput) {
  reportsByAccountAndEquipmentWithinDateRange(request: $request) {
    id
    createdAt
    period {
      id
      month {
        month
      }
      periodName
      startDate
      endDate
    }
    equipment {
      id
      name
    }
    account {
      id
      role{
        role
      }
    }
    status {
      id
      status
    }
  }
}`;

  static reportsBySupervisedStructureAndEquipmentWithinDateRange = `query ($request: AdminReportHistoryInput) {
  reportsBySupervisedStructureAndEquipmentWithinDateRange(request: $request) {
    id
    createdAt
    period {
      id
      month {
        month
      }
      periodName
      startDate
      endDate
    }
    equipment {
      id
      name
    }
    account {
      id
      role{role}
    }
    status {
      id
      status
    }
  }
}`;

  static reportsBySupervisedStructuresAndEquipmentWithinDateRange = `query ($request: SynthesisRequestInput) {
    reportsBySupervisedStructuresAndEquipmentWithinDateRange(request: $request) {
      id
      createdAt
      period {
        id
        month {
          month
        }
        periodName
        startDate
        endDate
      }
      equipment {
        id
        name
      }
      account {
        id
        role{
          id
          role
        }
      }
      status {
        id
        status
      }
      IntrantMvtData{
        id
        intrant{
          id
          code
          convertionFactor
          roundFactor
          otherFactor
          name
          sku
          primary_sku
          intrantType{
            id
            name
          }
        }
        distributionStock
        availableStock
      }
          labActivityData{
      information{
        id
        informationUnit{
          name
        }
        informationSubUnit{
          name
        }
        informationSubSubUnit{
          name
        }
      }
      value
    }
    }
  }`;

  static structureByReportId = `query($id: ID){
    report(id: $id) {
      account {
        role {
          role
        }
        user {
          name
          username
          phone
        }
        structures {
          id
          name
          code
          district {
            name
            region {
              name
            }
          }
        }
        isActive
        id
      }
    }
  } `;

  static reportById = `query($id: ID){
  report(id: $id) {
    id
    createdAt
    period {
      id
      month {
        month
      }
      periodName
      startDate
      endDate
    }
    equipment {
      id
      name
    }
    account {
      id
    }
    status {
      id
      status
    }
    labActivityData {
      id
      information {
        id
        informationUnit {
          id
          name
        }
        informationSubUnit {
          id
          name
        }
        informationSubSubUnit {
          id
          name
        }
      }
      value
    }
    IntrantMvtData {
      id
      intrant {
        id
        sku
        primary_sku
        code
        convertionFactor
        roundFactor
        otherFactor
        intrantType {
          name
        }
        name
      }
              adjustments{
          id
          adjustmentType{
            id
            type
            name
          }
          quantity
          comment
        }
      entryStock
      availableStock
      distributionStock
    }
  }
}
`;

  static adjustment_type = `{
    adjustmentTypes{
      id
      name
      type
    }
  } `;
}

export default ReportModel;
