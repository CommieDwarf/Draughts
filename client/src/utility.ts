export {
  filterOutNulls,
  arrayIncludesArray,
  arraysEqual,
  setIncludesArrayElements,
  isEmpty,
  hasOnlyNulls,
};

function filterOutNulls<T>(array: T[]): T[] {
  return array.filter((e) => Boolean(e));
}

function arrayIncludesArray<T>(searched: T[], array: T[]): boolean {
  let flag = true;

  for (let i = 0; i < array.length; i++) {
    if (!searched.includes(array[i])) {
      flag = false;
    }
  }
  return flag;
}

function arraysEqual(array1: number[], array2: number[]): boolean {
  if (array1.length !== array2.length) {
    return false;
  }
  array1.sort((a, b) => a - b);
  array2.sort((a, b) => a - b);

  for (let i = 0; i < array1.length; i++) {
    if (array1[i] !== array2[i]) {
      return false;
    }
  }
  return true;
}

function setIncludesArrayElements<T>(set: Set<T>, array: T[]): boolean {
  return array.every((el: T) => Array.from(set).includes(el));
}

function isEmpty(array: any[]) {
  return array.length == 0;
}
function hasOnlyNulls(array: any) {
  return array.some((element: any) => {
    return element;
  });
}

export function filterEverySecondElement(array: any[]) {
  let arr = [];
  for (let i = 0; i < array.length; i += 2) {
    arr.push(array[i]);
  }
  return arr;
}

export function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
