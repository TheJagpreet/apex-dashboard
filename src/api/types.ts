// Sandbox types based on apex-venv API

export interface Sandbox {
  id: string;
  name: string;
  image: string;
  status: 'running' | 'stopped' | 'unknown';
}

export interface SandboxListResponse {
  sandboxes: Sandbox[];
}

export interface CreateSandboxRequest {
  image: string;
  name?: string;
  workdir?: string;
  env?: string[];
  mounts?: string[];
  memory?: string;
  cpus?: number;
  repo_url?: string;
  timeout?: string;
}

export interface CreateSandboxResponse {
  sandbox_id: string;
  status: string;
  timeout: string;
}

export interface SandboxStatusResponse {
  sandbox_id: string;
  status: 'running' | 'stopped' | 'unknown';
}

export interface DestroySandboxResponse {
  sandbox_id: string;
  status: 'destroyed';
}

export interface ExecRequest {
  command: string;
  workdir?: string;
  env?: string[];
}

export interface ExecResponse {
  exit_code: number;
  stdout: string;
  stderr: string;
}

export interface StreamOutputLine {
  stream: 'stdout' | 'stderr';
  data: string;
}

export interface ExecStreamResponse {
  exit_code: number;
  output: StreamOutputLine[];
}

export interface CopyToRequest {
  host_path: string;
  container_path: string;
}

export interface CopyFromRequest {
  container_path: string;
  host_path: string;
}

export interface CopyResponse {
  status: 'copied';
  host_path: string;
  container_path: string;
}

export interface HealthResponse {
  service: string;
  status: string;
}

export interface ApiError {
  error: string;
}
