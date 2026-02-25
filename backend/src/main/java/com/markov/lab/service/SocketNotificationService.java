package com.markov.lab.service;

import com.markov.lab.data.SocketNotification;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

@Service
public class SocketNotificationService {

    private final SimpMessagingTemplate messagingTemplate;

    SocketNotificationService(SimpMessagingTemplate messagingTemplate) {
        this.messagingTemplate = messagingTemplate;
    }

    public void send(SocketNotification notification) {

        if (notification.isBroadcast()) {
            // Global Notification
            messagingTemplate.convertAndSend("/topic/broadcast", notification);
        } else {
            // Private Notification
            messagingTemplate.convertAndSend(
                    "/topic/notifications/" + notification.getReceiverId(),
                    notification
            );
        }
    }

    public void send_to_admin(SocketNotification notification){
        messagingTemplate.convertAndSend("/topic/admin", notification);
    }
}
