const isEqualArrayContent = (arr1: Array<string | number>, arr2: Array<string | number>, enforceOrder: boolean = false) => {
  const vKey = (i: string | number, v: string | number) => {
    return (enforceOrder ? `${i}-` : "") + `${typeof v}-${v}`;
  };

  if (arr1.length !== arr2.length) return false;

  const d1 = {};
  const d2 = {};
  for (let i = arr1.length - 1; i >= 0; i--) {
    d1[vKey(i, arr1[i])] = true;
    d2[vKey(i, arr2[i])] = true;
  }

  for (let i = arr1.length - 1; i >= 0; i--) {
    const v = vKey(i, arr1[i]);
    if (d1[v] !== d2[v]) return false;
  }

  for (let i = arr2.length - 1; i >= 0; i--) {
    const v = vKey(i, arr2[i]);
    if (d1[v] !== d2[v]) return false;
  }

  return true;
};

const delay = (label: string, callback: Function, time: number = 500) => {
  if (typeof window.delayed_methods == "undefined") {
    window.delayed_methods = {};
  }
  window.delayed_methods[label] = Date.now();
  const t = window.delayed_methods[label];
  setTimeout(function () {
    if (window.delayed_methods[label] != t) {
      return;
    } else {
      window.delayed_methods[label] = "";
      callback();
    }
  }, time);
};

export { isEqualArrayContent, delay };
