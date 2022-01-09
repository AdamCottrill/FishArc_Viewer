export interface FilterButtonInterface {
  value: string;
  name: string;
}


export type filterType = string | string[];

export interface FilterInterface {
  key: string,
  value?: filterType
}


export interface FilterSliceInterface {
  key: string,
  value: filterType
}


export interface FN011ListFilter {
    prj_cd__like?: string;
    project_prefix?: string[];
    project_suffix?: string[];
    project_type?: string[];
    year__in?: string[];
    year__gte?: number;
    year__lte?: number;
}
