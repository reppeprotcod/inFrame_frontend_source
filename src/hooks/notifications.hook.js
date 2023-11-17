import { useCallback, useState } from "react"

export const useNotifications = () => {
    const [notifications, setNotifications] = useState([]);
    const [notificationBadge, setNotificationBadge] = useState(false);

    return {
        notifications,
        notificationBadge,
        setNotifications,
        setNotificationBadge,
    };
}
