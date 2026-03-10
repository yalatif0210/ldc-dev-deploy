import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';
import { UserRole } from '@core/bootstrap';

export const adminGuard = () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  if (!auth.check()) return router.parseUrl('/auth/login');
  const role = auth.userRoleByToken;
  const allowed = [UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.SUPERVISOR];
  return allowed.includes(role) ? true : router.parseUrl('/403');
};

export const publicUserGuard = () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  if (!auth.check()) return router.parseUrl('/auth/login');
  const role = auth.userRoleByToken;
  const allowed = [UserRole.LAB_USER, UserRole.PHARM_USER];
  return allowed.includes(role) ? true : router.parseUrl('/403');
};

export const synthesisGuard = () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  if (!auth.check()) return router.parseUrl('/auth/login');
  const role = auth.userRoleByToken;
  const allowed = [UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.SUPERVISOR, UserRole.LAB_USER, UserRole.PHARM_USER];
  return allowed.includes(role) ? true : router.parseUrl('/403');
};
