import { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  TextField,
  Button,
  IconButton,
  Collapse,
  CircularProgress,
  Divider,
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import {
  ExpandMoreRounded,
  ExpandLessRounded,
  AddRounded,
  RemoveCircleOutlineRounded,
  RocketLaunchRounded,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { createSandbox } from '../api/client';
import { useToast } from '../hooks/useToast';

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
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' as const } },
};

export default function CreateSandbox() {
  const navigate = useNavigate();
  const { showError } = useToast();

  // Form state
  const [image, setImage] = useState('');
  const [name, setName] = useState('');
  const [workdir, setWorkdir] = useState('');
  const [memory, setMemory] = useState('');
  const [cpus, setCpus] = useState('');
  const [timeout, setTimeout] = useState('');
  const [repoUrl, setRepoUrl] = useState('');
  const [envVars, setEnvVars] = useState<string[]>([]);
  const [mounts, setMounts] = useState<string[]>([]);

  // UI state
  const [advancedOpen, setAdvancedOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleAddEnvVar = () => setEnvVars((prev) => [...prev, '']);
  const handleRemoveEnvVar = (index: number) =>
    setEnvVars((prev) => prev.filter((_, i) => i !== index));
  const handleEnvVarChange = (index: number, value: string) =>
    setEnvVars((prev) => prev.map((v, i) => (i === index ? value : v)));

  const handleAddMount = () => setMounts((prev) => [...prev, '']);
  const handleRemoveMount = (index: number) =>
    setMounts((prev) => prev.filter((_, i) => i !== index));
  const handleMountChange = (index: number, value: string) =>
    setMounts((prev) => prev.map((v, i) => (i === index ? value : v)));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedImage = image.trim();
    if (!trimmedImage) {
      setImageError(true);
      return;
    }

    setLoading(true);
    try {
      const payload: Parameters<typeof createSandbox>[0] = {
        image: trimmedImage,
      };

      if (name.trim()) payload.name = name.trim();
      if (workdir.trim()) payload.workdir = workdir.trim();
      if (memory.trim()) payload.memory = memory.trim();
      if (cpus.trim()) payload.cpus = parseFloat(cpus);
      if (timeout.trim()) payload.timeout = timeout.trim();
      if (repoUrl.trim()) payload.repo_url = repoUrl.trim();

      const filteredEnv = envVars.filter((v) => v.trim());
      if (filteredEnv.length > 0) payload.env = filteredEnv;

      const filteredMounts = mounts.filter((v) => v.trim());
      if (filteredMounts.length > 0) payload.mounts = filteredMounts;

      await createSandbox(payload);

      globalThis.setTimeout(() => navigate('/sandboxes'), 500);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'An unexpected error occurred';
      showError(message);
    } finally {
      setLoading(false);
    }
  };

  const fieldSx = {
    '& .MuiOutlinedInput-root': {
      fontFamily: '"Space Mono", monospace',
      fontSize: '0.875rem',
    },
  };

  const dynamicRowSx = {
    display: 'flex',
    alignItems: 'center',
    gap: 1,
    mb: 1,
  };

  return (
    <Box>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' as const }}
      >
        <Box sx={{ mb: 4 }}>
          <Typography
            variant="h3"
            sx={{ fontWeight: 700, fontSize: { xs: '1.8rem', md: '2.2rem' } }}
          >
            Create Sandbox
          </Typography>
          <Typography variant="body1" sx={{ color: 'text.secondary', mt: 0.5 }}>
            Configure and launch a new sandbox environment
          </Typography>
        </Box>
      </motion.div>

      <motion.div variants={containerVariants} initial="hidden" animate="visible">
        <form onSubmit={handleSubmit} noValidate>
          {/* Main Form Card */}
          <MotionCard variants={itemVariants} sx={{ mb: 2.5 }}>
            <CardContent sx={{ p: { xs: 3, md: 4 } }}>
              {/* Image Field (required) */}
              <Typography
                variant="subtitle2"
                sx={{ color: LIME, fontWeight: 700, mb: 1.5, textTransform: 'uppercase', letterSpacing: '0.08em' }}
              >
                Image *
              </Typography>
              <TextField
                fullWidth
                required
                placeholder="e.g. apex-venv/ubuntu"
                value={image}
                onChange={(e) => {
                  setImage(e.target.value);
                  if (e.target.value.trim()) setImageError(false);
                }}
                error={imageError}
                helperText={imageError ? 'Image is required' : ''}
                sx={{ ...fieldSx, mb: 3 }}
              />

              <Divider sx={{ my: 2 }} />

              {/* Advanced Configuration Toggle */}
              <Button
                onClick={() => setAdvancedOpen((prev) => !prev)}
                endIcon={advancedOpen ? <ExpandLessRounded /> : <ExpandMoreRounded />}
                sx={{
                  color: 'text.secondary',
                  textTransform: 'none',
                  fontWeight: 600,
                  px: 0,
                  '&:hover': { bgcolor: 'transparent', color: 'text.primary' },
                }}
              >
                Advanced Configuration
              </Button>

              <Collapse in={advancedOpen} timeout="auto">
                <Box sx={{ mt: 3, display: 'flex', flexDirection: 'column', gap: 3 }}>
                  {/* Name */}
                  <Box>
                    <Typography variant="subtitle2" sx={{ color: 'text.secondary', fontWeight: 600, mb: 1 }}>
                      Name
                    </Typography>
                    <TextField
                      fullWidth
                      placeholder="e.g. my-sandbox"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      sx={fieldSx}
                    />
                  </Box>

                  {/* Working Directory */}
                  <Box>
                    <Typography variant="subtitle2" sx={{ color: 'text.secondary', fontWeight: 600, mb: 1 }}>
                      Working Directory
                    </Typography>
                    <TextField
                      fullWidth
                      placeholder="e.g. /workspace"
                      value={workdir}
                      onChange={(e) => setWorkdir(e.target.value)}
                      sx={fieldSx}
                    />
                  </Box>

                  {/* Memory & CPU Row */}
                  <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
                    <Box sx={{ flex: 1, minWidth: 200 }}>
                      <Typography variant="subtitle2" sx={{ color: 'text.secondary', fontWeight: 600, mb: 1 }}>
                        Memory Limit
                      </Typography>
                      <TextField
                        fullWidth
                        placeholder="e.g. 512m, 2g"
                        value={memory}
                        onChange={(e) => setMemory(e.target.value)}
                        sx={fieldSx}
                      />
                    </Box>
                    <Box sx={{ flex: 1, minWidth: 200 }}>
                      <Typography variant="subtitle2" sx={{ color: 'text.secondary', fontWeight: 600, mb: 1 }}>
                        CPU Limit
                      </Typography>
                      <TextField
                        fullWidth
                        type="number"
                        inputProps={{ step: 0.5 }}
                        placeholder="e.g. 1.5"
                        value={cpus}
                        onChange={(e) => setCpus(e.target.value)}
                        sx={fieldSx}
                      />
                    </Box>
                  </Box>

                  {/* Timeout */}
                  <Box>
                    <Typography variant="subtitle2" sx={{ color: 'text.secondary', fontWeight: 600, mb: 1 }}>
                      Timeout
                    </Typography>
                    <TextField
                      fullWidth
                      placeholder="e.g. 30m, 2h"
                      value={timeout}
                      onChange={(e) => setTimeout(e.target.value)}
                      sx={fieldSx}
                    />
                  </Box>

                  {/* Repository URL */}
                  <Box>
                    <Typography variant="subtitle2" sx={{ color: 'text.secondary', fontWeight: 600, mb: 1 }}>
                      Repository URL
                    </Typography>
                    <TextField
                      fullWidth
                      placeholder="e.g. https://github.com/user/repo"
                      value={repoUrl}
                      onChange={(e) => setRepoUrl(e.target.value)}
                      sx={fieldSx}
                    />
                  </Box>

                  <Divider />

                  {/* Environment Variables */}
                  <Box>
                    <Typography variant="subtitle2" sx={{ color: 'text.secondary', fontWeight: 600, mb: 1.5 }}>
                      Environment Variables
                    </Typography>
                    {envVars.map((envVar, index) => (
                      <Box key={index} sx={dynamicRowSx}>
                        <TextField
                          fullWidth
                          placeholder="KEY=VALUE"
                          value={envVar}
                          onChange={(e) => handleEnvVarChange(index, e.target.value)}
                          size="small"
                          sx={fieldSx}
                        />
                        <IconButton
                          onClick={() => handleRemoveEnvVar(index)}
                          size="small"
                          sx={{ color: alpha('#EF4444', 0.7), '&:hover': { color: '#EF4444' } }}
                        >
                          <RemoveCircleOutlineRounded fontSize="small" />
                        </IconButton>
                      </Box>
                    ))}
                    <Button
                      startIcon={<AddRounded />}
                      onClick={handleAddEnvVar}
                      size="small"
                      sx={{ color: LIME, textTransform: 'none', fontWeight: 600 }}
                    >
                      Add Variable
                    </Button>
                  </Box>

                  {/* Mounts */}
                  <Box>
                    <Typography variant="subtitle2" sx={{ color: 'text.secondary', fontWeight: 600, mb: 1.5 }}>
                      Mounts
                    </Typography>
                    {mounts.map((mount, index) => (
                      <Box key={index} sx={dynamicRowSx}>
                        <TextField
                          fullWidth
                          placeholder="source:target"
                          value={mount}
                          onChange={(e) => handleMountChange(index, e.target.value)}
                          size="small"
                          sx={fieldSx}
                        />
                        <IconButton
                          onClick={() => handleRemoveMount(index)}
                          size="small"
                          sx={{ color: alpha('#EF4444', 0.7), '&:hover': { color: '#EF4444' } }}
                        >
                          <RemoveCircleOutlineRounded fontSize="small" />
                        </IconButton>
                      </Box>
                    ))}
                    <Button
                      startIcon={<AddRounded />}
                      onClick={handleAddMount}
                      size="small"
                      sx={{ color: LIME, textTransform: 'none', fontWeight: 600 }}
                    >
                      Add Mount
                    </Button>
                  </Box>
                </Box>
              </Collapse>
            </CardContent>
          </MotionCard>

          {/* Action Buttons */}
          <MotionCard variants={itemVariants}>
            <CardContent
              sx={{
                display: 'flex',
                justifyContent: 'flex-end',
                gap: 2,
                p: { xs: 2, md: 3 },
              }}
            >
              <Button
                onClick={() => navigate(-1)}
                sx={{ color: 'text.secondary', textTransform: 'none', fontWeight: 600, borderRadius: '12px' }}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                disabled={loading}
                startIcon={
                  loading ? (
                    <CircularProgress size={18} sx={{ color: '#000' }} />
                  ) : (
                    <RocketLaunchRounded />
                  )
                }
                sx={{ borderRadius: '14px' }}
              >
                {loading ? 'Creating…' : 'Create Sandbox'}
              </Button>
            </CardContent>
          </MotionCard>
        </form>
      </motion.div>
    </Box>
  );
}
