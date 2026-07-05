export const generateRandomEmail = () => {
  const random = Math.random().toString(36).slice(2, 8);

  return `${random}@example.com`;
};

export const positiveNumberOnly = (value: string): number => {
  return Number(value.replace(/\D/g, ""));
};

export const generateRandomPassword = () => {
  const chars = "abcdefghjkmnpqrstuvwxyz23456789";
  let result = "";
  for (let i = 0; i < 9; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

export const generateRandomAlgorithm = () => {
  return Math.floor(Math.random() * 99) + 1;
};

export const formatDate = (date: Date) => {
  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, "0"),
    String(date.getDate()).padStart(2, "0"),
  ].join("-");
};

export const toDateStr = (d: Date | string | null) =>
  d instanceof Date ? d.toISOString().split("T")[0] : String(d).split("T")[0];
