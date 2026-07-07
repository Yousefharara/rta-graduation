import axios from "axios";
import { addToQueue } from "./syncService";
import { toast } from "sonner";

const MUTATION_METHODS = ["post", "put", "patch", "delete"];
const AUTH_ENDPOINTS = ["/api/auth/"];

function isAuthEndpoint(url: string): boolean {
  return AUTH_ENDPOINTS.some((prefix) => url.includes(prefix));
}

function getTableName(url: string): string {
  const parts = url.replace(/^\/api\//, "").split("/");
  return parts[0] || "unknown";
}

function getRecordId(url: string, method: string): number | null {
  if (method === "delete" || method === "put" || method === "patch") {
    const parts = url.replace(/^\/api\//, "").split("/");
    const last = parts[parts.length - 1];
    const id = Number(last);
    return !isNaN(id) ? id : null;
  }
  return null;
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

      error.config._offlineHandled = true;

      let parsedData: Record<string, unknown> | undefined;
      try {
        parsedData = data ? JSON.parse(data) : undefined;
      } catch {
        parsedData = undefined;
      }

      addToQueue({
        operation_type:
          methodLower === "post"
            ? "create"
            : methodLower === "delete"
              ? "delete"
              : "update",
        table_name: getTableName(url || ""),
        endpoint: url || "",
        method: methodLower,
        payload: parsedData,
        record_id: getRecordId(url || "", methodLower),
      });

      toast.warning(
        "تم حفظ العملية محلياً وستتم مزامنتها تلقائياً عند عودة الإنترنت",
      );

      return Promise.reject(error);
    },
  );
}
