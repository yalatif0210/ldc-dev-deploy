import { Component } from '@angular/core';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';

@Component({
  selector: 'app-enotification',
  templateUrl: './notification.html',
  styles: `
    :host ::ng-deep .mat-badge-content {
      --mat-badge-background-color: #ef0000;
      --mat-badge-text-color: #fff;
    }
  `,
  imports: [MatBadgeModule, MatButtonModule, MatIconModule, MatListModule, MatMenuModule],
})
export class AppNotification {
  messages = [
    {
      icon: '🔔',
      color: 'bg-red-95',
      title: 'General Meeting for update',
      content: `You can use the Dashboard to explore how many new users download reports daily and monthly.`,
    },
    {
      icon: '📢',
      color: 'bg-azure-95',
      title: 'Widgets update',
      content: `We've made some updates to the emendable widget which we think you are going to love.`,
    },
    {
      icon: '⏳',
      color: 'bg-violet-95',
      title: 'Coming soon new features',
      content: `More new features are coming soon, so stay patient!`,
    },
  ];
}
