import type { ReactNode } from 'react';
import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Box, Typography, IconButton, InputBase } from '@mui/material';
import { alpha } from '@mui/material/styles';
import {
  DashboardRounded,
  DnsRounded,
  AddCircleRounded,
  SearchRounded,
  NotificationsNoneRounded,
  FiberManualRecord,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useHealth } from '../../hooks/useSandboxes';
import { useToast } from '../../hooks/useToast';

const LIME = '#C8E64A';
const NAV_BG = '#242424';
const NAV_BORDER = '#2E2E2E';

interface NavItem {
  label: string;
  icon: ReactNode;
  path: string;
}

const navItems: NavItem[] = [
  { label: 'Dashboard', icon: <DashboardRounded sx={{ fontSize: 18 }} />, path: '/' },
  { label: 'Sandboxes', icon: <DnsRounded sx={{ fontSize: 18 }} />, path: '/sandboxes' },
  { label: 'Create New', icon: <AddCircleRounded sx={{ fontSize: 18 }} />, path: '/create' },
];

interface AppLayoutProps {
  children: ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { healthy, loading: healthLoading } = useHealth();
  const { showServerDown, clearServerDown } = useToast();

  useEffect(() => {
    if (healthLoading) return;
    if (!healthy) {
      showServerDown();
    } else {
      clearServerDown();
    }
  }, [healthy, healthLoading, showServerDown, clearServerDown]);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* Top Navigation Bar */}
      <Box
        component="nav"
        sx={{
          position: 'sticky',
          top: 0,
          zIndex: 1200,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          px: { xs: 2, sm: 3, md: 4 },
          py: 1.5,
          bgcolor: alpha(NAV_BG, 0.8),
          backdropFilter: 'blur(20px)',
          borderBottom: `1px solid ${NAV_BORDER}`,
        }}
      >
        {/* Left: Logo */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
            cursor: 'pointer',
            flexShrink: 0,
          }}
          onClick={() => navigate('/')}
        >
          <Box
            sx={{
              color: LIME,
              fontSize: 20,
              display: 'flex',
              alignItems: 'center',
            }}
          >
            ◆
          </Box>
          <Typography
            sx={{
              fontWeight: 800,
              fontSize: '1.1rem',
              color: '#FFFFFF',
              letterSpacing: '0.06em',
              lineHeight: 1,
            }}
          >
            Apex
          </Typography>
        </Box>

        {/* Center: Pill Navigation */}
        <Box
          sx={{
            display: { xs: 'none', sm: 'flex' },
            alignItems: 'center',
            gap: 0.5,
            bgcolor: alpha('#FFFFFF', 0.05),
            borderRadius: '16px',
            p: 0.5,
            border: `1px solid ${alpha('#FFFFFF', 0.06)}`,
          }}
        >
          {navItems.map((item) => {
            const active = location.pathname === item.path;
            return (
              <motion.div
                key={item.path}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Box
                  onClick={() => navigate(item.path)}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 0.75,
                    px: 2,
                    py: 0.8,
                    borderRadius: '12px',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    bgcolor: active ? alpha('#FFFFFF', 0.1) : 'transparent',
                    color: active ? '#FFFFFF' : alpha('#FFFFFF', 0.5),
                    '&:hover': {
                      bgcolor: active ? alpha('#FFFFFF', 0.12) : alpha('#FFFFFF', 0.05),
                      color: active ? '#FFFFFF' : alpha('#FFFFFF', 0.7),
                    },
                  }}
                >
                  {item.icon}
                  <Typography
                    sx={{
                      fontSize: '0.82rem',
                      fontWeight: active ? 600 : 500,
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {item.label}
                  </Typography>
                </Box>
              </motion.div>
            );
          })}
        </Box>

        {/* Right: Search + Status + Notifications */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          {/* Search */}
          <Box
            sx={{
              display: { xs: 'none', md: 'flex' },
              alignItems: 'center',
              gap: 1,
              bgcolor: alpha('#FFFFFF', 0.05),
              borderRadius: '12px',
              px: 1.5,
              py: 0.5,
              border: `1px solid ${alpha('#FFFFFF', 0.06)}`,
              minWidth: 160,
            }}
          >
            <SearchRounded sx={{ color: alpha('#FFFFFF', 0.4), fontSize: 18 }} />
            <InputBase
              placeholder="Search…"
              sx={{
                fontSize: '0.82rem',
                color: '#FFFFFF',
                '& input::placeholder': {
                  color: alpha('#FFFFFF', 0.4),
                  opacity: 1,
                },
              }}
            />
          </Box>

          {/* Server Health */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 0.75,
              px: 1.5,
              py: 0.6,
              borderRadius: '10px',
              bgcolor: alpha('#FFFFFF', 0.04),
            }}
          >
            <FiberManualRecord
              sx={{
                fontSize: 8,
                color: healthLoading
                  ? alpha('#FFFFFF', 0.3)
                  : healthy
                    ? '#4ADE80'
                    : '#EF4444',
                ...((!healthLoading && !healthy) && {
                  animation: 'pulse 2s ease-in-out infinite',
                  '@keyframes pulse': {
                    '0%, 100%': { opacity: 1 },
                    '50%': { opacity: 0.3 },
                  },
                }),
              }}
            />
            <Typography
              sx={{
                fontSize: '0.72rem',
                color: alpha('#FFFFFF', 0.5),
                display: { xs: 'none', sm: 'block' },
              }}
            >
              {healthLoading ? '…' : healthy ? 'Online' : 'Offline'}
            </Typography>
          </Box>

          {/* Notifications icon */}
          <IconButton
            size="small"
            sx={{
              color: alpha('#FFFFFF', 0.5),
              '&:hover': { color: '#FFFFFF', bgcolor: alpha('#FFFFFF', 0.06) },
            }}
          >
            <NotificationsNoneRounded sx={{ fontSize: 20 }} />
          </IconButton>
        </Box>
      </Box>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 2, sm: 3, md: 4 },
          maxWidth: 1400,
          mx: 'auto',
          width: '100%',
        }}
      >
        {children}
      </Box>
    </Box>
  );
}
