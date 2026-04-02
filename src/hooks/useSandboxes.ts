import { useState, useEffect, useCallback, useRef } from 'react';
import type { Sandbox, HealthResponse } from '../api/types';
import { listSandboxes, getHealth, getSandboxStatus } from '../api/client';

export function useSandboxes(pollInterval = 10000) {
  const [sandboxes, setSandboxes] = useState<Sandbox[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchSandboxes = useCallback(async () => {
    try {
      const data = await listSandboxes();
      setSandboxes(data.sandboxes || []);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch sandboxes');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSandboxes();
    intervalRef.current = setInterval(fetchSandboxes, pollInterval);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [fetchSandboxes, pollInterval]);

  return { sandboxes, loading, error, refetch: fetchSandboxes };
}

export function useHealth(pollInterval = 15000) {
  const [health, setHealth] = useState<HealthResponse | null>(null);
  const [healthy, setHealthy] = useState(false);
  const [loading, setLoading] = useState(true);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchHealth = useCallback(async () => {
    try {
      const data = await getHealth();
      setHealth(data);
      setHealthy(data.status === 'ok');
    } catch {
      setHealth(null);
      setHealthy(false);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHealth();
    intervalRef.current = setInterval(fetchHealth, pollInterval);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [fetchHealth, pollInterval]);

  return { health, healthy, loading, refetch: fetchHealth };
}

export function useSandboxStatus(id: string | undefined, pollInterval = 5000) {
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchStatus = useCallback(async () => {
    if (!id) return;
    try {
      const data = await getSandboxStatus(id);
      setStatus(data.status);
    } catch {
      setStatus('unknown');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (!id) return;
    fetchStatus();
    intervalRef.current = setInterval(fetchStatus, pollInterval);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [id, fetchStatus, pollInterval]);

  return { status, loading, refetch: fetchStatus };
}
