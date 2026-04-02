import { useState, useCallback, type ReactNode } from 'react';
import { Box, Typography, IconButton } from '@mui/material';
import { alpha } from '@mui/material/styles';
import { CloseRounded, ErrorOutlineRounded, WarningAmberRounded } from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { ToastContext } from './toastContextDef';

interface Toast {
  id: number;
  message: string;
  type: 'error' | 'warning';
  flashing?: boolean;
}

let nextId = 0;

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [serverDownId, setServerDownId] = useState<number | null>(null);

  const removeToast = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showError = useCallback((message: string) => {
    const id = ++nextId;
    setToasts((prev) => [...prev, { id, message, type: 'error' }]);
    globalThis.setTimeout(() => removeToast(id), 5000);
  }, [removeToast]);

  const showServerDown = useCallback(() => {
    if (serverDownId !== null) return;
    const id = ++nextId;
    setServerDownId(id);
    setToasts((prev) => [
      ...prev,
      { id, message: 'Backend server is unreachable', type: 'error', flashing: true },
    ]);
  }, [serverDownId]);

  const clearServerDown = useCallback(() => {
    if (serverDownId !== null) {
      removeToast(serverDownId);
      setServerDownId(null);
    }
  }, [serverDownId, removeToast]);

  return (
    <ToastContext.Provider value={{ showError, showServerDown, clearServerDown }}>
      {children}
      {/* Toast container */}
      <Box
        sx={{
          position: 'fixed',
          top: 80,
          right: 24,
          zIndex: 9999,
          display: 'flex',
          flexDirection: 'column',
          gap: 1.5,
          maxWidth: 420,
          pointerEvents: 'none',
        }}
      >
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, x: 80, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 80, scale: 0.9 }}
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              style={{ pointerEvents: 'auto' }}
            >
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.5,
                  px: 2.5,
                  py: 1.5,
                  borderRadius: '16px',
                  bgcolor: alpha('#EF4444', 0.15),
                  border: `1px solid ${alpha('#EF4444', 0.3)}`,
                  backdropFilter: 'blur(20px)',
                  ...(toast.flashing && {
                    animation: 'toastPulse 2s ease-in-out infinite',
                    '@keyframes toastPulse': {
                      '0%, 100%': {
                        bgcolor: alpha('#EF4444', 0.15),
                        borderColor: alpha('#EF4444', 0.3),
                        boxShadow: `0 0 0px ${alpha('#EF4444', 0)}`,
                      },
                      '50%': {
                        bgcolor: alpha('#EF4444', 0.25),
                        borderColor: alpha('#EF4444', 0.6),
                        boxShadow: `0 0 20px ${alpha('#EF4444', 0.2)}`,
                      },
                    },
                  }),
                }}
              >
                {toast.flashing ? (
                  <WarningAmberRounded sx={{ color: '#EF4444', fontSize: 22, flexShrink: 0 }} />
                ) : (
                  <ErrorOutlineRounded sx={{ color: '#EF4444', fontSize: 22, flexShrink: 0 }} />
                )}
                <Typography
                  sx={{
                    fontSize: '0.85rem',
                    fontWeight: 500,
                    color: '#FFFFFF',
                    flex: 1,
                  }}
                >
                  {toast.message}
                </Typography>
                {!toast.flashing && (
                  <IconButton
                    size="small"
                    onClick={() => removeToast(toast.id)}
                    sx={{
                      color: alpha('#FFFFFF', 0.5),
                      '&:hover': { color: '#FFFFFF', bgcolor: alpha('#FFFFFF', 0.1) },
                      p: 0.5,
                    }}
                  >
                    <CloseRounded sx={{ fontSize: 18 }} />
                  </IconButton>
                )}
              </Box>
            </motion.div>
          ))}
        </AnimatePresence>
      </Box>
    </ToastContext.Provider>
  );
}
