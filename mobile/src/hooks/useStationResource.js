import {useCallback, useEffect, useRef, useState} from 'react';
import {useFocusEffect} from '@react-navigation/native';

// Mantém os dados após erros e evita sobrescrevê-los com respostas antigas.
export default function useStationResource(load, initialData, intervalMs = 10000) {
  const [data, setData] = useState(initialData);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const dataRef = useRef(initialData);
  const generation = useRef(0);
  const mounted = useRef(true);
  const busy = useRef(false);

  useEffect(() => {
    mounted.current = true;
    return () => { mounted.current = false; generation.current += 1; };
  }, []);

  const store = useCallback(value => {
    dataRef.current = value;
    setData(value);
  }, []);

  const refresh = useCallback(async () => {
    if (busy.current) return;
    const version = ++generation.current;
    setLoading(true);
    try {
      const value = await load();
      if (mounted.current && version === generation.current) { store(value); setError(null); }
    } catch (failure) {
      if (mounted.current && version === generation.current) setError(failure);
    } finally {
      if (mounted.current && version === generation.current) setLoading(false);
    }
  }, [load, store]);

  useFocusEffect(useCallback(() => {
    refresh();
    const timer = setInterval(refresh, intervalMs);
    return () => clearInterval(timer);
  }, [refresh, intervalMs]));

  const mutate = useCallback(async action => {
    if (busy.current) return;
    busy.current = true;
    const version = ++generation.current;
    setSaving(true);
    setLoading(false);
    try {
      const value = await action(dataRef.current);
      if (mounted.current && version === generation.current) { store(value); setError(null); }
    } catch (failure) {
      if (mounted.current && version === generation.current) setError(failure);
    } finally {
      busy.current = false;
      if (mounted.current) setSaving(false);
    }
  }, [store]);

  return {data, error, loading, saving, refresh, mutate};
}
