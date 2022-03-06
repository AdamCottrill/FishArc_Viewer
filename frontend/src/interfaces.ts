export interface FilterButtonInterface {
  value: string;
  name: string;
}

export type filterType = string | string[];

// export interface FilterInterface {
//   [key: string];
//   value?: filterType;
// }

// export interface FilterSliceInterface {
//   [key: string];
//   value: filterType;
// }


export interface FilterInterface {
    [key: string]: filterType;
}

export interface FilterSliceInterface {
    [key: string]: filterType;
}


export interface FN011ListFilter extends FilterInterface {
  fof?: string[];
  prj_cd_suffix?: string[];
  prj_cd__like?: string;
  project_type?: string[];
  prj_nm__like?: string;
  prj_ldr__like?: string;
  years?: string[];
}

export interface FN121ListFilter extends FilterInterface {
  stratum__in?: string[];
  ssn?: string[];
  space?: string[];
  mode?: string[];
}

export interface FN123FN125ListFilter extends FN121ListFilter {
  sam__in?: string[];
  eff__in?: string[];
  grp__in?: string[];
  spc__in?: string[];
}
