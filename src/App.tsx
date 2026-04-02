import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { theme } from './theme';
import AppLayout from './components/layout/AppLayout';
import Dashboard from './pages/Dashboard';
import Sandboxes from './pages/Sandboxes';
import CreateSandbox from './pages/CreateSandbox';
import SandboxDetail from './pages/SandboxDetail';

import '@fontsource/dm-sans/400.css';
import '@fontsource/dm-sans/500.css';
import '@fontsource/dm-sans/600.css';
import '@fontsource/dm-sans/700.css';
import '@fontsource/dm-sans/800.css';
import '@fontsource/space-mono/400.css';
import '@fontsource/space-mono/700.css';

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <AppLayout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/sandboxes" element={<Sandboxes />} />
            <Route path="/create" element={<CreateSandbox />} />
            <Route path="/sandbox/:id" element={<SandboxDetail />} />
          </Routes>
        </AppLayout>
      </BrowserRouter>
    </ThemeProvider>
  );
}
