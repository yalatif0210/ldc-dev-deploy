import ModelBase from './model.base';
import { AccountInterface } from './model.interface';

class AccountModel extends ModelBase {
  constructor(account: AccountInterface) {
    super(account);
  }

  static accountById = `query ($id: ID!) {
    account(id: $id) {
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
  }`;

  static accountEquipment() {
    return `query($id: ID!) {
      account(id: $id){
        id
        structures{
          id
          name
          equipments{
            id
            name
            intrants{
              id
              name
              intrantType{
                id
                name
              }
            }
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
          }
        }
      }
    }`;
  }

  static accounts() {
    return `{
      accounts{
        role{
          role
        }
        user{
          id
          name
          username
          phone
        }
        structures{
          name
          code
          district{
            name
            region{
              name
            }
          }
        }
        isActive
        id
      }
    }`;
  }
}

export default AccountModel;
