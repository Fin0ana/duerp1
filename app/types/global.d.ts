// colors.ts
export type Color =
  | string
  | { hex: string }
  | { rgb: [number, number, number] }
  | { rgba: [number, number, number, number] }
  | { hsl: [number, string, string] }
  | { hsla: [number, string, string, number] };

export type StateToAction<T> = {
  [K in keyof T]: {
    type: K;
    payload: T[K];
  };
}[keyof T];

type IdName = {
  _id: string;
  name: string;
};
