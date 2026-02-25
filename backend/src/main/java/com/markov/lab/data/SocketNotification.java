package com.markov.lab.data;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class SocketNotification  {
    private String notificationType;
    private long targetId;
    private long receiverId;
    private String message;
    private boolean isBroadcast;

    public SocketNotification(String notificationType, String message, long targetId, boolean isBroadcast, long receiverId) {
        this.notificationType = notificationType;
        this.targetId = targetId;
        this.message = message;
        this.isBroadcast = isBroadcast;
        this.receiverId = receiverId;
    }
}
