import { inject, Injectable } from '@angular/core';
import { SharedService } from './shared.service';
import { FormGroup } from '@angular/forms';
import { Cacheable, LocalStorageStrategy } from 'ts-cacheable';
import { AccountInterface } from '../models/model.interface';
import { forkJoin, Observable, Subject } from 'rxjs';
import AccountModel from '../models/account.model';
import { filterObject } from '@core/authentication/helpers';

export interface AccountList {
  id: number;
  name: string;
  username: string;
  phone: string;
  plateform: string;
  role: string;
  isActive: boolean;
}

const cacheBuster$ = new Subject<void>();

@Injectable({
  providedIn: 'root',
})
export class UserManagementService extends SharedService {
  public new_user: any = { userType: '', region: '', platform: '' };

  createUser(form: FormGroup): void {
    if (form.valid) {
      this.new_user = form.value;
      console.log(form.value);
      // Here you can handle the form submission, e.g., send data to the server
    }
  }

  getAccount(): Observable<any> {
    return this.query(AccountModel.accounts());
  }

  onCreate() {
    forkJoin([this.getAccount()]).subscribe(([accounts]) => {
      this.setList(this.accountsToList(accounts.data.accounts as AccountInterface[]));
    });
  }

  accountsToList(accounts: AccountInterface[], for_management = false): AccountList[] {
    const accountsList: AccountInterface[] = accounts.filter(
      account => account !== null && account.structures![0] !== null
    );
    const result: any[] = [];
    accountsList.map((account: AccountInterface, index: number) => {
      if (!for_management) {
        result.push({
          id: index + 1,
          name: (account && account!.user!.name!) || '',
          username: (account && account!.user!.username!) || '',
          phone: (account && account!.user!.phone!) || '',
          plateform: (account && account!.structures![0] && account!.structures![0]!.name!) || '',
          role: account && account!.role!.role,
          isActive: (account && account!.isActive!) || '',
        });
      } else {
        result.push({
          id: index + 1,
          name: (account && account!.user!.name!) || '',
          username: (account && account!.user!.username!) || '',
          phone: (account && account!.user!.phone!) || '',
          plateform: (account && account!.structures![0] && account!.structures![0]!.name!) || '',
          role: account && account!.role!.role,
          isActive: (account && account!.isActive!) || '',
          action: account
        });
      }
    });
    return result;
  }

  getCreatedUser() {
    return this.new_user;
  }
}
