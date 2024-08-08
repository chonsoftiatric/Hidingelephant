export const strWithoutLastWord = (str: string): string => {
  const words = str.split(" ");
  words.pop();
  const result = words.join(" ");
  return result;
};

type IDataArr = { label: string; name: string }[];
export const arrayToObj = (data: IDataArr) => {
  const obj: Record<string, string> = {};
  if (data.length === 0) return obj;
  for (const model of data) {
    obj[model.name] = model.label;
  }
  return obj;
};

export const getValueWithOneSpace = (value: string) => {
  return value.replace(/\s+/g, " ");
};
