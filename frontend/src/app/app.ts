import { Component, OnInit, AfterViewInit, inject } from '@angular/core';
import { PreloaderService, SettingsService } from '@core';
import { RouterOutlet } from '@angular/router';
import { NotificationService } from '@shared/services/notification.service';

@Component({
  selector: 'app-root',
  template: `
    <router-outlet />
  `,
  imports: [RouterOutlet],
})
export class App implements OnInit, AfterViewInit {
  private readonly preloader = inject(PreloaderService);
  private readonly settings = inject(SettingsService);
  private readonly notificationService = inject(NotificationService);

  ngOnInit() {
    this.settings.setDirection();
    this.settings.setTheme();
    this.notificationService.requestBrowserPermission();
  }

  ngAfterViewInit() {
    this.preloader.hide();
  }
}
