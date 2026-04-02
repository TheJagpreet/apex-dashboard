import { useState, useCallback } from 'react';
import { useSandboxes } from '../hooks/useSandboxes';
import { destroySandbox } from '../api/client';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Chip,
  Button,
  TextField,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Skeleton,
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import {
  SearchRounded,
  AddRounded,
  TerminalRounded,
  DeleteOutlineRounded,
  FiberManualRecord,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const MotionCard = motion(Card);

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08 },
  },
} as const;

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' as const } },
  exit: { opacity: 0, scale: 0.95, transition: { duration: 0.2 } },
};

type StatusFilter = 'all' | 'running' | 'stopped';

function getStatusColor(status: string) {
  switch (status) {
    case 'running':
      return { bg: alpha('#4ADE80', 0.12), text: '#4ADE80', dot: '#4ADE80' };
    case 'stopped':
      return { bg: alpha('#EF4444', 0.12), text: '#EF4444', dot: '#EF4444' };
    default:
      return { bg: alpha('#9E9E9E', 0.12), text: '#9E9E9E', dot: '#9E9E9E' };
  }
}

const GOLD = '#ECD06F';

export default function Sandboxes() {
  const { sandboxes, loading, refetch } = useSandboxes();
  const navigate = useNavigate();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [destroyTarget, setDestroyTarget] = useState<{ id: string; name: string } | null>(null);
  const [destroying, setDestroying] = useState(false);

  const filtered = sandboxes.filter((sb) => {
    if (statusFilter !== 'all' && sb.status !== statusFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        sb.name?.toLowerCase().includes(q) ||
        sb.image?.toLowerCase().includes(q) ||
        sb.id.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleDestroy = useCallback(async () => {
    if (!destroyTarget) return;
    setDestroying(true);
    try {
      await destroySandbox(destroyTarget.id);
      await refetch();
    } finally {
      setDestroying(false);
      setDestroyTarget(null);
    }
  }, [destroyTarget, refetch]);

  const statusFilters: { label: string; value: StatusFilter }[] = [
    { label: 'All', value: 'all' },
    { label: 'Running', value: 'running' },
    { label: 'Stopped', value: 'stopped' },
  ];

  return (
    <Box>
      {/* Header */}
      <Box
        sx={{
          display: 'flex',
          alignItems: { xs: 'flex-start', sm: 'center' },
          justifyContent: 'space-between',
          flexDirection: { xs: 'column', sm: 'row' },
          gap: 2,
          mb: 4,
        }}
      >
        <Box>
          <Typography variant="h3" sx={{ fontWeight: 700 }}>
            Sandboxes
          </Typography>
          <Typography variant="body1" sx={{ color: 'text.secondary', mt: 0.5 }}>
            All sandbox environments
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddRounded />}
          onClick={() => navigate('/create')}
          sx={{ flexShrink: 0 }}
        >
          Create Sandbox
        </Button>
      </Box>

      {/* Search & Filter */}
      <Box
        sx={{
          display: 'flex',
          alignItems: { xs: 'stretch', sm: 'center' },
          flexDirection: { xs: 'column', sm: 'row' },
          gap: 2,
          mb: 3,
        }}
      >
        <TextField
          placeholder="Filter by name, image, or ID…"
          size="small"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchRounded sx={{ color: 'text.secondary', fontSize: 20 }} />
                </InputAdornment>
              ),
            },
          }}
          sx={{ minWidth: 280, flexGrow: 1, maxWidth: { sm: 400 } }}
        />
        <Box sx={{ display: 'flex', gap: 1 }}>
          {statusFilters.map((f) => (
            <Chip
              key={f.value}
              label={f.label}
              clickable
              onClick={() => setStatusFilter(f.value)}
              sx={{
                fontWeight: 600,
                bgcolor:
                  statusFilter === f.value ? alpha(GOLD, 0.15) : alpha('#FFFFFF', 0.04),
                color: statusFilter === f.value ? GOLD : 'text.secondary',
                border: '1px solid',
                borderColor:
                  statusFilter === f.value ? alpha(GOLD, 0.3) : alpha('#FFFFFF', 0.08),
                '&:hover': {
                  bgcolor:
                    statusFilter === f.value ? alpha(GOLD, 0.2) : alpha('#FFFFFF', 0.08),
                },
              }}
            />
          ))}
        </Box>
      </Box>

      {/* Content */}
      {loading ? (
        // Loading skeletons
        <Grid container spacing={3}>
          {[...Array(6)].map((_, i) => (
            <Grid size={{ xs: 12, sm: 6, lg: 4 }} key={i}>
              <Card>
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Skeleton width={140} height={24} />
                    <Skeleton variant="circular" width={12} height={12} />
                  </Box>
                  <Skeleton width="80%" height={20} sx={{ mb: 1 }} />
                  <Skeleton width={100} height={18} sx={{ mb: 2 }} />
                  <Skeleton width={70} height={28} sx={{ mb: 2 }} />
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Skeleton width={90} height={36} />
                    <Skeleton width={80} height={36} />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : filtered.length === 0 ? (
        // Empty state
        <Box
          sx={{
            textAlign: 'center',
            py: 10,
          }}
        >
          <Box
            sx={{
              width: 64,
              height: 64,
              borderRadius: '50%',
              bgcolor: alpha(GOLD, 0.08),
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mx: 'auto',
              mb: 2,
            }}
          >
            <TerminalRounded sx={{ fontSize: 32, color: alpha(GOLD, 0.4) }} />
          </Box>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
            {search || statusFilter !== 'all'
              ? 'No sandboxes match your filters'
              : 'No sandboxes yet'}
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3 }}>
            {search || statusFilter !== 'all'
              ? 'Try adjusting your search or filter criteria.'
              : 'Create your first sandbox to get started.'}
          </Typography>
          {!search && statusFilter === 'all' && (
            <Button
              variant="contained"
              startIcon={<AddRounded />}
              onClick={() => navigate('/create')}
            >
              Create Sandbox
            </Button>
          )}
        </Box>
      ) : (
        // Sandbox cards grid
        <motion.div variants={containerVariants} initial="hidden" animate="visible">
          <Grid container spacing={3}>
            <AnimatePresence mode="popLayout">
              {filtered.map((sb) => {
                const statusColor = getStatusColor(sb.status);
                return (
                  <Grid size={{ xs: 12, sm: 6, lg: 4 }} key={sb.id}>
                    <MotionCard
                      variants={itemVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      layout
                      sx={{
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        '&:hover': {
                          borderColor: alpha(GOLD, 0.2),
                          boxShadow: `0 0 30px ${alpha(GOLD, 0.05)}`,
                        },
                      }}
                    >
                      <CardContent
                        sx={{
                          p: 3,
                          display: 'flex',
                          flexDirection: 'column',
                          flexGrow: 1,
                        }}
                      >
                        {/* Status dot + Name */}
                        <Box
                          sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'flex-start',
                            mb: 1.5,
                          }}
                        >
                          <Typography
                            variant="h6"
                            sx={{
                              fontWeight: 700,
                              fontSize: '1rem',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                              maxWidth: 'calc(100% - 24px)',
                            }}
                          >
                            {sb.name || 'Unnamed'}
                          </Typography>
                          <FiberManualRecord
                            sx={{
                              fontSize: 10,
                              color: statusColor.dot,
                              mt: 0.7,
                              flexShrink: 0,
                              animation:
                                sb.status === 'running'
                                  ? 'pulse 2s ease-in-out infinite'
                                  : undefined,
                              '@keyframes pulse': {
                                '0%, 100%': { opacity: 1 },
                                '50%': { opacity: 0.4 },
                              },
                            }}
                          />
                        </Box>

                        {/* Image */}
                        <Typography
                          variant="body2"
                          sx={{
                            fontFamily: '"Space Mono", monospace',
                            fontSize: '0.8rem',
                            color: 'text.secondary',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                            mb: 0.5,
                          }}
                        >
                          {sb.image}
                        </Typography>

                        {/* ID */}
                        <Typography
                          variant="caption"
                          sx={{
                            fontFamily: '"Space Mono", monospace',
                            color: alpha('#9E9E9E', 0.6),
                            mb: 2,
                          }}
                        >
                          {sb.id.length > 12 ? sb.id.slice(0, 12) : sb.id}
                        </Typography>

                        {/* Status chip */}
                        <Box sx={{ mb: 2 }}>
                          <Chip
                            label={sb.status}
                            size="small"
                            sx={{
                              bgcolor: statusColor.bg,
                              color: statusColor.text,
                              fontWeight: 600,
                              textTransform: 'capitalize',
                              border: 'none',
                            }}
                          />
                        </Box>

                        {/* Spacer */}
                        <Box sx={{ flexGrow: 1 }} />

                        {/* Actions */}
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <Button
                            variant="outlined"
                            size="small"
                            startIcon={<TerminalRounded />}
                            onClick={() => navigate(`/sandbox/${sb.id}`)}
                            sx={{ fontSize: '0.8rem' }}
                          >
                            Terminal
                          </Button>
                          <Button
                            size="small"
                            startIcon={<DeleteOutlineRounded />}
                            onClick={() =>
                              setDestroyTarget({ id: sb.id, name: sb.name || 'Unnamed' })
                            }
                            sx={{
                              color: '#EF4444',
                              fontSize: '0.8rem',
                              '&:hover': {
                                bgcolor: alpha('#EF4444', 0.08),
                              },
                            }}
                          >
                            Destroy
                          </Button>
                        </Box>
                      </CardContent>
                    </MotionCard>
                  </Grid>
                );
              })}
            </AnimatePresence>
          </Grid>
        </motion.div>
      )}

      {/* Destroy Confirmation Dialog */}
      <Dialog
        open={!!destroyTarget}
        onClose={() => !destroying && setDestroyTarget(null)}
      >
        <DialogTitle sx={{ fontWeight: 700 }}>Destroy Sandbox</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to destroy{' '}
            <Box
              component="span"
              sx={{ fontWeight: 600, color: 'text.primary' }}
            >
              {destroyTarget?.name}
            </Box>
            ? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            onClick={() => setDestroyTarget(null)}
            disabled={destroying}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleDestroy}
            disabled={destroying}
            sx={{
              bgcolor: '#EF4444',
              color: '#fff',
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
