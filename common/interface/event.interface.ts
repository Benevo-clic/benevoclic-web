import { EventStatus } from '../enums/event.enum';

export interface Image {
  url: string;
  alt?: string;
}

export interface Location {
  address: string;
  city: string;
  postalCode: string;
  country: string;
  lat?: number;
  lng?: number;
}

export interface Announcement {
  id: string;
  description: string;
  datePublication: string;
  dateEvent: string;
  hoursEvent: string;
  nameEvent: string;
  tags?: string[];
  associationId: string;
  associationName: string;
  associationLogo?: Image;
  announcementImage?: Image;
  locationAnnouncement?: Location;
  maxParticipants: number;
  status: EventStatus;
  maxVolunteers: number;
} 