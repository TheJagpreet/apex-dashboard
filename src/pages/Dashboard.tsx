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

const LIME = '#C8E64A';

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: 'easeOut' as const } },
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
      color: LIME,
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
      {/* Greeting Header */}
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h3"
          sx={{
            fontWeight: 700,
            fontSize: { xs: '1.8rem', md: '2.2rem' },
          }}
        >
          Hello, <Box component="span" sx={{ color: LIME }}>Developer</Box>
        </Typography>
        <Typography variant="body1" sx={{ color: 'text.secondary', mt: 0.5 }}>
          Manage your sandbox environments
        </Typography>
      </Box>

      <motion.div variants={containerVariants} initial="hidden" animate="visible">
        {/* Stats Row */}
        <Grid container spacing={2.5} sx={{ mb: 2.5 }}>
          {stats.map((stat) => (
            <Grid size={{ xs: 12, md: 4 }} key={stat.label}>
              <MotionCard
                variants={itemVariants}
                sx={{
                  borderRadius: '24px',
                  background: alpha(stat.color, 0.06),
                  border: `1px solid ${alpha(stat.color, 0.1)}`,
                  '&:hover': {
                    borderColor: alpha(stat.color, 0.2),
                    background: alpha(stat.color, 0.08),
                  },
                }}
              >
                <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2.5, py: 3 }}>
                  <Box
                    sx={{
                      width: 52,
                      height: 52,
                      borderRadius: '16px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      bgcolor: alpha(stat.color, 0.15),
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
                      <Typography
                        variant="h4"
                        sx={{ fontWeight: 700, lineHeight: 1, fontSize: '2rem' }}
                      >
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

        {/* Two-column layout: Health + Quick Actions */}
        <Grid container spacing={2.5} sx={{ mb: 2.5 }}>
          {/* Server Health */}
          <Grid size={{ xs: 12, md: 6 }}>
            <MotionCard variants={itemVariants} sx={{ height: '100%' }}>
              <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2, py: 2.5 }}>
                {healthLoading ? (
                  <Skeleton variant="circular" width={12} height={12} />
                ) : (
                  <Box
                    sx={{
                      width: 40,
                      height: 40,
                      borderRadius: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      bgcolor: healthy
                        ? alpha('#4ADE80', 0.12)
                        : alpha('#EF4444', 0.12),
                    }}
                  >
                    <FiberManualRecord
                      sx={{
                        fontSize: 14,
                        color: healthy ? '#4ADE80' : '#EF4444',
                        animation: 'pulse 2s ease-in-out infinite',
                        '@keyframes pulse': {
                          '0%, 100%': { opacity: 1 },
                          '50%': { opacity: 0.4 },
                        },
                      }}
                    />
                  </Box>
                )}
                <Box>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    {healthLoading ? (
                      <Skeleton width={160} />
                    ) : (
                      <>
                        <Box
                          component="span"
                          sx={{ color: 'text.primary', fontWeight: 600, mr: 1 }}
                        >
                          {health?.service ?? 'API Server'}
                        </Box>
                        {healthy ? 'Connected' : 'Disconnected'}
                      </>
                    )}
                  </Typography>
                </Box>
              </CardContent>
            </MotionCard>
          </Grid>

          {/* Quick Actions */}
          <Grid size={{ xs: 12, md: 6 }}>
            <MotionCard variants={itemVariants} sx={{ height: '100%' }}>
              <CardContent
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2,
                  py: 2.5,
                  flexWrap: 'wrap',
                }}
              >
                <Button
                  variant="contained"
                  startIcon={<AddRounded />}
                  onClick={() => navigate('/create')}
                  sx={{ borderRadius: '14px' }}
                >
                  Create Sandbox
                </Button>
                <Button
                  variant="outlined"
                  endIcon={<ArrowForwardRounded />}
                  onClick={() => navigate('/sandboxes')}
                  sx={{ borderRadius: '14px' }}
                >
                  View All
                </Button>
              </CardContent>
            </MotionCard>
          </Grid>
        </Grid>

        {/* Recent Sandboxes */}
        <MotionCard variants={itemVariants}>
          <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
              Recent Sandboxes
            </Typography>

            {sandboxesLoading ? (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                {[...Array(3)].map((_, i) => (
                  <Skeleton key={i} height={40} sx={{ borderRadius: '10px' }} />
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
              <TableContainer
                sx={{
                  borderRadius: '16px',
                  bgcolor: alpha('#FFFFFF', 0.02),
                }}
              >
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
                        <TableRow
                          key={sb.id}
                          hover
                          onClick={() => navigate(`/sandbox/${sb.id}`)}
                          sx={{ cursor: 'pointer' }}
                        >
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
      </motion.div>
    </Box>
  );
}
