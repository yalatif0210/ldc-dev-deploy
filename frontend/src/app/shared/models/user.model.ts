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
}

export default UserModel;
