

export type FormFieldsVolunteer = {
    lastName: string
    firstName: string
    phone: string
    birthDate: string
    city: string
    postalCode: string
    bio: string
}

export type FormFieldsAssociation = {
    associationName: string
    phone: string
    bio: string
    city: string
    postalCode: string
    country?: string
    type: string
}

export type CreateAssociationDto = FormFieldsAssociation & {
    email: string
}

export type CreateVolunteerDto = FormFieldsVolunteer & {
    email: string
}