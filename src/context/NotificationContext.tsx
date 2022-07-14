import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

export type NotificationType = 'success' | 'failure';

export interface INotification {
  type: NotificationType;
  content: ReactNode;
}

interface INotificationContext {
  notifications: INotification[];
  addNotification: (n: INotification) => void;
  removeNotification: (n: INotification) => void;
}

const NotificationContext = createContext<Partial<INotificationContext>>({});

type NotificationProviderProps = {
  children: ReactNode;
};

export const NotificationProvider = ({
  children,
}: NotificationProviderProps) => {
  const [notifications, setNotifications] = useState<INotification[]>([]);

  const addNotification = (notification: INotification) =>
    setNotifications([...notifications, notification]);
  const removeNotification = (notification: INotification) =>
    setNotifications(notifications.filter((n) => n !== notification));

  useEffect(() => console.log(notifications), [notifications]);

  const value = useMemo(
    () => ({
      notifications,
      addNotification,
      removeNotification,
    }),
    [notifications, addNotification, removeNotification]
  );

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};
const useNotifications = () => useContext(NotificationContext);
export default useNotifications;
