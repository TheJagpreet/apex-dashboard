import axios from 'axios';
import type {
  SandboxListResponse,
  CreateSandboxRequest,
  CreateSandboxResponse,
  SandboxStatusResponse,
  DestroySandboxResponse,
  ExecRequest,
  ExecResponse,
  ExecStreamResponse,
  CopyToRequest,
  CopyFromRequest,
  CopyResponse,
  HealthResponse,
} from './types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

// Health
export const getHealth = () =>
  api.get<HealthResponse>('/health').then((r) => r.data);

// Sandboxes
export const listSandboxes = () =>
  api.get<SandboxListResponse>('/api/sandboxes').then((r) => r.data);

export const createSandbox = (data: CreateSandboxRequest) =>
  api.post<CreateSandboxResponse>('/api/sandboxes', data).then((r) => r.data);

export const getSandboxStatus = (id: string) =>
  api.get<SandboxStatusResponse>(`/api/sandboxes/${encodeURIComponent(id)}/status`).then((r) => r.data);

export const destroySandbox = (id: string) =>
  api.delete<DestroySandboxResponse>(`/api/sandboxes/${encodeURIComponent(id)}`).then((r) => r.data);

// Exec
export const execCommand = (id: string, data: ExecRequest) =>
  api.post<ExecResponse>(`/api/sandboxes/${encodeURIComponent(id)}/exec`, data).then((r) => r.data);

export const execCommandStream = (id: string, data: ExecRequest) =>
  api.post<ExecStreamResponse>(`/api/sandboxes/${encodeURIComponent(id)}/exec/stream`, data).then((r) => r.data);

// File operations
export const copyToSandbox = (id: string, data: CopyToRequest) =>
  api.post<CopyResponse>(`/api/sandboxes/${encodeURIComponent(id)}/copy-to`, data).then((r) => r.data);

export const copyFromSandbox = (id: string, data: CopyFromRequest) =>
  api.post<CopyResponse>(`/api/sandboxes/${encodeURIComponent(id)}/copy-from`, data).then((r) => r.data);

export default api;
