import ModelBase from './model.base';
import { RegionInterface } from './model.interface';


 class RegionModel extends ModelBase {
  id?: string;
  name?: string;
  constructor(region: RegionInterface) {
    super(region);
  }

  static regions() {
    return `
      {
        regions {
          id
          name
        }
      }
      `;
  }
}

export default RegionModel;
