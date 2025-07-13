import { EventStatus } from '../enums/event.enum';

export interface Image {
  url: string;
  alt?: string;
}

export type InfoVolunteer = {
    id: string;
    name: string;
};

export interface Location {
  address: string;
  city: string;
  postalCode: string;
  country: string;
  lat?: number;
  lng?: number;
}

export interface Announcement {
  _id: string;
  description: string;
  datePublication: string;
  dateEvent: string;
  hoursEvent: string;
  nameEvent: string;
  tags?: string[];
  associationId: string;
  associationName: string;
  associationLogo?: string;
  announcementImage?: string;
  locationAnnouncement?: Location;
  participants?: InfoVolunteer[];
  nbParticipants?: number;
  maxParticipants: number;
  status: EventStatus;
  nbVolunteers?: number;
  maxVolunteers: number;
  isFavorite?: boolean;
  volunteers?: InfoVolunteer[];
  volunteersWaiting?: InfoVolunteer[];
}

export interface CreateAnnouncementDto {
    description: string;
    datePublication: string;
    dateEvent: string;
    hoursEvent: string;
    nameEvent: string;
    tags?: string[];
    associationId: string;
    associationName: string;
    locationAnnouncement?: Location;
    maxParticipants: number;
    status: EventStatus;
    maxVolunteers: number;
}

export interface FavoritesAnnouncement{
    volunteerId: string;
    announcementId: string;
}