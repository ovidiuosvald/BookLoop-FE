export type NotificationType = 'success' | 'error' | 'info' | 'warning';

export interface NotificationData {
  message: string;
  type: NotificationType;
}
