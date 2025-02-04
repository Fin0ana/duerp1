import { TreeNode } from "primereact/treenode";
import { KeyString } from "../modules/utils/types";
import { deepStrictEqual } from "assert";

export function parse<T>(string: unknown): T | KeyString {
  if (!string || typeof string !== "string") return {};
  try {
    const response = JSON.parse(string);
    return response;
  } catch (error) {
    return {};
  }
}

export function isArray(el: unknown): el is any[] {
  if (typeof el === "object" && Array.isArray(el)) return true;
  return false;
}

export function groupBy<T extends KeyString>(
  array: T[],
  key: keyof T
): Record<string, T[]> {
  return array.reduce((acc, item) => {
    const groupKey = item[key];
    if (!acc[groupKey]) {
      acc[groupKey] = [];
    }
    acc[groupKey].push(item);
    return acc;
  }, {} as Record<string, T[]>);
}

export function groupBy2<T extends KeyString>(
  array: T[],
  level1: keyof T,
  level2: keyof T
) {
  var people = array,
    groups = [level1, level2],
    grouped: any = {};
  people.forEach(function (a) {
    groups
      .reduce(function (o, g, i) {
        // take existing object,
        o[a[g]] = o[a[g]] || (i + 1 === groups.length ? [] : {}); // or generate new obj, or
        return o[a[g]]; // at last, then an array
      }, grouped)
      .push(a);
  });
  return grouped;
}

type Grouped<T> = { [key: string]: Grouped<T> | T[] };

export function groupByN<T extends Record<string, any>>(
  array: T[],
  keys: (keyof T)[]
): Grouped<T> | T[] {
  if (keys.length === 0) return array;

  const [firstKey, ...restKeys] = keys;

  const grouped = array.reduce((result, currentItem) => {
    const groupKey = String(currentItem[firstKey]);

    if (!result[groupKey]) {
      result[groupKey] = [];
    }

    result[groupKey].push(currentItem);

    return result;
  }, {} as { [key: string]: T[] });

  if (restKeys.length === 0) {
    return grouped;
  }

  return Object.keys(grouped).reduce((result, key) => {
    result[key] = groupByN(grouped[key], restKeys);
    return result;
  }, {} as Grouped<T>);
}

export function groupBySimpN<T extends Record<string, any>>(
  input: T[],
  keys: (keyof T)[]
): any {
  if (keys.length === 0) return input;
  const key1 = keys[0];
  return input.reduce((acc, curr, id, self) => {
    if (!curr[key1]) return groupBySimpN(self, keys.slice(1));
    const trueCurr = self.filter((e) => e[key1] === curr[key1]);
    acc = { ...acc, [curr[key1]]: groupBySimpN(trueCurr, keys.slice(1)) };
    return acc;
  }, {});
}

export function arrayIncludesArray<T>(mainArray: T[], subArray: T[]): boolean {
  return subArray.every((element) => mainArray.includes(element));
}

export function diffArrays<T>(
  initial: T[],
  final: T[]
): { added: T[]; removed: T[] } {
  // Deep equal

  const added = final.filter(
    (item) => !initial.some((initItem) => deepEqual(initItem, item))
  );
  const removed = initial.filter(
    (item) => !final.some((finalItem) => deepEqual(finalItem, item))
  );

  // JSON equal
  // const added = final.filter(
  //   (item) =>
  //     !initial
  //       .map((init) => JSON.stringify(init))
  //       .includes(JSON.stringify(item))
  // );
  // const removed = initial.filter(
  //   (item) =>
  //     !final.map((fin) => JSON.stringify(fin)).includes(JSON.stringify(item))
  // );

  return { added, removed };
}

export function diffArraysWithUpdate<T>(
  initial: T[],
  final: T[],
  key: keyof T
): { added: T[]; removed: T[]; updated: { [K in keyof T]?: T[K] }[] } {
  const added = final.filter(
    (item) => !initial.some((initItem) => deepEqual(initItem[key], item[key]))
  );
  const removed = initial.filter(
    (item) => !final.some((finalItem) => deepEqual(finalItem[key], item[key]))
  );

  const updated = final
    .map((item) => {
      const correspondingItem = initial.find((initItem) =>
        deepEqual(initItem[key], item[key])
      );
      if (correspondingItem && !deepEqual(correspondingItem, item)) {
        const changes: { [K in keyof T]?: T[K] } = {};
        for (let field in item) {
          if (!deepEqual(correspondingItem[field], item[field])) {
            changes[field] = item[field];
          }
        }
        return { [key]: item[key], ...changes };
      }
      return null;
    })
    .filter((item) => item !== null) as { [K in keyof T]?: T[K] }[];

  return { added, removed, updated };
}

export function deepEqual(obj1: any, obj2: any) {
  if (obj1 === obj2) return true;
  if (typeof obj1 !== "object" || typeof obj2 !== "object") return false;

  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);

  if (keys1.length !== keys2.length) return false;

  for (let key of keys1) {
    if (!keys2.includes(key) || !deepEqual(obj1[key], obj2[key])) return false;
  }

  return true;
}

export function deepEqualFromAssert(obj1: any, obj2: any): boolean {
  try {
    deepStrictEqual(obj1, obj2);
    return true;
  } catch (error) {
    return false;
  }
}

export function getDepth(
  obj: Record<string, any>[],
  childrenKey: string = "children",
  depth: number = 0
): number {
  if (!obj.length) return depth;
  return Math.max(
    ...obj.map((node) =>
      node[childrenKey]
        ? getDepth(node[childrenKey], childrenKey, depth + 1)
        : depth
    )
  );
}

export function removeAOODuplicate<T>(arr: T[], compareKey: keyof T) {
  const outPut: T[] = [];
  arr.forEach((item) => {
    if (outPut.some((s) => item[compareKey] === s[compareKey])) return;

    outPut.push(item);
  });
  return outPut;
}
/**
 * Replace an element within the recursive tree node
 * @param array Array to replace
 * @param targetKey key of the replacer index
 * @param targetValue value of the replacer index
 * @param newElement new element to replace
 * @returns 
 */
export function replaceElementInRecursiveArray<T>(
  array: TreeNode[],
  targetKey: keyof T,
  targetValue: any,
  newElement: TreeNode | ((currentNode: TreeNode, index: number) => TreeNode)
): TreeNode[] {
  // Helper function to recursively clone and replace
  const replaceRecursive = (arr: TreeNode[]): TreeNode[] => {
    return arr.map((item, id) => {
      // If the item has the target key and matches the value, replace it with newElement
      if ((item as any)[targetKey] === targetValue) {
        return typeof newElement === "function"
          ? { ...newElement(item, id) }
          : { ...newElement };
      }

      // Otherwise, check its children
      if (item.children) {
        return {
          ...item,
          children: replaceRecursive(item.children),
        };
      }

      return { ...item };
    });
  };

  return replaceRecursive(array);
}



