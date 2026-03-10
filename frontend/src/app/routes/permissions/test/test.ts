import { JsonPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MtxAlertModule } from '@ng-matero/extensions/alert';
import { NgxPermissionsModule, NgxPermissionsService } from 'ngx-permissions';

import { PageHeader } from '@shared';

@Component({
  selector: 'app-permissions-test',
  templateUrl: './test.html',
  styleUrl: './test.scss',
  imports: [JsonPipe, MatCardModule, MtxAlertModule, NgxPermissionsModule, PageHeader],
})
export class PermissionsTest {
  private readonly permissionsSrv = inject(NgxPermissionsService);

  comparedPermission: string[] = ['guest'];

  getPermissions() {
    return Object.keys(this.permissionsSrv.getPermissions());
  }

  addPermission() {
    // this.permissionsSrv.loadPermissions(['admin']);
    this.permissionsSrv.addPermission('admin', () => {
      // return false;
      return new Promise<boolean>((resolve, reject) => {
        setTimeout(() => resolve(true), 2000);
      });
    });
  }

  removePermission() {
    this.permissionsSrv.removePermission('admin');
  }

  unAuthorized() {}

  authorized() {}

  changeToAdmin() {
    this.comparedPermission = ['admin'];
  }

  changeToAnotherPermission() {
    this.comparedPermission = ['awesome'];
  }

  changeToGuest() {
    this.comparedPermission = ['guest'];
  }
}
