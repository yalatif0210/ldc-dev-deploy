import { Routes } from '@angular/router';

import { Users } from './users/users';
import { Platform } from './platform/platform';
import { Period } from './period/period';
import { Factor } from './factors/factor';
import { ManageUsers } from './manage-users/manage-users';
import { adminGuard } from '@core/authentication/role-guard';

export const routes: Routes = [
  { path: 'users', component: Users, canActivate: [adminGuard] },
  { path: 'platforms', component: Platform, canActivate: [adminGuard] },
  { path: 'periods', component: Period, canActivate: [adminGuard] },
  { path: 'factors', component: Factor, canActivate: [adminGuard] },
  { path: 'manage-users', component: ManageUsers, canActivate: [adminGuard] },
];
