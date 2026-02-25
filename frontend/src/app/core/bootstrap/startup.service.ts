import { Injectable, inject } from '@angular/core';
import { AuthService, User } from '@core/authentication';
import { NgxPermissionsService, NgxRolesService } from 'ngx-permissions';
import { switchMap, tap } from 'rxjs';
import { Menu, MenuService } from './menu.service';

@Injectable({
  providedIn: 'root',
})
export class StartupService {
  private readonly authService = inject(AuthService);
  private readonly menuService = inject(MenuService);
  private readonly permissonsService = inject(NgxPermissionsService);
  private readonly rolesService = inject(NgxRolesService);

  /**
   * Load the application only after get the menu or other essential informations
   * such as permissions and roles.
   */
  load() {
    return new Promise<void>((resolve, reject) => {
      this.authService
        .change()
        .pipe(
          tap(user => this.setPermissions(user)),
          switchMap(() => this.authService.menu()),
          tap(menu => this.setMenu(menu))
        )
        .subscribe({
          next: () => resolve(),
          error: () => resolve(),
        });
    });
  }

  private setMenu(menu: Menu[]) {
    this.menuService.addNamespace(menu, 'menu');
    this.menuService.set(menu);
  }

  private setPermissions(user: User) {
    console.log('User info:', user);
    // In a real app, you should get permissions and roles from the user information.
    const admin_permissions = ['canAdd', 'canDelete', 'canEdit', 'canRead'];
    const supervision_permissions = ['canRead'];
    const guest_permissions = ['canUpdate', 'canEdit', 'canRead'];
    const permissions = user?.roles?.includes(UserRole.ADMIN)
      ? admin_permissions
      : user?.roles?.includes(UserRole.SUPERVISOR)
        ? supervision_permissions
        : guest_permissions;
    this.permissonsService.loadPermissions(permissions);
    this.rolesService.flushRoles();
    this.rolesService.addRoles({ [user?.roles?.[0]]: permissions });

    // Tips: Alternatively you can add permissions with role at the same time.
    // this.rolesService.addRolesWithPermissions({ ADMIN: permissions });
  }
}

export enum UserRole {
  ADMIN = 'ADMIN',
  SUPER_ADMIN = 'SUPER_ADMIN',
  SUPERVISOR = 'SUPERVISOR',
  LAB_USER = 'LABORATORY_USER',
  PHARM_USER = 'PHARMACY_USER',
  GUEST = 'GUEST',
  USER = 'USER'
}

export enum ReportStatus {
  DRAFT = 'DRAFT',
  SUBMITTED = 'SUBMITTED',
  APPROVED = 'APPROVED',
  SUGGESTED = 'SUGGESTED'
}
