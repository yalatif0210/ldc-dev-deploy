export const frenchDate = (date: string) => {
  const splitedDate = date.split('-');
  return `${splitedDate[2]}-${splitedDate[1]}-${splitedDate[0]}`;
};

export const englishDate = (date: string) => {
  const splitedDate = date.split('/');
  return `${splitedDate[2]}-${splitedDate[1]}-${splitedDate[0]}`;
};

export const englishFromFrenchDate = (date: string) => {
  const splitedDate = date.split('-');
  return `${splitedDate[2]}-${splitedDate[1]}-${splitedDate[0]}`;
};

export const frenchDateToEnglishDate = (date: string) => {
  const splitedDate = date.split('-');
  return `${splitedDate[2]}/${splitedDate[1]}/${splitedDate[0]}`;
};

export const englishDateToFrenchDate = (date: string) => {
  const splitedDate = date.split('/');
  return `${splitedDate[2]}-${splitedDate[1]}-${splitedDate[0]}`;
};

export const compareDates = (date1: string, date2: string): boolean => {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  return d1 >= d2;
};
