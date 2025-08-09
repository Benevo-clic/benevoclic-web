import type { LocationGeoJson } from '~/common/interface/event.interface'

export type FormFieldsVolunteer = {
  lastName: string;
  firstName: string;
  phone: string;
  birthDate: string;
  city: string;
  postalCode: string;
  bio: string;
  locationVolunteer?: LocationGeoJson;
};

export type FormFieldsAssociation = {
  associationName: string;
  phone: string;
  bio: string;
  city: string;
  postalCode: string;
  country?: string;
  type: string;
};

export type CreateAssociationDto = FormFieldsAssociation & {
  email: string;
};

export type CreateVolunteerDto = FormFieldsVolunteer & {
  email: string;
};
