export type NotificationType = 'shift' | 'leave' | 'late' | 'swap';

export interface Notification {
  id:      number;
  type:    NotificationType;
  message: string;
  time:    string;
  read:    boolean;
}