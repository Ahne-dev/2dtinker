import { useState } from 'react';

export function useHistory(initialPresent) {
  const [past, setPast] = useState([]);
  const [present, setPresent] = useState(initialPresent);
  const [future, setFuture] = useState([]);

  const canUndo = past.length > 0;
  const canRedo = future.length > 0;

  const undo = () => {
    if (!canUndo) return null;
    const previous = past[past.length - 1];
    setPast(past.slice(0, past.length - 1));
    setFuture([present, ...future]);
    setPresent(previous);
    return previous;
  };

  const redo = () => {
    if (!canRedo) return null;
    const next = future[0];
    setPast([...past, present]);
    setPresent(next);
    setFuture(future.slice(1));
    return next;
  };

  const pushState = (newPresent) => {
    setPast([...past, present]);
    setPresent(newPresent);
    setFuture([]);
  };

  const clear = (state) => {
    setPast([]);
    setPresent(state);
    setFuture([]);
  };

  return { state: present, setState: pushState, undo, redo, canUndo, canRedo, clear };
}
