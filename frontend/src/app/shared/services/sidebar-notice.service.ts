import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { SharedService } from './shared.service';
import SideBarNoticeModel from '@shared/models/sidebar-notice.model';
import NotificationModel from '@shared/models/notification.model';
import TransactionModel from '@shared/models/transaction.model';
import { tr } from 'date-fns/locale';

export type SidebarNoticeType = 'info' | 'success' | 'warning' | 'error';

export interface SidebarNotice {
  id: number;
  message: string;
  type: SidebarNoticeType;
  createdAt: number;
}

@Injectable({
  providedIn: 'root',
})
export class SidebarNoticeService extends SharedService implements OnDestroy {
  private noticesSubject = new BehaviorSubject<any>([]);
  public readonly notices$: Observable<any> = this.noticesSubject.asObservable();

  get sanguineProducts(): Observable<any> {
    return this.query(SideBarNoticeModel.sanguineProducts);
  }

  getNotificationList(notifications: any[], target: number): any {
    switch (target) {
      case 0:
        return notifications.slice(0, 20);
        break;
      case 1:
        return notifications.filter(
          notif => notif.labelTitle === 'Finalisé' || notif.labelTitle === 'Résolue'
        );
        break;
      case 2:
        return notifications.filter(
          notif =>
            notif.labelTitle !== 'Finalisé' &&
            notif.labelTitle !== 'Résolue' &&
            notif.labelTitle !== 'Faire suivre...'
        );
        break;
      case 3:
        return notifications.filter(notif => notif.labelTitle === 'Faire suivre...');
        break;
      case 4:
        return notifications;
        break;
    }
  }

  createTransfer(data: any) {
    console.log('>>> - sidebar-notice.service.ts:57', data);
    this.rest.setRestEndpoint('/api/transactions/create');
    this.rest.query(data).subscribe({
      next: response => {},
      error: error => {},
    });
  }

  updateTransfert(data: any): Observable<any> {
    console.log('>>> - sidebar-notice.service.ts:66', data);
    this.rest.setRestEndpoint('/api/transactions/update');
    return this.rest.query(data);
  }

  createNotification(data: any) {
    console.log('>>> - sidebar-notice.service.ts:72', data);
    this.rest.setRestEndpoint('/api/notifications/create');
    this.rest.query(data).subscribe({
      next: response => {},
      error: error => {},
    });
  }

  updateNotification(data: any): Observable<any> {
    console.log('>>> - sidebar-notice.service.ts:81', data);
    this.rest.setRestEndpoint('/api/notifications/update');
    return this.rest.query(data);
  }

  getNotifications(): Observable<any> {
    return this.query(NotificationModel.NOTIFICATION);
  }

  getNotificationById(id: any): Observable<any> {
    return this.query(NotificationModel.NOTIFICATION_BY_ID, id);
  }

  getTransfers(ids: any): Observable<any> {
    return this.query(TransactionModel.TRANSACTION_BY_ORIGIN_OR_DESTINATION, ids);
  }

  getTransferById(id: any): Observable<any> {
    return this.query(TransactionModel.TRANSACTION_BY_ID, id);
  }

  sortNoticesByDateDesc(
    notifications: any,
    transfers: any,
    userStructureId: number,
    isUserAdminOrSupervisor: boolean
  ): void {
    const current = [...notifications, ...transfers];
    const sorted = [...current].sort((a, b) => {
      const timeA = new Date((a as any).createdAt).getTime();
      const timeB = new Date((b as any).createdAt).getTime();
      return timeB - timeA;
    });
    return this.notificationHandler(sorted, userStructureId, isUserAdminOrSupervisor);
  }

  notificationHandler(
    notifications: any,
    userStructureId: number,
    isUserAdminOrSupervisor: boolean
  ): void {
    const notificationsList = [];
    for (const notification of notifications) {
      if (notification.emitter) {
        notificationsList.push({
          icon: '📢',
          color: 'bg-red-90',
          date: new Date(notification.createdAt),
          backgroundColor:
            notification.isResolved || notification.isRejected ? '#f0f2f5' : '#e7f3ff',
          title: `Nouvelle Alerte de ${notification.emitter.name}`,
          content: `Bésoin de ${notification.quantity} unités de ${notification.intrant.name} pour l'équipement ${notification.equipment.name}.`,
          transactionType: 'NOTIFICATION',
          labelTitle:
            (notification.isResolved || notification.isRejected )  ? 'Résolue' : (isUserAdminOrSupervisor || notification.emitter.id === userStructureId) ? 'En attente' : 'Faire suivre...',
          data: notification,
        });
      } else {
        notificationsList.push({
          icon: '🔔',
          color: 'bg-red-90',
          date: new Date(notification.createdAt),
          backgroundColor: notification.approved || notification.isRejected ? '#f0f2f5' : '#e7f3ff',
          title: `Nouveau transfert ${isUserAdminOrSupervisor ? 'OUT' : notification.origin.id === userStructureId ? 'OUT' : 'IN'} de ${notification.origin.name} ${isUserAdminOrSupervisor ? 'vers ' + notification.destination.name : notification.origin.id === userStructureId ? 'vers ' + notification.destination.name : ''}`,
          content: this.transactionMessageHandler(
            notification,
            userStructureId,
            isUserAdminOrSupervisor
          ),
          transactionType: isUserAdminOrSupervisor
            ? 'OUT'
            : notification.origin.id === userStructureId
              ? 'OUT'
              : 'IN',
          labelTitle: isUserAdminOrSupervisor
            ? notification.approved || notification.isRejected
              ? 'Finalisé'
              : 'Non Finalisé'
            : notification.origin.id === userStructureId
              ? notification.approved || notification.isRejected
                ? 'Finalisé'
                : 'Non Finalisé'
              : notification.approved || notification.isRejected
                ? 'Finalisé'
                : 'Faire suivre...',
          data: notification,
        });
      }
    }
    this.noticesSubject.next(notificationsList);
  }

  transactionMessageHandler(
    transaction: any,
    userStructureId: number,
    isUserAdminOrSupervisor: boolean
  ): string {
    if (transaction.sanguineProductTransactions.length) {
      return `Transfert ${isUserAdminOrSupervisor ? 'OUT' : transaction.origin.id === userStructureId ? 'OUT' : 'IN'} de ${transaction.sanguineProductTransactions
        .map((prod: any) => `${prod.quantity} unités de ${prod.sanguineProduct.name}`)
        .join(', ')}.`;
    }
    return `Transfert ${isUserAdminOrSupervisor ? 'OUT' : transaction.origin.id === userStructureId ? 'OUT' : 'IN'} de ${transaction.medicinesTransaction
      .map((med: any) => `${med.quantity} unités de ${med.intrant.name}`)
      .join(', ')}.`;
  }

  getTransactactionIntrant(transaction: any): { quantity: number; name: string }[] {
    if (transaction.sanguineProductTransactions.length) {
      return transaction.sanguineProductTransactions.map((prod: any) => ({
        quantity: prod.quantity,
        name: prod.sanguineProduct.name,
      }));
    }
    return transaction.medicinesTransaction.map((med: any) => ({
      quantity: med.quantity,
      name: med.intrant.name,
    }));
  }

  add(notification: any, userStructureId: number, isUserAdminOrSupervisor: boolean): void {
    if (notification.notificationType === 'transfer') {
      this.getTransferById({ id: notification.targetId }).subscribe(response => {
        const data = response.data.transaction;
        const notice = {
          icon: '🔔',
          color: 'bg-red-90',
          date: new Date(data.createdAt),
          backgroundColor: data.approved || data.isRejected ? '#f0f2f5' : '#e7f3ff',
          title: `Nouveau transfert ${isUserAdminOrSupervisor ? 'OUT' : data.origin.id === userStructureId ? 'OUT' : 'IN'} de ${data.origin.name} ${isUserAdminOrSupervisor ? 'vers ' + notification.destination.name : notification.origin.id === userStructureId ? 'vers ' + notification.destination.name : ''}`,
          content: this.transactionMessageHandler(data, userStructureId, isUserAdminOrSupervisor),
          transactionType: isUserAdminOrSupervisor
            ? 'OUT'
            : data.origin.id === userStructureId
              ? 'OUT'
              : 'IN',
          labelTitle: isUserAdminOrSupervisor
            ? notification.approved || notification.isRejected
              ? 'Finalisé'
              : 'Non Finalisé'
            : data.origin.id === userStructureId
              ? data.approved || data.isRejected
                ? 'Finalisé'
                : 'Non Finalisé'
              : data.approved || data.isRejected
                ? 'Finalisé'
                : 'Faire suivre...',
          data,
        };
        const current = [notice, ...this.noticesSubject.getValue()];
        this.noticesSubject.next(current);
      });
    } else {
      this.getNotificationById({ id: notification.targetId }).subscribe(response => {
        const data = response.data.sapNotification;
        const notice = {
          icon: '📢',
          color: 'bg-red-90',
          date: new Date(data.createdAt),
          backgroundColor: data.isResolved || data.isRejected ? '#f0f2f5' : '#e7f3ff',
          title: `Nouvelle Alerte de ${data.emitter.name}`,
          content: `Bésoin de ${data.quantity} unités de ${data.intrant.name} pour l'équipement ${data.equipment.name}.`,
          transactionType: 'NOTIFICATION',
          labelTitle: data.isResolved || data.isRejected ? 'Résolue' : (isUserAdminOrSupervisor || data.emitter.id === userStructureId) ? 'En attente' :'Faire suivre...',
          data,
        };
        const current = [notice, ...this.noticesSubject.getValue()];
        this.noticesSubject.next(current);
      });
    }
  }

  ngOnDestroy(): void {}
}
