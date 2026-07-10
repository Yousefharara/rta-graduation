import axios from "axios";
import { addToQueue, isSyncing, type QueuedActionName } from "./syncService";

const MUTATION_METHODS = ["post", "put", "patch", "delete"];
const AUTH_ENDPOINTS = ["/api/auth/"];

function isAuthEndpoint(url: string): boolean {
  return AUTH_ENDPOINTS.some((prefix) => url.includes(prefix));
}

const SYNC_ENDPOINTS: {
  pattern: RegExp;
  method: string;
  actionName: QueuedActionName;
  extractArgs: (
    url: string,
    data: Record<string, unknown> | undefined,
  ) => unknown[];
}[] = [
  {
    pattern: /\/api\/beneficiaries$/,
    method: "post",
    actionName: "addBeneficiaryAction",
    extractArgs: (_url, data) => [data, ""],
  },
  {
    pattern: /\/api\/aids$/,
    method: "post",
    actionName: "addAidAction",
    extractArgs: (_url, data) => [data, ""],
  },
  {
    pattern: /\/api\/beneficiary-orders\/(\d+)$/,
    method: "put",
    actionName: "updateBeneficiaryOrderStatusAction",
    extractArgs: (url, data) => {
      const id = Number(
        url.match(/\/api\/beneficiary-orders\/(\d+)/)?.[1] || 0,
      );
      return [id, (data as { status?: string })?.status || "pending", ""];
    },
  },
  {
    pattern: /\/api\/beneficiary-aids\/(\d+)$/,
    method: "put",
    actionName: "editBeneficiaryAidStatus",
    extractArgs: (url, data) => {
      const id = Number(url.match(/\/api\/beneficiary-aids\/(\d+)/)?.[1] || 0);
      return [id, (data as { status?: string })?.status || "pending", ""];
    },
  },
  {
    pattern: /\/api\/beneficiary-aids$/,
    method: "post",
    actionName: "createBeneficiaryAidAction",
    extractArgs: (_url, data) => [data, ""],
  },
  {
    pattern: /\/api\/aids\/(\d+)\/deduct$/,
    method: "patch",
    actionName: "editAidDeductAction",
    extractArgs: (url, data) => {
      const id = Number(url.match(/\/api\/aids\/(\d+)\/deduct/)?.[1] || 0);
      return [id, (data as { quantity?: number })?.quantity || 1, ""];
    },
  },
];

function getTokenFromConfig(error: {
  config?: { headers?: Record<string, string> };
}): string | null {
  const authHeader = error.config?.headers?.Authorization || "";
  return authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;
}

function handleSyncEndpoint(
  method: string,
  url: string,
  data: string | undefined,
  error: unknown,
) {
  for (const ep of SYNC_ENDPOINTS) {
    if (ep.pattern.test(url) && ep.method === method) {
      let parsedData: Record<string, unknown> | undefined;
      try {
        parsedData = data ? JSON.parse(data) : undefined;
      } catch {
        parsedData = undefined;
      }

      const args = ep.extractArgs(url, parsedData);
      const token = getTokenFromConfig(
        error as { config?: { headers?: Record<string, string> } },
      );
      if (token && args.length > 0) {
        args[args.length - 1] = token;
      }

      addToQueue(ep.actionName, ...args);
      return;
    }
  }
}

export function setupAxiosInterceptors() {
  axios.interceptors.response.use(
    (response) => response,
    (error) => {
      if (!error.config || error.config._offlineHandled)
        return Promise.reject(error);

      const isNetworkError =
        !error.response &&
        (error.code === "ERR_NETWORK" || error.message === "Network Error");

      if (!isNetworkError) return Promise.reject(error);

      const { method, url, data } = error.config;
      const methodLower = method?.toLowerCase() || "";

      if (!MUTATION_METHODS.includes(methodLower)) return Promise.reject(error);
      if (isAuthEndpoint(url || "")) return Promise.reject(error);
      if (isSyncing()) return Promise.reject(error);

      if (url) {
        handleSyncEndpoint(methodLower, url, data, error);
      }

      error.config._offlineHandled = true;

      return Promise.reject(error);
    },
  );
}
