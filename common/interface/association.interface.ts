
export interface InfoVolunteer{
    id: string;
    name: string;
}

export interface AssociationInfo {
    associationId: string;
    associationName: string;
    bio: string;
    city: string;
    type: string;
    postalCode: string;
    country: string;
    phone: string;
    volunteers?: InfoVolunteer[];
    volunteersWaiting?: InfoVolunteer[];
}

export interface ApiResponseSubset {
    header: Header;
    etablissement: EtablissementSubset;
}

export interface Header {
    statut: number;
    message: string;
}

export interface EtablissementSubset {
    dateCreationEtablissement: string;
    uniteLegale: UniteLegaleSubset;
    adresseEtablissement: AdresseEtablissementSubset;
}

export interface UniteLegaleSubset {
    dateCreationUniteLegale: string;
    denominationUniteLegale: string;
}

export interface AdresseEtablissementSubset {
    typeVoieEtablissement: string;
    libelleVoieEtablissement: string;
    codePostalEtablissement: string;
    libelleCommuneEtablissement: string;
}
