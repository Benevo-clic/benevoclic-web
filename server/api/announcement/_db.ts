import { Announcement } from '~/common/interface/event.interface';
import { EventStatus } from '~/common/enums/event.enum';

export let mockAnnouncements: Announcement[] = [
  {
    id: '1',
    nameEvent: 'Nettoyage de plage à La Rochelle',
    description: 'Rejoignez-nous pour une journée de nettoyage sur la plage des Minimes. Gants et sacs fournis.',
    datePublication: new Date('2023-10-01').toISOString(),
    dateEvent: new Date('2023-10-25').toISOString(),
    hoursEvent: '09:00',
    tags: ['environnement', 'extérieur', 'convivial'],
    associationId: 'asso-123',
    associationName: 'Les Amis de la Mer',
    maxParticipants: 50,
    maxVolunteers: 30,
    status: EventStatus.PUBLISHED,
    locationAnnouncement: { address: 'Plage des Minimes', city: 'La Rochelle', postalCode: '17000', country: 'France' }
  },
  {
    id: '2',
    nameEvent: 'Collecte alimentaire pour les démunis',
    description: 'Nous organisons une collecte de denrées non périssables à l\'entrée du supermarché SuperU.',
    datePublication: new Date('2023-10-05').toISOString(),
    dateEvent: new Date('2023-11-10').toISOString(),
    hoursEvent: '10:00',
    tags: ['social', 'collecte', 'solidarité'],
    associationId: 'asso-123',
    associationName: 'Les Amis de la Mer',
    maxParticipants: 100,
    maxVolunteers: 15,
    status: EventStatus.PUBLISHED,
    locationAnnouncement: { address: '1 rue du Marché', city: 'Paris', postalCode: '75001', country: 'France' }
  },
  {
    id: '3',
    nameEvent: 'Atelier de réparation de vélos',
    description: 'Apprenez à réparer votre vélo avec nos experts. Outils fournis. Annulé pour cause de météo.',
    datePublication: new Date('2023-09-15').toISOString(),
    dateEvent: new Date('2023-09-30').toISOString(),
    hoursEvent: '14:00',
    tags: ['réparation', 'vélo', 'atelier'],
    associationId: 'asso-456',
    associationName: 'Vélo-Cité',
    maxParticipants: 20,
    maxVolunteers: 5,
    status: EventStatus.CANCELLED,
    locationAnnouncement: { address: 'Place de la Victoire', city: 'Bordeaux', postalCode: '33000', country: 'France' }
  },
    {
    id: '4',
    nameEvent: 'Visite aux personnes âgées',
    description: 'Nous cherchons des bénévoles pour passer du temps avec les résidents de la maison de retraite.',
    datePublication: new Date('2023-09-20').toISOString(),
    dateEvent: new Date('2023-10-15').toISOString(),
    hoursEvent: '15:00',
    tags: ['social', 'visite', 'seniors'],
    associationId: 'asso-123',
    associationName: 'Les Amis de la Mer',
    maxParticipants: 10,
    maxVolunteers: 10,
    status: EventStatus.DRAFT,
    locationAnnouncement: { address: '10 rue des Fleurs', city: 'Lyon', postalCode: '69002', country: 'France' }
  },
]; 