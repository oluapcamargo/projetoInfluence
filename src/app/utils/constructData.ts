export const constructData = (data: any[]) => {
  const arrayAux = [];
  for (const [i, item] of data.entries()) {
    const a = {
      data: item
    };
    arrayAux.push(a);
  }
  return arrayAux;
};
