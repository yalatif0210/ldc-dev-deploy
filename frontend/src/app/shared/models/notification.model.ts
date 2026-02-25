 class NotificationModel {
  static readonly NOTIFICATION = `query{
  sapNotifications{
    id
    createdAt
    emitter{
      id
      name
    }
    equipment{
      id
      name
    }
    intrant{
      id
      name
    }
    quantity
    isResolved
    isRejected
  }
}`;

  static readonly NOTIFICATION_BY_ID = `query ($id: ID) {
  sapNotification(id: $id) {
    id
    createdAt
    emitter {
      id
      name
    }
    equipment {
      id
      name
    }
    intrant {
      id
      name
    }
    quantity
    isResolved
    isRejected
  }
}`;
}

export default NotificationModel;
