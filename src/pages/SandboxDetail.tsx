import { useState, useRef, useEffect, useCallback } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  TextField,
  Button,
  IconButton,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  CircularProgress,
  Divider,
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import {
  ArrowBackRounded,
  SendRounded,
  FiberManualRecord,
  ContentCopyRounded,
  DeleteForeverRounded,
  TerminalRounded,
  FileCopyRounded,
} from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useSandboxStatus } from '../hooks/useSandboxes';
import {
  execCommand,
  copyToSandbox,
  copyFromSandbox,
  destroySandbox,
} from '../api/client';
import { useToast } from '../hooks/useToast';

const MotionCard = motion(Card);

const LIME = '#C8E64A';
const RED = '#EF4444';

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08 },
  },
} as const;

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' as const } },
};

function getStatusColor(status: string) {
  switch (status) {
    case 'running':
      return { bg: alpha('#4ADE80', 0.12), text: '#4ADE80', dot: '#4ADE80' };
    case 'stopped':
      return { bg: alpha(RED, 0.12), text: RED, dot: RED };
    default:
      return { bg: alpha('#9E9E9E', 0.12), text: '#9E9E9E', dot: '#9E9E9E' };
  }
}

interface TerminalEntry {
  command: string;
  stdout: string;
  stderr: string;
  exitCode: number;
}

const monoFont = '"Space Mono", monospace';

const fieldSx = {
  '& .MuiOutlinedInput-root': {
    fontFamily: monoFont,
    fontSize: '0.875rem',
  },
};

const sectionLabelSx = {
  color: LIME,
  fontWeight: 700,
  mb: 1.5,
  textTransform: 'uppercase' as const,
  letterSpacing: '0.08em',
};

export default function SandboxDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { status, loading: statusLoading } = useSandboxStatus(id);
  const { showError } = useToast();

  // Terminal state
  const [commandInput, setCommandInput] = useState('');
  const [terminalHistory, setTerminalHistory] = useState<TerminalEntry[]>([]);
  const [execLoading, setExecLoading] = useState(false);
  const outputRef = useRef<HTMLDivElement>(null);

  // File operations state
  const [copyToHostPath, setCopyToHostPath] = useState('');
  const [copyToContainerPath, setCopyToContainerPath] = useState('');
  const [copyFromContainerPath, setCopyFromContainerPath] = useState('');
  const [copyFromHostPath, setCopyFromHostPath] = useState('');
  const [copyLoading, setCopyLoading] = useState(false);

  // Destroy state
  const [destroyDialogOpen, setDestroyDialogOpen] = useState(false);
  const [destroying, setDestroying] = useState(false);

  // Auto-scroll terminal output
  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [terminalHistory]);

  const handleExecCommand = useCallback(async () => {
    const trimmed = commandInput.trim();
    if (!trimmed || !id) return;

    setExecLoading(true);
    try {
      const result = await execCommand(id, { command: trimmed });
      setTerminalHistory((prev) => [
        ...prev,
        {
          command: trimmed,
          stdout: result.stdout,
          stderr: result.stderr,
          exitCode: result.exit_code,
        },
      ]);
      setCommandInput('');
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'Failed to execute command';
      setTerminalHistory((prev) => [
        ...prev,
        {
          command: trimmed,
          stdout: '',
          stderr: message,
          exitCode: -1,
        },
      ]);
      setCommandInput('');
      showError(message);
    } finally {
      setExecLoading(false);
    }
  }, [commandInput, id, showError]);

  const handleCopyTo = useCallback(async () => {
    if (!id || !copyToHostPath.trim() || !copyToContainerPath.trim()) return;
    setCopyLoading(true);
    try {
      await copyToSandbox(id, {
        host_path: copyToHostPath.trim(),
        container_path: copyToContainerPath.trim(),
      });
      setCopyToHostPath('');
      setCopyToContainerPath('');
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'Failed to copy to sandbox';
      showError(message);
    } finally {
      setCopyLoading(false);
    }
  }, [id, copyToHostPath, copyToContainerPath, showError]);

  const handleCopyFrom = useCallback(async () => {
    if (!id || !copyFromContainerPath.trim() || !copyFromHostPath.trim()) return;
    setCopyLoading(true);
    try {
      await copyFromSandbox(id, {
        container_path: copyFromContainerPath.trim(),
        host_path: copyFromHostPath.trim(),
      });
      setCopyFromContainerPath('');
      setCopyFromHostPath('');
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'Failed to copy from sandbox';
      showError(message);
    } finally {
      setCopyLoading(false);
    }
  }, [id, copyFromContainerPath, copyFromHostPath, showError]);

  const handleDestroy = useCallback(async () => {
    if (!id) return;
    setDestroying(true);
    try {
      await destroySandbox(id);
      navigate('/sandboxes');
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'Failed to destroy sandbox';
      showError(message);
      setDestroying(false);
      setDestroyDialogOpen(false);
    }
  }, [id, navigate, showError]);

  const statusColor = getStatusColor(status ?? 'unknown');

  return (
    <Box>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' as const }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            mb: 4,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, minWidth: 0 }}>
            <IconButton
              onClick={() => navigate('/sandboxes')}
              sx={{
                color: 'text.secondary',
                '&:hover': { color: 'text.primary', bgcolor: alpha('#FFFFFF', 0.06) },
              }}
            >
              <ArrowBackRounded />
            </IconButton>
            <Box sx={{ minWidth: 0 }}>
              <Typography
                variant="h3"
                sx={{ fontWeight: 700, fontSize: { xs: '1.8rem', md: '2.2rem' } }}
              >
                Sandbox
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  fontFamily: monoFont,
                  color: alpha('#9E9E9E', 0.7),
                  mt: 0.25,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {id}
              </Typography>
            </Box>
          </Box>
          {statusLoading ? (
            <CircularProgress size={20} sx={{ color: LIME }} />
          ) : (
            <Chip
              label={status ?? 'unknown'}
              size="small"
              icon={
                <FiberManualRecord
                  sx={{
                    fontSize: '10px !important',
                    color: `${statusColor.dot} !important`,
                    animation:
                      status === 'running'
                        ? 'pulse 2s ease-in-out infinite'
                        : undefined,
                    '@keyframes pulse': {
                      '0%, 100%': { opacity: 1 },
                      '50%': { opacity: 0.4 },
                    },
                  }}
                />
              }
              sx={{
                bgcolor: statusColor.bg,
                color: statusColor.text,
                fontWeight: 600,
                textTransform: 'capitalize',
                border: 'none',
                borderRadius: '10px',
                flexShrink: 0,
              }}
            />
          )}
        </Box>
      </motion.div>

      <motion.div variants={containerVariants} initial="hidden" animate="visible">
        {/* Info Card */}
        <MotionCard variants={itemVariants} sx={{ mb: 2.5 }}>
          <CardContent sx={{ p: { xs: 3, md: 4 } }}>
            <Typography variant="subtitle2" sx={sectionLabelSx}>
              Sandbox Info
            </Typography>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {/* Status */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Typography variant="body2" sx={{ color: 'text.secondary', minWidth: 90 }}>
                  Status
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <FiberManualRecord sx={{ fontSize: 10, color: statusColor.dot }} />
                  <Typography variant="body2" sx={{ fontWeight: 600, textTransform: 'capitalize' }}>
                    {statusLoading ? '…' : (status ?? 'unknown')}
                  </Typography>
                </Box>
              </Box>

              {/* Sandbox ID */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Typography variant="body2" sx={{ color: 'text.secondary', minWidth: 90 }}>
                  Sandbox ID
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    fontFamily: monoFont,
                    fontSize: '0.8rem',
                    color: 'text.primary',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {id}
                </Typography>
              </Box>

              {/* Name */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Typography variant="body2" sx={{ color: 'text.secondary', minWidth: 90 }}>
                  Name
                </Typography>
                <Typography variant="body2" sx={{ color: alpha('#9E9E9E', 0.6), fontStyle: 'italic' }}>
                  —
                </Typography>
              </Box>

              {/* Image */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Typography variant="body2" sx={{ color: 'text.secondary', minWidth: 90 }}>
                  Image
                </Typography>
                <Typography variant="body2" sx={{ fontFamily: monoFont, fontSize: '0.8rem', color: 'text.primary' }}>
                  —
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </MotionCard>

        {/* Terminal Card */}
        <MotionCard
          variants={itemVariants}
          sx={{
            mb: 2.5,
            bgcolor: '#1E1E1E',
            border: '1px solid',
            borderColor: alpha('#FFFFFF', 0.08),
          }}
        >
          <CardContent sx={{ p: { xs: 2, md: 3 } }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <TerminalRounded sx={{ color: LIME, fontSize: 20 }} />
              <Typography variant="subtitle2" sx={{ ...sectionLabelSx, mb: 0 }}>
                Terminal
              </Typography>
            </Box>

            {/* Output area */}
            <Box
              ref={outputRef}
              sx={{
                minHeight: 300,
                maxHeight: 500,
                overflowY: 'auto',
                bgcolor: '#141414',
                borderRadius: '16px',
                p: 2,
                mb: 2,
                fontFamily: monoFont,
                fontSize: '0.8rem',
                lineHeight: 1.7,
                border: '1px solid',
                borderColor: alpha('#FFFFFF', 0.06),
                '&::-webkit-scrollbar': { width: 6 },
                '&::-webkit-scrollbar-track': { bgcolor: 'transparent' },
                '&::-webkit-scrollbar-thumb': {
                  bgcolor: alpha('#FFFFFF', 0.1),
                  borderRadius: 3,
                },
              }}
            >
              {terminalHistory.length === 0 ? (
                <Typography
                  sx={{
                    fontFamily: monoFont,
                    fontSize: '0.8rem',
                    color: alpha('#9E9E9E', 0.5),
                    fontStyle: 'italic',
                  }}
                >
                  No commands executed yet
                </Typography>
              ) : (
                terminalHistory.map((entry, idx) => (
                  <Box key={idx} sx={{ mb: 2, '&:last-child': { mb: 0 } }}>
                    {/* Command */}
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Typography
                        component="span"
                        sx={{ fontFamily: monoFont, fontSize: '0.8rem', color: LIME, whiteSpace: 'pre-wrap' }}
                      >
                        $
                      </Typography>
                      <Typography
                        component="span"
                        sx={{ fontFamily: monoFont, fontSize: '0.8rem', color: LIME, whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}
                      >
                        {entry.command}
                      </Typography>
                    </Box>
                    {/* Stdout */}
                    {entry.stdout && (
                      <Typography
                        sx={{
                          fontFamily: monoFont,
                          fontSize: '0.8rem',
                          color: '#FFFFFF',
                          whiteSpace: 'pre-wrap',
                          wordBreak: 'break-all',
                          pl: 2,
                        }}
                      >
                        {entry.stdout}
                      </Typography>
                    )}
                    {/* Stderr */}
                    {entry.stderr && (
                      <Typography
                        sx={{
                          fontFamily: monoFont,
                          fontSize: '0.8rem',
                          color: RED,
                          whiteSpace: 'pre-wrap',
                          wordBreak: 'break-all',
                          pl: 2,
                        }}
                      >
                        {entry.stderr}
                      </Typography>
                    )}
                    {/* Exit code */}
                    <Typography
                      sx={{
                        fontFamily: monoFont,
                        fontSize: '0.7rem',
                        color: entry.exitCode === 0 ? alpha('#4ADE80', 0.6) : alpha(RED, 0.7),
                        pl: 2,
                        mt: 0.5,
                      }}
                    >
                      exit code: {entry.exitCode}
                    </Typography>
                  </Box>
                ))
              )}
              {execLoading && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                  <CircularProgress size={14} sx={{ color: LIME }} />
                  <Typography
                    sx={{
                      fontFamily: monoFont,
                      fontSize: '0.75rem',
                      color: alpha('#FFFFFF', 0.5),
                    }}
                  >
                    Executing…
                  </Typography>
                </Box>
              )}
            </Box>

            {/* Command input */}
            <Box sx={{ display: 'flex', gap: 1 }}>
              <TextField
                fullWidth
                size="small"
                placeholder="Enter command..."
                value={commandInput}
                onChange={(e) => setCommandInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleExecCommand();
                  }
                }}
                disabled={execLoading}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    fontFamily: monoFont,
                    fontSize: '0.875rem',
                    bgcolor: '#141414',
                  },
                }}
              />
              <Button
                variant="contained"
                onClick={handleExecCommand}
                disabled={execLoading || !commandInput.trim()}
                sx={{
                  minWidth: 48,
                  borderRadius: '14px',
                  bgcolor: LIME,
                  color: '#000',
                  '&:hover': { bgcolor: alpha(LIME, 0.85) },
                  '&.Mui-disabled': { bgcolor: alpha(LIME, 0.2), color: alpha('#000', 0.4) },
                }}
              >
                <SendRounded sx={{ fontSize: 18 }} />
              </Button>
            </Box>
          </CardContent>
        </MotionCard>

        {/* File Operations Card */}
        <MotionCard variants={itemVariants} sx={{ mb: 2.5 }}>
          <CardContent sx={{ p: { xs: 3, md: 4 } }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
              <FileCopyRounded sx={{ color: LIME, fontSize: 20 }} />
              <Typography variant="subtitle2" sx={{ ...sectionLabelSx, mb: 0 }}>
                File Operations
              </Typography>
            </Box>

            {/* Copy To Sandbox */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="body2" sx={{ fontWeight: 600, mb: 1.5, display: 'flex', alignItems: 'center', gap: 1 }}>
                <ContentCopyRounded sx={{ fontSize: 16, color: 'text.secondary' }} />
                Copy To Sandbox
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'flex-end' }}>
                <TextField
                  label="Host Path"
                  size="small"
                  value={copyToHostPath}
                  onChange={(e) => setCopyToHostPath(e.target.value)}
                  placeholder="/local/path/file.txt"
                  sx={{ ...fieldSx, flex: 1, minWidth: 200 }}
                />
                <TextField
                  label="Container Path"
                  size="small"
                  value={copyToContainerPath}
                  onChange={(e) => setCopyToContainerPath(e.target.value)}
                  placeholder="/container/path/"
                  sx={{ ...fieldSx, flex: 1, minWidth: 200 }}
                />
                <Button
                  variant="outlined"
                  onClick={handleCopyTo}
                  disabled={copyLoading || !copyToHostPath.trim() || !copyToContainerPath.trim()}
                  startIcon={copyLoading ? <CircularProgress size={16} /> : <ContentCopyRounded />}
                  sx={{ flexShrink: 0, height: 40, borderRadius: '12px' }}
                >
                  Copy
                </Button>
              </Box>
            </Box>

            <Divider sx={{ my: 3 }} />

            {/* Copy From Sandbox */}
            <Box>
              <Typography variant="body2" sx={{ fontWeight: 600, mb: 1.5, display: 'flex', alignItems: 'center', gap: 1 }}>
                <ContentCopyRounded sx={{ fontSize: 16, color: 'text.secondary' }} />
                Copy From Sandbox
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'flex-end' }}>
                <TextField
                  label="Container Path"
                  size="small"
                  value={copyFromContainerPath}
                  onChange={(e) => setCopyFromContainerPath(e.target.value)}
                  placeholder="/container/path/file.txt"
                  sx={{ ...fieldSx, flex: 1, minWidth: 200 }}
                />
                <TextField
                  label="Host Path"
                  size="small"
                  value={copyFromHostPath}
                  onChange={(e) => setCopyFromHostPath(e.target.value)}
                  placeholder="/local/path/"
                  sx={{ ...fieldSx, flex: 1, minWidth: 200 }}
                />
                <Button
                  variant="outlined"
                  onClick={handleCopyFrom}
                  disabled={copyLoading || !copyFromContainerPath.trim() || !copyFromHostPath.trim()}
                  startIcon={copyLoading ? <CircularProgress size={16} /> : <ContentCopyRounded />}
                  sx={{ flexShrink: 0, height: 40, borderRadius: '12px' }}
                >
                  Copy
                </Button>
              </Box>
            </Box>
          </CardContent>
        </MotionCard>

        {/* Danger Zone Card */}
        <MotionCard
          variants={itemVariants}
          sx={{
            mb: 2.5,
            border: '1px solid',
            borderColor: alpha(RED, 0.3),
          }}
        >
          <CardContent sx={{ p: { xs: 3, md: 4 } }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <DeleteForeverRounded sx={{ color: RED, fontSize: 20 }} />
              <Typography variant="subtitle2" sx={{ color: RED, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                Danger Zone
              </Typography>
            </Box>

            <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5 }}>
              Destroy Sandbox
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3 }}>
              This action is irreversible. The sandbox and all its data will be permanently deleted.
            </Typography>

            <Button
              variant="contained"
              onClick={() => setDestroyDialogOpen(true)}
              startIcon={<DeleteForeverRounded />}
              sx={{
                bgcolor: RED,
                color: '#fff',
                borderRadius: '14px',
                '&:hover': { bgcolor: '#DC2626' },
              }}
            >
              Destroy
            </Button>
          </CardContent>
        </MotionCard>
      </motion.div>

      {/* Destroy Confirmation Dialog */}
      <Dialog
        open={destroyDialogOpen}
        onClose={() => !destroying && setDestroyDialogOpen(false)}
      >
        <DialogTitle sx={{ fontWeight: 700 }}>Destroy Sandbox</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to destroy sandbox{' '}
            <Box
              component="span"
              sx={{ fontFamily: monoFont, fontWeight: 600, color: 'text.primary' }}
            >
              {id}
            </Box>
            ? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            onClick={() => setDestroyDialogOpen(false)}
            disabled={destroying}
            sx={{ borderRadius: '12px' }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleDestroy}
            disabled={destroying}
            startIcon={destroying ? <CircularProgress size={16} sx={{ color: '#fff' }} /> : undefined}
            sx={{
              bgcolor: RED,
              color: '#fff',
              borderRadius: '12px',
              '&:hover': { bgcolor: '#DC2626' },
            }}
          >
            {destroying ? 'Destroying…' : 'Destroy'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
