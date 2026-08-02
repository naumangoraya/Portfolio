'use client';

import { useCallback, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { authFetch } from '../lib/authFetch';

/**
 * CRUD + reorder state for one admin collection endpoint.
 *
 * Errors are already surfaced by `authFetch` (it toasts and throws), so this
 * hook only adds the success toasts and swallows the rejection so callers can
 * `await create(...)` inside a form handler without a try/catch of their own.
 * Every mutator resolves to the saved record on success and `null` on failure.
 *
 * @param {string} endpoint e.g. '/api/admin/services'
 * @param {object} [options]
 * @param {Array}  [options.initial=[]] server-rendered seed data
 * @param {string} [options.idKey='_id']
 */
export function useAdminResource(endpoint, { initial = [], idKey = '_id' } = {}) {
  const [items, setItems] = useState(Array.isArray(initial) ? initial : []);
  const [busy, setBusy] = useState(false);

  // Ref mirror so `reorder` can roll back to the pre-drag order without
  // re-creating the callback on every items change.
  const itemsRef = useRef(items);
  itemsRef.current = items;

  const asArray = useCallback(payload => {
    if (Array.isArray(payload)) return payload;
    if (Array.isArray(payload?.items)) return payload.items;
    if (Array.isArray(payload?.data)) return payload.data;
    return [];
  }, []);

  const refresh = useCallback(async () => {
    setBusy(true);
    try {
      const data = await authFetch(endpoint);
      const next = asArray(data);
      setItems(next);
      return next;
    } catch {
      return null;
    } finally {
      setBusy(false);
    }
  }, [endpoint, asArray]);

  const create = useCallback(
    async values => {
      setBusy(true);
      try {
        const created = await authFetch(endpoint, { method: 'POST', body: values });
        if (created && typeof created === 'object' && !Array.isArray(created)) {
          setItems(prev => [...prev, created]);
        } else {
          await refresh();
        }
        toast.success('Created');
        return created;
      } catch {
        return null;
      } finally {
        setBusy(false);
      }
    },
    [endpoint, refresh]
  );

  const update = useCallback(
    async (id, values) => {
      setBusy(true);
      try {
        const saved = await authFetch(`${endpoint}/${id}`, { method: 'PUT', body: values });
        setItems(prev =>
          prev.map(item =>
            String(item?.[idKey]) === String(id)
              ? { ...item, ...(saved && typeof saved === 'object' ? saved : values) }
              : item
          )
        );
        toast.success('Saved');
        return saved;
      } catch {
        return null;
      } finally {
        setBusy(false);
      }
    },
    [endpoint, idKey]
  );

  const remove = useCallback(
    async id => {
      setBusy(true);
      try {
        await authFetch(`${endpoint}/${id}`, { method: 'DELETE' });
        setItems(prev => prev.filter(item => String(item?.[idKey]) !== String(id)));
        toast.success('Deleted');
        return true;
      } catch {
        return false;
      } finally {
        setBusy(false);
      }
    },
    [endpoint, idKey]
  );

  /**
   * Optimistic reorder: paint the new order immediately, POST the id list to
   * `${endpoint}/reorder`, and restore the previous array if the server says no.
   */
  const reorder = useCallback(
    async nextItems => {
      const previous = itemsRef.current;
      const next = Array.isArray(nextItems) ? nextItems : [];

      setItems(next);
      setBusy(true);

      try {
        await authFetch(`${endpoint}/reorder`, {
          method: 'POST',
          body: {
            order: next.map((item, index) => ({ [idKey]: item?.[idKey], order: index })),
            ids: next.map(item => item?.[idKey]),
          },
        });
        return true;
      } catch {
        setItems(previous);
        return false;
      } finally {
        setBusy(false);
      }
    },
    [endpoint, idKey]
  );

  return { items, setItems, busy, refresh, create, update, remove, reorder };
}

export default useAdminResource;
