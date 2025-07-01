
export interface InfoAssociation{
    id: string;
    name: string;
}

export interface AssociationVolunteerFollow {
    associationId: string;
    associationName: string;
}

export interface VolunteerInfo{
    volunteerId: string;
    bio?: string;
    city?: string;
    postalCode?: string;
    country?: string;
    birthDate?: string;
    firstName: string;
    lastName: string;
    phone?: string;
    myAssociations?: InfoAssociation[];
    myAssociationsWaiting?: InfoAssociation[];
}