import { Routes } from '@angular/router';

import { Users } from './users/users';
import { Platform } from './platform/platform';
import { Period } from './period/period';
import { Factor } from './factors/factor';
import { ManageUsers } from './manage-users/manage-users';

export const routes: Routes = [
  { path: 'users', component: Users },
  { path: 'platforms', component: Platform },
  { path: 'periods', component: Period },
  { path: 'factors', component: Factor },

  // Settings management routes
  { path: 'manage-users', component: ManageUsers },
];
