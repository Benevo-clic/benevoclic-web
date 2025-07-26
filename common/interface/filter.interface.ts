// types/filter-announcement.ts

import type {Announcement} from "~/common/interface/event.interface";

export type PublicationInterval = '1h' | '5h' | '1d' | '1w' | '1M';
export type SortOption =
    | 'dateEvent_asc'
    | 'dateEvent_desc'
    | 'datePublication_desc';
export type AnnouncementStatus = 'ACTIVE' | 'INACTIVE' | 'COMPLETED';
export type AnnouncementState = 'NOW' | 'UPCOMING' | 'PAST' | 'ALL';

export interface BaseFilterAnnouncement {
    nameEvent?: string;
    description?: string;
    hoursEventFrom?: string;
    hoursEventTo?: string;
    dateEventFrom?: string;
    dateEventTo?: string;
    publicationInterval?: PublicationInterval;
    datePublicationFrom?: string;
    status?: AnnouncementStatus;
    datePublicationTo?: string;
    tags?: string[];
    page?: number;
    limit?: number;
    sort?: SortOption;
}

export interface FilterAnnouncement extends BaseFilterAnnouncement {
    associationName?: string;
    latitude?: number;
    longitude?: number;
    radius?: number;
    cityCoordinates?: Array<{
        lat: number;
        lon: number;
        name: string;
    }>;
}

export interface FilterAssociationAnnouncement extends BaseFilterAnnouncement {
    associationId: string;
    stateEvent?: AnnouncementState;
    sort?: SortOption;
}
export interface FilterAnnouncementResponse {
    annonces: Announcement[];
    meta: {
        page: number;
        limit: number;
        total: number;
        pages: number;
    };
}
