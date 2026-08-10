export interface ConfirmationDialogData {
  title: string;
  message: string;

  confirmText?: string;
  cancelText?: string;

  confirmIcon?: string;

  type?: 'default' | 'danger';
}
