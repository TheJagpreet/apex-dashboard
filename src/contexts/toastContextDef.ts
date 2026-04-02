import { createContext } from 'react';

export interface ToastContextValue {
  showError: (message: string) => void;
  showServerDown: () => void;
  clearServerDown: () => void;
}

export const ToastContext = createContext<ToastContextValue | null>(null);
