class TransactionModel {
  static TRANSACTION_BY_DESTINATION = `query ($id: ID) {
  transactionsByDestinationId(id: $id) {
    id
    createdAt
    origin {
      id
      name
    }
    destination {
      id
      name
    }
    sanguineProductTransactions {
      id
      sanguineProduct {
        id
        name
      }
      quantity
    }
    medicinesTransaction {
      id
      intrant {
        id
        name
      }
      quantity
    }
    approved
    isRejected
  }
}`;

static TRANSACTION_BY_ORIGIN_OR_DESTINATION = `query ($originId: ID, $destinationId: ID) {
  transactionsByOriginOrDestinationId(originId: $originId, destinationId: $destinationId) {
    id
    createdAt
    origin {
      id
      name
    }
    destination {
      id
      name
    }
    sanguineProductTransactions {
      id
      sanguineProduct {
        id
        name
      }
      quantity
    }
    medicinesTransaction {
      id
      intrant {
        id
        name
      }
      quantity
    }
    isRejected
    approved
  }
}`;

static TRANSACTION_BY_ID = `query ($id: ID) {
  transaction(id: $id) {
    id
    createdAt
    origin {
      id
      name
    }
    destination {
      id
      name
    }
    sanguineProductTransactions {
      id
      sanguineProduct {
        id
        name
      }
      quantity
    }
    medicinesTransaction {
      id
      intrant {
        id
        name
      }
      quantity
    }
    isRejected
    approved
  }
}
  `;

static TRANSACTION_BY_DATE_RANGE = `query($request: TransactionByPeriodInput){
  transactionByDateRange(request: $request){
    id
    createdAt
    feedbackAt
    approved
    isRejected
    origin{
      id
      name
    }
    destination{
      id
      name
    }
    equipment{
      id
      name
    }
    sanguineProductTransactions{
      id
      sanguineProduct{
        id
        name
      }
      quantity
    }
    medicinesTransaction{
      id
      intrant{
        id
        code
        name
        sku
        convertionFactor
        roundFactor
        otherFactor
      }
      quantity
    }
  }
}`;
}

export default TransactionModel;
