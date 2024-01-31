export interface searchParamsI {
  limit?: string;
  search?: string;
}

export interface userDataI {
  first_name: string;
  last_name?: string;
  patronymic?: string;
  auth_origin_id: number;
  email: string;
  login: string;
  prefix?: string;
  suffix?: string;
  comment?: string;
  password: string;
  department_id: number;
}

export interface accessDataI {
  module_id: number;
  user_id?: number;
  group_id?: number;
}

export interface groupDataI {
  name: string;
  auth_origin_id: number;
  comment: string;
  description: string;
}

export interface moduleDataI {
  name: string;
  service_id: number;
}

export interface serviceDataI {
  name: string;
}

export interface authDataI {
  login: string;
  password: string;
}
