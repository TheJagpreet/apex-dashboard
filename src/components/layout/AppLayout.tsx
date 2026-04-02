import type { ReactNode } from 'react';
import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Box, IconButton, Typography, Tooltip } from '@mui/material';
import { alpha } from '@mui/material/styles';
import {
  DashboardRounded,
  DnsRounded,
  AddCircleRounded,
  ChevronLeftRounded,
  ChevronRightRounded,
  FiberManualRecord,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useHealth } from '../../hooks/useSandboxes';

const SIDEBAR_WIDTH = 240;
const SIDEBAR_COLLAPSED_WIDTH = 72;
const GOLD = '#ECD06F';
const SIDEBAR_BG = '#0A0A0A';
const SIDEBAR_BORDER = '#1E1E1E';

interface NavItem {
  label: string;
  icon: ReactNode;
  path: string;
}

const navItems: NavItem[] = [
  { label: 'Dashboard', icon: <DashboardRounded />, path: '/' },
  { label: 'Sandboxes', icon: <DnsRounded />, path: '/sandboxes' },
  { label: 'Create New', icon: <AddCircleRounded />, path: '/create' },
];

interface AppLayoutProps {
  children: ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { healthy, loading: healthLoading } = useHealth();

  const sidebarWidth = collapsed ? SIDEBAR_COLLAPSED_WIDTH : SIDEBAR_WIDTH;

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      {/* Sidebar */}
      <motion.nav
        animate={{ width: sidebarWidth }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          height: '100vh',
          background: SIDEBAR_BG,
          borderRight: `1px solid ${SIDEBAR_BORDER}`,
          display: 'flex',
          flexDirection: 'column',
          zIndex: 1200,
          overflow: 'hidden',
        }}
      >
        {/* Logo / Brand */}
        <Box
          sx={{
            px: collapsed ? 1.5 : 3,
            pt: 3,
            pb: 2,
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
            minHeight: 72,
          }}
        >
          <Box
            sx={{
              color: GOLD,
              fontSize: 22,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              width: 36,
              height: 36,
            }}
          >
            ◆
          </Box>
          <AnimatePresence>
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
              >
                <Typography
                  sx={{
                    fontWeight: 800,
                    fontSize: '1.35rem',
                    color: GOLD,
                    letterSpacing: '0.12em',
                    lineHeight: 1,
                    whiteSpace: 'nowrap',
                  }}
                >
                  APEX
                </Typography>
                <Typography
                  sx={{
                    fontFamily: "'Space Mono', monospace",
                    fontSize: '0.55rem',
                    color: alpha('#FFFFFF', 0.35),
                    letterSpacing: '0.18em',
                    mt: 0.5,
                    whiteSpace: 'nowrap',
                  }}
                >
                  SANDBOX MANAGER
                </Typography>
              </motion.div>
            )}
          </AnimatePresence>
        </Box>

        {/* Divider */}
        <Box
          sx={{
            mx: 2,
            mb: 1,
            borderBottom: `1px solid ${alpha('#FFFFFF', 0.06)}`,
          }}
        />

        {/* Navigation */}
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 0.5, px: 1.5, pt: 1 }}>
          {navItems.map((item) => {
            const active = location.pathname === item.path;
            return (
              <Tooltip
                key={item.path}
                title={collapsed ? item.label : ''}
                placement="right"
                arrow
              >
                <Box
                  onClick={() => navigate(item.path)}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1.5,
                    px: collapsed ? 1.5 : 2,
                    py: 1.25,
                    borderRadius: '12px',
                    cursor: 'pointer',
                    position: 'relative',
                    transition: 'background 0.2s ease',
                    bgcolor: active ? alpha(GOLD, 0.08) : 'transparent',
                    borderLeft: active ? `3px solid ${GOLD}` : '3px solid transparent',
                    '&:hover': {
                      bgcolor: active ? alpha(GOLD, 0.12) : alpha('#FFFFFF', 0.04),
                    },
                    justifyContent: collapsed ? 'center' : 'flex-start',
                  }}
                >
                  <Box
                    sx={{
                      color: active ? GOLD : alpha('#FFFFFF', 0.5),
                      display: 'flex',
                      alignItems: 'center',
                      fontSize: 22,
                      flexShrink: 0,
                      transition: 'color 0.2s ease',
                    }}
                  >
                    {item.icon}
                  </Box>
                  <AnimatePresence>
                    {!collapsed && (
                      <motion.span
                        initial={{ opacity: 0, width: 0 }}
                        animate={{ opacity: 1, width: 'auto' }}
                        exit={{ opacity: 0, width: 0 }}
                        transition={{ duration: 0.2 }}
                        style={{ overflow: 'hidden', whiteSpace: 'nowrap' }}
                      >
                        <Typography
                          sx={{
                            fontSize: '0.85rem',
                            fontWeight: active ? 600 : 400,
                            color: active ? GOLD : alpha('#FFFFFF', 0.7),
                            letterSpacing: '0.02em',
                          }}
                        >
                          {item.label}
                        </Typography>
                      </motion.span>
                    )}
                  </AnimatePresence>
                </Box>
              </Tooltip>
            );
          })}
        </Box>

        {/* Bottom Section */}
        <Box sx={{ px: collapsed ? 1 : 2, pb: 2, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
          {/* Health Indicator */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              px: collapsed ? 1.5 : 2,
              py: 1,
              borderRadius: '10px',
              bgcolor: alpha('#FFFFFF', 0.03),
              justifyContent: collapsed ? 'center' : 'flex-start',
            }}
          >
            <FiberManualRecord
              sx={{
                fontSize: 10,
                color: healthLoading ? alpha('#FFFFFF', 0.3) : healthy ? '#4CAF50' : '#F44336',
                flexShrink: 0,
              }}
            />
            <AnimatePresence>
              {!collapsed && (
                <motion.span
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: 'auto' }}
                  exit={{ opacity: 0, width: 0 }}
                  transition={{ duration: 0.2 }}
                  style={{ overflow: 'hidden', whiteSpace: 'nowrap' }}
                >
                  <Typography
                    sx={{
                      fontSize: '0.75rem',
                      color: alpha('#FFFFFF', 0.5),
                      letterSpacing: '0.03em',
                    }}
                  >
                    Server
                  </Typography>
                </motion.span>
              )}
            </AnimatePresence>
          </Box>

          {/* Collapse Toggle */}
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <IconButton
              onClick={() => setCollapsed((prev) => !prev)}
              size="small"
              sx={{
                color: alpha('#FFFFFF', 0.4),
                '&:hover': {
                  color: GOLD,
                  bgcolor: alpha(GOLD, 0.08),
                },
                transition: 'all 0.2s ease',
              }}
            >
              {collapsed ? <ChevronRightRounded /> : <ChevronLeftRounded />}
            </IconButton>
          </Box>
        </Box>
      </motion.nav>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          ml: `${sidebarWidth}px`,
          transition: 'margin-left 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          minHeight: '100vh',
          p: { xs: 2, sm: 3, md: 4 },
        }}
      >
        {children}
      </Box>
    </Box>
  );
}
