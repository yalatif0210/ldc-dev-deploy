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
    const role = this.authService.userRoleByToken;
    const built = menu.length > 0 ? menu : this.buildMenuByRole(role);
    this.menuService.addNamespace(built, 'menu');
    this.menuService.set(built);
  }

  private buildMenuByRole(role: string): Menu[] {
    const isAdmin = [UserRole.SUPER_ADMIN, UserRole.ADMIN].includes(role as UserRole);
    const isSupervisor = role === UserRole.SUPERVISOR;

    if (isAdmin || isSupervisor) {
      return [
        { route: 'dashboard', name: 'dashboard', type: 'link', icon: 'dashboard' },
        {
          route: 'zver/admin/settings', name: 'settings', type: 'sub', icon: 'settings',
          children: [
            {
              route: 'users', name: 'users', type: 'sub', icon: 'people',
              children: [
                { route: 'users', name: 'create_users', type: 'link', icon: 'person_add' },
                { route: 'manage-users', name: 'manage_users', type: 'link', icon: 'manage_accounts' },
              ],
            },
            {
              route: 'platforms', name: 'platforms', type: 'sub', icon: 'apartment',
              children: [
                { route: 'platforms', name: 'create_platforms', type: 'link', icon: 'add_business' },
                { route: 'platforms', name: 'manage_platforms', type: 'link', icon: 'apartment' },
              ],
            },
            {
              route: 'periods', name: 'periods', type: 'sub', icon: 'date_range',
              children: [
                { route: 'periods', name: 'create_periods', type: 'link', icon: 'add' },
                { route: 'periods', name: 'manage_periods', type: 'link', icon: 'calendar_month' },
              ],
            },
            {
              route: 'factors', name: 'factors', type: 'sub', icon: 'calculate',
              children: [
                { route: 'factors', name: 'manage_factors', type: 'link', icon: 'calculate' },
              ],
            },
          ],
        },
      ];
    }

    // LAB_USER / PHARM_USER
    return [
      { route: 'dashboard', name: 'dashboard', type: 'link', icon: 'dashboard' },
      {
        route: 'zver/public', name: 'weekly', type: 'sub', icon: 'insert_chart',
        children: [
          { route: 'report/init', name: 'create-report', type: 'link', icon: 'add_chart' },
          { route: 'report/history/overview', name: 'view-reports', type: 'link', icon: 'history' },
        ],
      },
    ];
  }

  private setPermissions(user: User) {
    const admin_permissions = ['canAdd', 'canDelete', 'canEdit', 'canRead'];
    const supervision_permissions = ['canRead'];
    const guest_permissions = ['canUpdate', 'canEdit', 'canRead'];
    const role = user?.roles?.[0] ?? user?.role;
    const permissions = [UserRole.ADMIN, UserRole.SUPER_ADMIN].includes(role)
      ? admin_permissions
      : role === UserRole.SUPERVISOR
        ? supervision_permissions
        : guest_permissions;
    this.permissonsService.loadPermissions(permissions);
    this.rolesService.flushRoles();
    this.rolesService.addRoles({ [role ?? 'GUEST']: permissions });

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
