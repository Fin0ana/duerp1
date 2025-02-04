
import { SetA } from "jotai"
import { SetStateAction } from "jotai/vanilla";

export type KeyString<T = any> = { [key: string]: T };
type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

export type XOR<T, U> = T | U extends object
  ? (Without<T, U> & U) | (Without<U, T> & T)
  : T | U;

export type SetAtom<Args extends unknown[], Result> = (...args: Args) => Result;

export type GlobalAtomState<T extends unknown> = [
  T,
  SetAtom<[SetStateAction<T>], void>
];

