import { AREAS } from "@/constants/areas";

export const generateRandomEmail = () => {
  const random = Math.random().toString(36).slice(2, 8);

  return `${random}@example.com`;
};

export const positiveNumberOnly = (value: string): number => {
  return Number(value.replace(/\D/g, ""));
};

export const generateRandomAlgorithm = () => {
  return Math.floor(Math.random() * 99) + 1;
}

export const getAreaById = (id: number) => {
  return AREAS.find((area) => area.id === id);
};