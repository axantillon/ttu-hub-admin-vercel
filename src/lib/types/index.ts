export enum NavPath {
  DASHBOARD = "/",
  LOGIN = "/login",
  ORGS = "/orgs",
  EVENTS = "/events",
  USERS = "/users",
}

export enum DegreeKeys {
  CS = "CS",
  EE = "EE",
  IE = "IE",
  MATH = "MATH",
  RHIM = "RHIM",
  RETAIL = "RETAIL",
  BUSINESS = "BUSINESS",
  STAFF = "STAFF",
  NONE = "NONE",
}

export type Degree = {
  name: string;
  value: DegreeKeys;
  color: string;
};

export enum OrgCategories {
  ACADEMIC = "ACADEMIC",
  TECHNOLOGY = "TECHNOLOGY",
  SERVICE = "SERVICE",
}