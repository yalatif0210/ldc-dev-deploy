import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { map } from 'rxjs';

import { Menu } from '@core';
import { Token, User } from './interface';
import UserModel from '@shared/models/user.model';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  protected readonly http = inject(HttpClient);

  login(username: string, password: string, rememberMe = false) {
    return this.http.post<Token>('/api/auth/login', { username, password, rememberMe });
  }

  register(user: UserModel) {
    return this.http.post<any>('/api/auth/signup', user);
  }

  refresh(params: Record<string, any>) {
    return this.http.post<Token>('/auth/refresh', params);
  }

  logout() {
    return this.http.post<any>('/auth/logout', {});
  }

  user() {
    return this.http.get<User>('/user');
  }

  menu() {
    return this.http.get<{ menu: Menu[] }>('/user/menu').pipe(map(res => res.menu));
  }
}
