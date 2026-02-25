export interface RoleInterface {
  id?: string;
  role?: string;
}

export interface RegionInterface {
  id?: string;
  name?: string;
}

export interface PlatForm {
  id?: string;
  name?: string;
}

export interface StructureInterface {
  id?: string;
  name?: string;
  district?: DistrictInterface;
  active?: boolean;
}

export interface DistrictInterface {
  id?: string;
  name?: string;
  region?: RegionInterface;
}

export interface UserInterface {
  name?: string;
  username?: string;
  phone?: string;
  password?: string;
  role?: number;
  regions?: number[];
  platforms?: number[];
}

export interface AccountInterface {
  role?: RoleInterface;
  user?: UserInterface;
  structures?: StructureInterface[];
  isActive?: boolean;
  id?: string;
}

export interface EquipmentInterface {
  id?: string;
  name?: string;
  intrants?: IntrantInterface[];
}

export interface IntrantInterface {
  id?: string;
  name?: string;
  code?: number;
  sku?: string;
  primary_sku?: string;
  intrantType: {
    id?: string;
    name?: string;
  };
  convertionFactor?: number;
  roundFactor?: number;
  otherFactor?: number;
}
