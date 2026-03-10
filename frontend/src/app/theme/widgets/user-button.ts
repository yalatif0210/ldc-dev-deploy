import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { Router, RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { debounceTime, tap } from 'rxjs';

import { AuthService, SettingsService, User } from '@core';

@Component({
  selector: 'app-user',
  template: `
    <button mat-icon-button [matMenuTriggerFor]="menu">
      <img class="avatar" [src]="user.avatar" width="24" alt="avatar" />
    </button>

    <mat-menu #menu="matMenu">
      <button mat-menu-item (click)="logout()">
        <mat-icon>account_circle</mat-icon>
        <span>{{ user_name! | translate }}</span>
      </button>
      @if(!isAdmin){<button routerLink="zver/public//settings" mat-menu-item>
        <mat-icon>settings</mat-icon>
        <span>{{ 'Configurer mes CMM' }}</span>
      </button>}
      <button mat-menu-item  (click)="logout()">
        <mat-icon>exit_to_app</mat-icon>
        <span>{{ 'logout' | translate }}</span>
      </button>
    </mat-menu>
  `,
  styles: `
    .avatar {
      width: 1.5rem;
      height: 1.5rem;
      border-radius: 50rem;
    }
  `,
  imports: [RouterLink, MatButtonModule, MatIconModule, MatMenuModule, TranslateModule],
})
export class UserButton implements OnInit {
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly settings = inject(SettingsService);
  isAdmin: any;

  user!: User;
  user_name = '';

  setusername(name: string) {
    this.user_name = name?.split(' ')[0] || '';
  }

  ngOnInit(): void {
    this.isAdmin = this.auth.isUserAdminOrSupervisor(this.auth.userRoleByToken);
    this.auth
      .user()
      .pipe(
        tap((user: any) => {
          this.user = user;
          this.setusername(user.name!);
        }),
        debounceTime(10)
      )
      .subscribe(() => this.cdr.detectChanges());
  }

  logout() {
    this.auth.logout().subscribe(() => {
      this.router.navigateByUrl('/auth/login');
    });
  }

  restore() {
    this.settings.reset();
    window.location.reload();
  }
}
