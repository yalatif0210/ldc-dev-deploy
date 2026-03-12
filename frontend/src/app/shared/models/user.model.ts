import ModelBase from './model.base';
import { UserInterface } from './model.interface';

class UserModel extends ModelBase {
  name?: string;
  username?: string;
  phone?: string;
  password?: string;
  role?: number;
  regions?: number[];
  platforms?: number[];

  constructor(user: UserInterface) {
    super(user);
  }

  static userRole() {
    return `
      {
        roles {
          id
          role
        }
      }
      `;
  }

  static updateUser() {
    return `
      mutation ($id: ID, $userInput: UserInput) {
        updateUser(id: $id, userInput: $userInput) {
          id
          name
          username
          phone
        }
      }
    `;
  }
}

export default UserModel;
