import type { Service } from "@/@types/services";
import { SERVICES_DATA } from "@/constants/services";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { routeImports } from "./routePrefetch";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function handleCount(count: number): string {
  return count < 10 ? `0${count}` : count.toString();
}

export const findServiceData = (id: string): Service | undefined => {
  const data = SERVICES_DATA.find((data) => data.id === id);
  if (data) return data;
  return undefined;
};

// export const prefetchRoute = (path: string) => {
//   const importer = routeImports[path];
//   if (importer) {
//     importer();
//   }
// };

export const prefetchRoute = (path: string) => {
  const cleanPath = path.split("/").slice(0, 2).join("/");
  const importer = routeImports[cleanPath];
  importer?.();
};