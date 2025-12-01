export type UserRole = 'customer' | 'admin';

export interface User {
  id: string;
  email: string;
  name: string;
  phone: string;
  avatar?: string;
  role: UserRole;
  addresses: Address[];
  createdAt: string;
}

export interface Address {
  id: string;
  label: string;
  recipientName: string;
  phone: string;
  street: string;
  district: string;
  city: string;
  province: string;
  postalCode: string;
  isDefault: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  phone: string;
  password: string;
}
