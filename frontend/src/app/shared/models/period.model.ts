export class PeriodModel {
  id?: string;
  start_date?: string;
  end_date?: string;
  month_name?: string;

  constructor(period: Partial<PeriodModel>) {
    Object.assign(this, period);
  }

  static periods() {
    return `{
      periods{
        id
        month{
          month
        }
        startDate
        endDate
        periodName
      }
    }`;
  }

  static periodById = `query($id: ID!) {
      periodsById(id: $id) {
        id
        month{
          month
        }
        startDate
        endDate
        periodName
      }
    }`;

  static periodByName = `query($name: String){
  periodByName(name: $name){
    periodName
    startDate
    endDate
  }
}`;
}
