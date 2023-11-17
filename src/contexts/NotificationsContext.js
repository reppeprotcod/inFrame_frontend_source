import { createContext } from "react";

const NotificationsContext = createContext({
    notifications: [],
    notificationBadge: false,
    setNotifications: () => {},
    setNotificationsBadge: () => {},
});

export default NotificationsContext;