import { useSandboxes, useHealth } from '../hooks/useSandboxes';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Skeleton,
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import {
  DnsRounded,
  PlayArrowRounded,
  StopRounded,
  FiberManualRecord,
  AddRounded,
  ArrowForwardRounded,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const MotionCard = motion(Card);

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

function getStatusColor(status: string) {
  switch (status) {
    case 'running':
      return { bg: alpha('#4ADE80', 0.12), text: '#4ADE80' };
    case 'stopped':
      return { bg: alpha('#EF4444', 0.12), text: '#EF4444' };
    default:
      return { bg: alpha('#9E9E9E', 0.12), text: '#9E9E9E' };
  }
}

export default function Dashboard() {
  const { sandboxes, loading: sandboxesLoading } = useSandboxes();
  const { health, healthy, loading: healthLoading } = useHealth();
  const navigate = useNavigate();

  const runningCount = sandboxes.filter((s) => s.status === 'running').length;
  const stoppedCount = sandboxes.filter((s) => s.status === 'stopped').length;
  const recentSandboxes = sandboxes.slice(0, 5);

  const stats = [
    {
      label: 'Total Sandboxes',
      value: sandboxes.length,
      icon: <DnsRounded />,
      color: '#ECD06F',
    },
    {
      label: 'Running',
      value: runningCount,
      icon: <PlayArrowRounded />,
      color: '#4ADE80',
    },
    {
      label: 'Stopped',
      value: stoppedCount,
      icon: <StopRounded />,
      color: '#EF4444',
    },
  ];

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" sx={{ fontWeight: 700 }}>
          Dashboard
        </Typography>
        <Typography variant="body1" sx={{ color: 'text.secondary', mt: 0.5 }}>
          Manage your sandbox environments
        </Typography>
      </Box>

      <motion.div variants={containerVariants} initial="hidden" animate="visible">
        {/* Stats Row */}
        <Grid container spacing={3} sx={{ mb: 3 }}>
          {stats.map((stat) => (
            <Grid size={{ xs: 12, md: 4 }} key={stat.label}>
              <MotionCard variants={itemVariants}>
                <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2.5, py: 3 }}>
                  <Box
                    sx={{
                      width: 52,
                      height: 52,
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      bgcolor: alpha(stat.color, 0.12),
                      color: stat.color,
                      flexShrink: 0,
                    }}
                  >
                    {stat.icon}
                  </Box>
                  <Box>
                    {sandboxesLoading ? (
                      <Skeleton width={48} height={40} />
                    ) : (
                      <Typography variant="h4" sx={{ fontWeight: 700, lineHeight: 1 }}>
                        {stat.value}
                      </Typography>
                    )}
                    <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
                      {stat.label}
                    </Typography>
                  </Box>
                </CardContent>
              </MotionCard>
            </Grid>
          ))}
        </Grid>

        {/* Server Health */}
        <MotionCard variants={itemVariants} sx={{ mb: 3 }}>
          <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {healthLoading ? (
              <Skeleton variant="circular" width={12} height={12} />
            ) : (
              <FiberManualRecord
                sx={{
                  fontSize: 12,
                  color: healthy ? '#4ADE80' : '#EF4444',
                  animation: 'pulse 2s ease-in-out infinite',
                  '@keyframes pulse': {
                    '0%, 100%': { opacity: 1 },
                    '50%': { opacity: 0.4 },
                  },
                }}
              />
            )}
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              {healthLoading ? (
                <Skeleton width={160} />
              ) : (
                <>
                  <Box component="span" sx={{ color: 'text.primary', fontWeight: 600, mr: 1 }}>
                    {health?.service ?? 'API Server'}
                  </Box>
                  {healthy ? 'Connected' : 'Disconnected'}
                </>
              )}
            </Typography>
          </CardContent>
        </MotionCard>

        {/* Recent Sandboxes */}
        <MotionCard variants={itemVariants} sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
              Recent Sandboxes
            </Typography>

            {sandboxesLoading ? (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                {[...Array(3)].map((_, i) => (
                  <Skeleton key={i} height={40} />
                ))}
              </Box>
            ) : recentSandboxes.length === 0 ? (
              <Box
                sx={{
                  textAlign: 'center',
                  py: 6,
                  color: 'text.secondary',
                }}
              >
                <DnsRounded sx={{ fontSize: 48, mb: 1, opacity: 0.25 }} />
                <Typography variant="body2">
                  No sandboxes yet. Create one to get started.
                </Typography>
              </Box>
            ) : (
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Name</TableCell>
                      <TableCell>Image</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>ID</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {recentSandboxes.map((sb) => {
                      const statusColor = getStatusColor(sb.status);
                      return (
                        <TableRow key={sb.id} hover>
                          <TableCell sx={{ fontWeight: 500 }}>{sb.name}</TableCell>
                          <TableCell sx={{ fontFamily: '"Space Mono", monospace' }}>
                            {sb.image}
                          </TableCell>
                          <TableCell>
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
                          </TableCell>
                          <TableCell sx={{ fontFamily: '"Space Mono", monospace' }}>
                            {sb.id.length > 12 ? `${sb.id.slice(0, 12)}...` : sb.id}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </CardContent>
        </MotionCard>

        {/* Quick Actions */}
        <MotionCard variants={itemVariants}>
          <CardContent>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
              Quick Actions
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <Button
                variant="contained"
                startIcon={<AddRounded />}
                onClick={() => navigate('/create')}
              >
                Create Sandbox
              </Button>
              <Button
                variant="outlined"
                endIcon={<ArrowForwardRounded />}
                onClick={() => navigate('/sandboxes')}
              >
                View All
              </Button>
            </Box>
          </CardContent>
        </MotionCard>
      </motion.div>
    </Box>
  );
}
