export {filterOutNulls, arrayIncludesArray, arraysEqual, setIncludesArray, isEmpty, hasOnlyNulls};

function filterOutNulls(array: any[]): number[] {
    let filteredOut = [];
    for (let element of array) {
      if (element) {
        filteredOut.push(element);
      }
    }
    return filteredOut;
  }
  
  function arrayIncludesArray (searched: any[], array: any[]): boolean {
    let flag = true;
  
    for (let i = 0; i < array.length; i++) {
      if (!searched.includes(array[i])) {
        flag = false;
      }
    }
    return flag;
  }
  
  function arraysEqual(array1: any[], array2: any[]): boolean {
    if (array1.length !== array2.length) {
      return false
    }
    array1.sort((a, b) => a - b);
    array2.sort((a, b) => a - b);
  
    for (let i = 0; i < array1.length; i++) {
      if (array1[i] !== array2[i]) {
        return false
      }
    }
    return true;
  }
  
  function setIncludesArray(set: Set<any>, array: any[]): boolean {
    let flag = true;
  
    array.forEach((key) => {
        if (!set.has(key)) {
            flag = false;
        }
    })
    return flag;
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
    return new Promise((resolve) => setTimeout(resolve, ms))
  }