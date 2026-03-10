import ModelBase from './model.base';
import { DistrictInterface, StructureInterface } from './model.interface';

class StructureModel extends ModelBase {
  id?: string;
  name?: string;
  district?: DistrictInterface;

  constructor(structure: StructureInterface) {
    super(structure);
  }

  static structures() {
    return `{
      structures {
        id
        name
        active
        district {
          id
          name
          region {
            id
            name
          }
        }
        equipments{
          id
          name
        }
      }
    }`;
  }

  static platforms() {
    return `{
  platforms{
    name
    active
    district{
      name
      region{
        name
      }
    }
    equipments{
      name
    }
  }
}`;
  }

  static structureByRegion() {
    return `
      query($id: ID!){
        structuresByRegion(id: $id){
          id
          name
        }
      }`;
  }

  static createPlatform() {
    return `
      mutation($platformInput: CreatePlatformInput!){
        createPlatform(platformInput: $platformInput){
          id
        }
      }`;
  }
}

export default StructureModel;
