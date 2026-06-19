const aidCategory: Record<string, string> = {
  Food: "غذائي",
  Medical: "طبي",
  Financial: "مالي",
  Clothing: "ملابس",
  Shelter: "مأوى",
  Educational: "تعليمي",
};

const dictionary: Record<string, string> = {
  ...aidCategory
};

export const useTranslate = () => {
  const translate = (text: string): string => {
    return dictionary[text] ?? text;
  };

  return { translate };
};