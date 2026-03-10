import {
  Component,
  EventEmitter,
  inject,
  Input,
  OnInit,
  Output,
  ViewEncapsulation,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import screenfull from 'screenfull';

import { Branding } from '../widgets/branding';
import { UserButton } from '../widgets/user-button';
import { AppNotification } from '@theme/notification/notification';
import { MatBadgeModule } from '@angular/material/badge';
import { Subscription } from 'rxjs';
import { SidebarNoticeService } from '@shared/services/sidebar-notice.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.html',
  styleUrl: './header.scss',
  host: {
    class: 'matero-header',
  },
  styles: `
    :host ::ng-deep .mat-badge-content {
      --mat-badge-background-color: #ef0000;
      --mat-badge-text-color: #fff;
    }
  `,
  encapsulation: ViewEncapsulation.None,
  imports: [MatToolbarModule, MatButtonModule, MatIconModule, MatBadgeModule, Branding, UserButton],
})
export class Header implements OnInit {
  @Input() showToggle = true;
  @Input() showBranding = false;

  @Output() toggleSidenav = new EventEmitter<void>();
  @Output() toggleSidenavNotice = new EventEmitter<void>();

  private readonly service = inject(SidebarNoticeService);
  notifySubscription = Subscription.EMPTY;
  count = 0;

  toggleFullscreen() {
    if (screenfull.isEnabled) {
      screenfull.toggle();
    }
  }

  countNotifications(notifications: any[]): number {
    const notificationCount = notifications.filter(
      n => n.transactionType === 'NOTIFICATION' && !n.data.isResolved && !n.data.isRejected
    ).length;
    const transfertCount = notifications.filter(
      n => n.transactionType !== 'NOTIFICATION' && !n.data.isRejected && !n.data.approved
    ).length;
    return notificationCount + transfertCount;
  }

  ngOnInit(): void {
    this.notifySubscription = this.service.notices$.subscribe(notifications => {
      this.count = this.countNotifications(notifications);
    });
  }
}
