// types/filter-announcement.ts

import type {Announcement} from "~/common/interface/event.interface";

export type PublicationInterval = '1h' | '5h' | '1d' | '1w' | '1M';
export type SortOption =
    | 'dateEvent_asc'
    | 'dateEvent_desc'
    | 'datePublication_desc';
export type AnnouncementStatus = 'ACTIVE' | 'INACTIVE' | 'COMPLETED';

export interface FilterAnnouncement {
    nameEvent?: string;
    description?: string;
    status?: AnnouncementStatus;
    hoursEventFrom?: string;
    hoursEventTo?: string;
    dateEventFrom?: string;
    dateEventTo?: string;
    publicationInterval?: PublicationInterval;
    datePublicationFrom?: string;
    datePublicationTo?: string;
    tags?: string[];
    associationName?: string;
    latitude?: number;
    longitude?: number;
    radius?: number;
    page?: number;
    limit?: number;
    sort?: SortOption;
    cityCoordinates?: Array<{
        lat: number;
        lon: number;
        name: string;
    }>;
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
