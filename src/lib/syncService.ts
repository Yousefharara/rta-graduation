import axios from "axios";
import { API_KEY } from "@/config/api";
import { toast } from "sonner";

const STORAGE_KEY = "offline_queue";

export interface PendingOperation {
  id: string;
  operation_type: "create" | "update" | "delete";
  table_name: string;
  endpoint: string;
  method: string;
  payload?: Record<string, unknown>;
  record_id?: number | null;
  created_at: string;
}

function getQueue(): PendingOperation[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveQueue(queue: PendingOperation[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(queue));
}

export function addToQueue(op: Omit<PendingOperation, "id" | "created_at">) {
  const queue = getQueue();
  const entry: PendingOperation = {
    ...op,
    id: crypto.randomUUID(),
    created_at: new Date().toISOString(),
  };
  queue.push(entry);
  saveQueue(queue);
  return entry;
}

export function removeFromQueue(id: string) {
  const queue = getQueue().filter((op) => op.id !== id);
  saveQueue(queue);
}

export function getPendingOperations(): PendingOperation[] {
  return getQueue();
}

export async function syncNow(token?: string): Promise<number> {
  const queue = getQueue();
  if (queue.length === 0) return 0;

  let synced = 0;
  for (const op of queue) {
    try {
      await axios.post(
        API_KEY + "/api/sync",
        {
          operation_type: op.operation_type,
          table_name: op.table_name,
          record_id: op.record_id,
          payload: op.payload,
          endpoint: op.endpoint,
          method: op.method,
        },
        token ? { headers: { Authorization: `Bearer ${token}` } } : undefined,
      );
      removeFromQueue(op.id);
      synced++;
    } catch {
      // will retry on next sync
    }
  }

  if (synced > 0) {
    toast.success(`تمت مزامنة ${synced} عملية بنجاح`);
  }

  return synced;
}

let onlineListener: (() => void) | null = null;

export function setupAutoSync(getToken: () => string | null) {
  const handler = async () => {
    if (navigator.onLine) {
      const token = getToken();
      await syncNow(token || undefined);
    }
  };

  window.addEventListener("online", handler);
  onlineListener = () => window.removeEventListener("online", handler);
}

export function destroyAutoSync() {
  if (onlineListener) {
    onlineListener();
    onlineListener = null;
  }
}
