import { Component, inject, OnDestroy, OnInit, signal, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatBadgeModule } from '@angular/material/badge';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatTabsModule } from '@angular/material/tabs';
import { FormBaseComponent } from '@shared';
import { NotificationService } from '@shared/services/notification.service';
import { SidebarNoticeService } from '@shared/services/sidebar-notice.service';
import { forkJoin, Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatChipsModule } from '@angular/material/chips';
import { AuthService, UserRole } from '@core';

@Component({
  selector: 'app-sidebar-notice',
  templateUrl: './sidebar-notice.html',
  styleUrl: './sidebar-notice.scss',
  host: {
    class: 'matero-sidebar-notice',
  },
  styles: `
    :host ::ng-deep .mat-badge-content {
      --mat-badge-background-color: #ef0000;
      --mat-badge-text-color: #fff;
    }
  `,
  encapsulation: ViewEncapsulation.None,
  imports: [
    MatTabsModule,
    FormsModule,
    MatBadgeModule,
    MatListModule,
    MatMenuModule,
    ReactiveFormsModule,
    CommonModule,
    MatChipsModule,
  ],
})
export class SidebarNotice extends FormBaseComponent implements OnInit, OnDestroy {
  transfert: FormGroup | undefined;
  transfert_data: FormGroup | undefined;
  notification_data: FormGroup | undefined;
  targeted = '';
  sanguineProducts: any[] = [];
  intrants: any[] = [];
  equipments: any[] = [];
  strutctures: any[] = [];
  notifications: any[] = [];
  notificationListFiltered = signal<any[]>([]);
  notificationTargets = signal<number>(0);
  disabled = false;
  userAccount!: any;
  noticeDialog = inject(MatDialog);
  private readonly service = inject(SidebarNoticeService);
  private readonly authService = inject(AuthService);
  private readonly notificationService = inject(NotificationService);
  notifySubscription = Subscription.EMPTY;
  filteredStructures: any[] = [];
  constructor() {
    super();
    this.transfert = this.buildFormFromArray([
      { key: 'transfert_target', defaultValue: '', validators: [] },
    ]);
    this.transfert_data = this.buildFormFromArray([
      { key: 'sample', defaultValue: '', validators: [] },
      { key: 'destination', defaultValue: '', validators: [] },
      { key: 'intrant', defaultValue: '', validators: [] },
      { key: 'equipment', defaultValue: '', validators: [] },
      { key: 'quantity', defaultValue: '', validators: [] },
    ]);
    this.notification_data = this.buildFormFromArray([
      { key: 'notification_equipment', defaultValue: '', validators: [] },
      { key: 'notification_intrant', defaultValue: '', validators: [] },
      { key: 'notification_quantity', defaultValue: '', validators: [] },
    ]);
  }

  chip_options = [
    { label: 'All' },
    { label: 'Finalisé' },
    { label: 'En Attente' },
    { label: 'Autre' },
  ];

  sub_tabs = [
    {
      label: 'Transferts',
    },
    {
      label: 'Alertes',
    },
  ];

  tabs = this.isUserAdminOrSupervisor
    ? [
        {
          label: 'Notifications',
        },
      ]
    : [
        {
          label: 'Transactions',
        },
        {
          label: 'Notifications',
        },
      ];

  get target() {
    return this.targeted;
  }

  setNotificationListTarget(target: number) {
    this.notificationTargets.set(target);
    this.notificationListFiltered.set(this.service.getNotificationList(this.notifications, target));
  }

  get notificationList() {
    return this.notificationListFiltered();
  }

  get notificationTarget() {
    return this.notificationTargets();
  }

  get isUserAdminOrSupervisor() {
    return this.authService.isUserAdminOrSupervisor(this.authService.userRoleByToken);
  }

  get isUserPharmUser() {
    return this.authService.userRoleByToken === UserRole.PHARM_USER;
  }

  openNoticeDialog(data: any) {
    this.notificationTargets.set(0);
    data['isUserAdminOrSupervisor'] =  this.isUserAdminOrSupervisor;
    this.noticeDialog.open(DialogNotice, {
      data
    });
  }

  transactionHandler() {
    const formData = this.transfert_data?.value;
    this.disabled = true;
    if (this.targeted == 'échantillons sanguins') {
      this.service.createTransfer({
        origin_id: Number(this.userAccount.structures[0].id),
        destination_id: Number(formData.destination),
        equipment_id: Number(formData.equipment),
        sanguine_product_transaction_input_list: [
          {
            sanguine_product_id: Number(formData.sample),
            quantity: formData.quantity,
          },
        ],
        medicines_transaction_input_list: [],
      });
      this.disabled = false;
    } else {
      this.service.createTransfer({
        origin_id: Number(this.userAccount.structures[0].id),
        destination_id: Number(formData.destination),
        sanguine_product_transaction_input_list: [],
        medicines_transaction_input_list: [
          {
            intrant_id: Number(formData.intrant),
            quantity: formData.quantity,
          },
        ],
      });
      this.disabled = false;
    }
  }

  sapiNotificationHandler() {
    const formData = this.notification_data?.value;
    this.disabled = true;
    this.service.createNotification({
      emitter: Number(this.userAccount.structures[0].id),
      equipment: Number(formData.notification_equipment),
      intrant: Number(formData.notification_intrant),
      quantity: formData.notification_quantity,
      isResolved: false,
    });
    this.disabled = false;
  }

  ngOnInit(): void {
    forkJoin([
      this.service.sanguineProducts,
      this.service.getStructure(),
      this.service.getAccountEquipments(),
      this.service.userInformation(),
    ]).subscribe(([sanguineProducts, structures, accountEquipments, userAccount]) => {
      this.sanguineProducts = sanguineProducts.data.sanguineProducts;
      this.strutctures = structures.data.structures;
      this.equipments = accountEquipments.data.account.structures[0].equipments;
      this.userAccount = userAccount.data.account;
      this.notificationService.connect(
        userAccount.data.account.structures[0].id,
        this.isUserAdminOrSupervisor,
        this.service.add.bind(this.service)
      );
      forkJoin([
        this.service.getNotifications(),
        this.service.getTransfers({
          destinationId: this.userAccount.structures[0].id,
          originId: this.userAccount.structures[0].id,
        }),
      ]).subscribe(([notifications, transfers]) => {
        this.service.sortNoticesByDateDesc(
          notifications.data.sapNotifications,
          transfers.data.transactionsByOriginOrDestinationId,
          userAccount.data.account.structures[0].id,
          this.isUserAdminOrSupervisor
        );
      });
    });
    this.transfert?.get('transfert_target')?.valueChanges.subscribe(value => {
      this.targeted = value;
    });
    this.transfert_data?.get('equipment')?.valueChanges.subscribe(value => {
      this.intrants = this.equipments.find((eq: any) => eq.id === value)?.intrants || [];
      this.filteredStructures = this.strutctures
        .filter(item => item.equipments.some((eq: any) => eq.id === value))
        .filter(e => e.id !== this.userAccount.structures[0].id);
    });
    this.notification_data?.get('notification_equipment')?.valueChanges.subscribe(value => {
      this.intrants = this.equipments.find((eq: any) => eq.id === value)?.intrants || [];
    });
    this.notifySubscription = this.service.notices$.subscribe(notifications => {
      this.notifications = notifications;
      this.notificationTargets.set(0);
      this.notificationListFiltered.set(this.service.getNotificationList(this.notifications, 0));
    });
  }
}

@Component({
  selector: 'dialog-welcome',
  templateUrl: 'dialog-notice.html',
  imports: [MatDialogModule, MatButtonModule, ReactiveFormsModule],
})
export class DialogNotice extends FormBaseComponent implements OnInit {
  public data: any = inject(MAT_DIALOG_DATA);
  transfert: FormGroup | undefined;
  disable!: boolean;
  private readonly service = inject(SidebarNoticeService);

  constructor() {
    super();
    this.transfert = this.buildFormFromArray([
      { key: 'transfert_target', defaultValue: '', validators: [] },
    ]);
  }

  ngOnInit(): void {
    this.disable = false;
  }

  get transactionIntrant() {
    return this.service.getTransactactionIntrant(this.data.data)[0];
  }

  handleResolveNotification(data: any, isTransfert = false , approved = true) {
    this.disable = true;
    const formData = this.transfert?.value;
    this.service.userInformation().subscribe(userAccount => {
      (isTransfert
        ? this.service.updateTransfert({
            id: data.data.id,
            isApproved: approved,
            isRejected: !approved,
          })
        : this.service.updateNotification({
            id: data.data.id,
            isResolved: approved,
            isRejected: !approved,
          })
      ).subscribe(response => {
        if (response.successCode == 200) {
          if (!isTransfert) {
            this.service.createTransfer({
              origin_id: Number(userAccount.data.account.structures[0].id),
              destination_id: Number(data.data.emitter.id),
              sanguine_product_transaction_input_list: [],
              medicines_transaction_input_list: [
                {
                  intrant_id: Number(data.data.intrant.id),
                  quantity: formData.transfert_target,
                },
              ],
            });
          }
          forkJoin([
            this.service.getNotifications(),
            this.service.getTransfers({
              destinationId: userAccount.data.account.structures[0].id,
              originId: userAccount.data.account.structures[0].id,
            }),
          ]).subscribe(([notifications, transfers]) => {
            this.service.sortNoticesByDateDesc(
              notifications.data.sapNotifications,
              transfers.data.transactionsByOriginOrDestinationId,
              userAccount.data.account.structures[0].id,
              data.isUserAdminOrSupervisor
            );
          });
        }
      });
    });
  }
}
