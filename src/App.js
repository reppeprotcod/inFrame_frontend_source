import React from "react";
import AuthContext from './contexts/AuthContext';
import { useContext } from 'react';
import { Navbar } from "./components/Navbar";
import { useAuth } from "./hooks/auth.hook";
import { useNotifications } from "./hooks/notifications.hook";
import { BrowserRouter } from "react-router-dom";
import { useRoutes } from "./routes";
import NotificationsContext from "./contexts/NotificationsContext";

const App = () => {
  const auth = useAuth();
  const notifications = useNotifications();
  const routes = useRoutes(auth.token != null);

  return (
    <AuthContext.Provider value={{
      login: auth.login,
      logout: auth.logout,
      token: auth.token
    }}>
      <NotificationsContext.Provider value={{
        notifications: notifications.notifications,
        notificationBadge: notifications.notificationBadge,
        setNotifications: notifications.setNotifications,
        setNotificationsBadge: notifications.setNotificationBadge,
      }}>
        <BrowserRouter>
          <Navbar authenticated={auth.token != null} logout={auth.logout} />
          {routes}
        </BrowserRouter>
      </NotificationsContext.Provider>
    </AuthContext.Provider>
  );
}

export default App;