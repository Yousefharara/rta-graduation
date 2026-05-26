import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
// import { routeImports } from "./routePrefetch";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function handleCount(count: number): string {
  return count < 10 ? `0${count}` : count.toString();
}

// export const prefetchRoute = (path: string) => {
//   const importer = routeImports[path];
//   if (importer) {
//     importer();
//   }
// };

// export const prefetchRoute = (path: string) => {
//   const cleanPath = path.split("/").slice(0, 2).join("/");
//   const importer = routeImports[cleanPath];
//   importer?.();
// };