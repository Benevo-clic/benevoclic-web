export const mockAssociations = [
  {
    associationId: 'a1',
    associationName: 'Solidarité Paris',
    bio: 'Aide alimentaire à Paris',
    city: 'Paris',
    type: 'Humanitaire',
    postalCode: '75000',
    country: 'France',
    phone: '0102030405',
    volunteers: [
      { id: 'v1', name: 'Alice' },
      { id: 'v2', name: 'Bob' }
    ],
    volunteersWaiting: [{ id: 'v3', name: 'Eve' }]
  },
  {
    associationId: 'a2',
    associationName: 'Tech4All',
    bio: 'Initiation au numérique',
    city: 'Lyon',
    type: 'Éducation',
    postalCode: '69000',
    country: 'France',
    phone: '0607080910',
    volunteers: [{ id: 'v4', name: 'Lucas' }],
    volunteersWaiting: []
  }
]
