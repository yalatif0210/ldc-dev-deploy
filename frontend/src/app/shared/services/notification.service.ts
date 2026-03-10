import { Injectable } from '@angular/core';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private stompClient!: Client;

  connect(
    strucuteId: string,
    isUserAdminOrSupervisor: boolean,
    callBack: (notif: any, id: any, isUserAdminOrSupervisor: boolean) => void
  ) {
    this.stompClient = new Client({
      webSocketFactory: () => new SockJS('/ws'),
      reconnectDelay: 5000,
    });

    this.stompClient.onConnect = () => {
      // 🟢 Notifications privées
      const url = isUserAdminOrSupervisor ? '/topic/admin' : `/topic/notifications/${strucuteId}`;
      this.stompClient.subscribe(url, (message: any) => {
        const notif = JSON.parse(message.body);
        //this.showBrowserNotification('📢 LDC Notification', notif.message);
        callBack(notif, strucuteId, isUserAdminOrSupervisor);
      });

      // 🔵 Notifications globales
      this.stompClient.subscribe(`/topic/broadcast`, (message: any) => {
        const notif = JSON.parse(message.body);
        //this.showBrowserNotification('📢 LDC Notification', notif.message);
        callBack(notif, strucuteId, isUserAdminOrSupervisor);
      });
    };
    // 🟢 Très important → **Activer la connexion ici**
    this.stompClient.activate();
  }

  requestBrowserPermission() {
    if (!('Notification' in window)) {
      console.warn('Notifications non supportées. - notification.service.ts:44');
      return;
    }

    Notification.requestPermission().then(permission => {
    });
  }

  private showBrowserNotification(title: string, body: string) {
    if (Notification.permission === 'granted') {
      //this.playSound();
      new Notification(title, { body });
    }
  }

  private playSound() {
    const audio = new Audio('audio/ping.mp3');
    audio.play();
  }

  disconnect() {
    if (this.stompClient) {
      this.stompClient.deactivate();
    }
  }
}
