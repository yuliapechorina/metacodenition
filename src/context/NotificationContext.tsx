import {
  createContext,
  ReactNode,
  useContext,
  useMemo,
  useRef,
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
  const notificationCallbacksRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  const removeNotification = (notification: INotification) =>
    setNotifications(notifications.filter((n) => n !== notification));

  const addNotification = (notification: INotification) => {
    notificationCallbacksRef.current.push(
      setTimeout(() => {
        removeNotification(notification);
      }, 5000)
    );
    setNotifications([...notifications, notification]);
  };

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
