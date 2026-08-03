export interface Address {
  addressId?: number;
  userId?: number;

  firstName: string;
  lastName: string;
  phoneNumber: string;

  country: string;
  county: string;
  city: string;
  addressLine: string;
  postalCode?: string;

  isDefault?: boolean;
}
