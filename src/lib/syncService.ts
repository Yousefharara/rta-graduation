import type { ICreateAid } from "@/@types/aid";
import type { ICreateBeneficiary } from "@/@types/beneficiary";
import type { IBeneficiaryOrder } from "@/@types/beneficiaryOrder";
import type { IBeneficiaryAid } from "@/@types/beneficiaryAid";
import type { ICreateBeneficiaryAid } from "@/redux/slices/beneficiaryAidSlice";
import { store } from "@/redux/store";
import { addBeneficiaryAction } from "@/redux/slices/beneficiarySlice";
import { addAidAction, editAidDeductAction } from "@/redux/slices/aidSlice";
import { updateBeneficiaryOrderStatusAction } from "@/redux/slices/beneficiaryOrderSlice";
import {
  editBeneficiaryAidStatus,
  createBeneficiaryAidAction,
} from "@/redux/slices/beneficiaryAidSlice";

const STORAGE_KEY = "offline_action_queue";

export type QueuedActionName =
  | "addBeneficiaryAction"
  | "addAidAction"
  | "updateBeneficiaryOrderStatusAction"
  | "editBeneficiaryAidStatus"
  | "createBeneficiaryAidAction"
  | "editAidDeductAction";

export interface QueuedAction {
  id: string;
  actionName: QueuedActionName;
  args: unknown[];
  created_at: string;
}

let _isSyncing = false;

export function isSyncing(): boolean {
  return _isSyncing;
}

function getQueue(): QueuedAction[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveQueue(queue: QueuedAction[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(queue));
}

export function addToQueue(actionName: QueuedActionName, ...args: unknown[]) {
  const queue = getQueue();
  const entry: QueuedAction = {
    id: crypto.randomUUID(),
    actionName,
    args,
    created_at: new Date().toISOString(),
  };
  queue.push(entry);
  saveQueue(queue);
  window.dispatchEvent(new CustomEvent("sync-queue-changed"));
  return entry;
}

export function removeFromQueue(id: string) {
  const queue = getQueue().filter((op) => op.id !== id);
  saveQueue(queue);
  window.dispatchEvent(new CustomEvent("sync-queue-changed"));
}

export function getPendingOperations(): QueuedAction[] {
  return getQueue();
}

export function getPendingCount(): number {
  return getQueue().length;
}

const actionRegistry: Record<
  QueuedActionName,
  (...args: unknown[]) => (dispatch: typeof store.dispatch) => Promise<unknown>
> = {
  addBeneficiaryAction: (body, token) =>
    addBeneficiaryAction(body as ICreateBeneficiary, token as string),
  addAidAction: (body, token) =>
    addAidAction(body as ICreateAid, token as string),
  updateBeneficiaryOrderStatusAction: (id, status, token) =>
    updateBeneficiaryOrderStatusAction(
      id as number,
      status as IBeneficiaryOrder["status"],
      token as string,
    ),
  editBeneficiaryAidStatus: (id, status, token) =>
    editBeneficiaryAidStatus(
      id as number,
      status as IBeneficiaryAid["status"],
      token as string,
    ),
  createBeneficiaryAidAction: (body, token) =>
    createBeneficiaryAidAction(body as ICreateBeneficiaryAid, token as string),
  editAidDeductAction: (id, quantity, token) =>
    editAidDeductAction(id as number, quantity as number, token as string),
};

export async function syncNow(): Promise<number> {
  const queue = getQueue();
  if (queue.length === 0) return 0;

  if (_isSyncing) return 0;
  _isSyncing = true;
  window.dispatchEvent(new CustomEvent("sync-status-changed"));

  const currentToken = store.getState()?.auth?.accessToken || "";

  let synced = 0;
  for (const op of queue) {
    try {
      const actionFn = actionRegistry[op.actionName];
      if (!actionFn) {
        removeFromQueue(op.id);
        continue;
      }
      const args = [...op.args];
      if (args.length > 0) {
        args[args.length - 1] = currentToken;
      }
      const result = await store.dispatch(actionFn(...args) as never);
      if (
        result &&
        typeof result === "object" &&
        "success" in result &&
        (result as { success: boolean }).success
      ) {
        removeFromQueue(op.id);
        synced++;
      }
    } catch {
      // will retry on next sync
    }
  }

  _isSyncing = false;
  window.dispatchEvent(new CustomEvent("sync-status-changed"));
  window.dispatchEvent(new CustomEvent("sync-queue-changed"));

  return synced;
}

let onlineListener: (() => void) | null = null;
let retryInterval: ReturnType<typeof setInterval> | null = null;

export function setupAutoSync() {
  // 1. حاول معالجة العمليات المعلقة فوراً (مع تأخير بسيط لانتظار rehydrate)
  if (navigator.onLine && getPendingCount() > 0) {
    setTimeout(() => syncNow(), 2000);
  }

  // 2. استمع لحدث العودة للاتصال
  const handler = async () => {
    if (navigator.onLine) {
      await syncNow();
    }
  };
  window.addEventListener("online", handler);
  onlineListener = () => window.removeEventListener("online", handler);

  // 3. أعد المحاولة دورياً كل 30 ثانية ما دام فيه عمليات معلقة
  retryInterval = setInterval(() => {
    if (navigator.onLine && getPendingCount() > 0 && !_isSyncing) {
      syncNow();
    }
  }, 30000);
}

export function destroyAutoSync() {
  if (onlineListener) {
    onlineListener();
    onlineListener = null;
  }
  if (retryInterval) {
    clearInterval(retryInterval);
    retryInterval = null;
  }
}
