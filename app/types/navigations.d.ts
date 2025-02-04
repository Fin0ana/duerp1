import { UrlObject } from "url";
import type { XOR } from "../modules/utils/types";
import React from "react";
Url;

export interface INavBarItem {
  label: string;
  icon: string;
  command?: () => void;
}

type TypicSideBarItem = {
  template?: undefined;
  label: string;
  icon?: string;
  isSubTitle?: boolean;
  items?: ISideBarItem[];
  numberBadge?: number;
  templateId?: string;
  additionnal?: { [key: string]: string };
  onContextMenu?: (s: MouseEvent<HTMLElement>) => void;
};

type TemplateSideBarItem = {
  template: React.JSX;
  label?: undefined;
  icon?: undefined;
  isSubTitle?: undefined;
  items?: undefined;
  numberBadge?: undefined;
  templateId?: undefined;
  additionnal?: undefined;
  onContextMenu?: (s: MouseEvent<HTMLElement>) => void;
};

export type ISideBarItem = (TypicSideBarItem | TemplateSideBarItem) &
  XOR<{ command?: () => void }, { link?: UrlObject | string }>; // link or command, not both

export type TBreadcrumb = { label: string; url: UrlObject | string };