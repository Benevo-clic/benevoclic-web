export type VolunteerCreatePayload = {
  email: string
  firstName: string
  lastName: string
  phone: string
  bio: string
  city: string
  postalCode: string
  country: string
  birthDate: string
}

export type VolunteerCreateResponse = {
  volunteerId: string
  lastName: string
  firstName: string
}
