import ModelBase from './model.base';
import { EquipmentInterface } from './model.interface';

class EquipmentModel extends ModelBase {
  constructor(equipment: EquipmentInterface) {
    super(equipment);
  }

  static equipments() {
    return `
    {
      equipments{
        id
        name
        intrants {
          id
          name
          code
          sku
          primary_sku
          intrantType{
            id
            name
          }
          convertionFactor
          roundFactor
          otherFactor
        }
      }
    }`;
  }

  static equipmentById(id: number) {
    return `
      {
        equipment(id: ${id}) {
          id
          name
          intrants {
            id
            sku
            primary_sku
            code
            convertionFactor
            roundFactor
            otherFactor
            name
            intrantType {
              id
              name
            }
          }
        }
      }
    `;
  }

  static equipmentInforamtionByName = `query ($name: String) {
  equipmentInformationByName(name: $name) {
    information {
      id
      name
      subUnits {
        id
        name
        subSubUnits {
          id
          name
        }
      }
    }
    intrants {
      id
      sku
      primary_sku
      code
      convertionFactor
      roundFactor
      otherFactor
      name
    }
  }
}`;

  static equipmentByName = `query($name: String){
    equipmentByNameOther(name: $name){
      id
      name
      informationList{
        id
        informationUnit{
          id
          name
        }
        informationSubUnit{
          id
          name
        }
        informationSubSubUnit{
          id
          name
        }
      }
      intrants{
        id
        sku
        primary_sku
        code
        convertionFactor
        roundFactor
        otherFactor
        intrantType{
          id
          name
        }
        name
      }
    }
  }`;

  static equipmentIdByName = `query($name: String){
    equipmentByNameOther(name: $name){
      id
    }
  }`;
}

export default EquipmentModel;
