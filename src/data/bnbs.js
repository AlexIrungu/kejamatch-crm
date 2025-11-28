// src/data/bnbs.js - Dedicated data file for BNB listings

export const bnbListings = [
  {
    id: 1,
    title: 'Cozy Studio in Karen',
    location: 'Karen, Nairobi',
    coordinates: { lat: -1.3194, lng: 36.7085 },
    price: 3500,
    rating: 4.8,
    reviews: 124,
    maxGuests: 2,
    beds: 1,
    baths: 1,
    images: [
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800',
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800',
      'https://images.unsplash.com/photo-1586105251261-72a756497a11?w=800',
      'https://images.unsplash.com/photo-1562663474-6cbb3eaa4d14?w=800'
    ],
    amenities: ['WiFi', 'Kitchen', 'AC', 'Parking', 'Pool'],
    description: 'Beautiful studio apartment in the serene Karen area. Perfect for couples or solo travelers seeking tranquility and comfort.',
    host: {
      name: 'Grace Mwangi',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150',
      rating: 4.9,
      verified: true,
      superhost: true,
      responseTime: '1 hour',
      joinedYear: 2019,
      totalProperties: 3,
      languages: ['English', 'Swahili']
    },
    instantBook: true,
    propertyType: 'Studio',
    cancellationPolicy: 'Flexible',
    checkInTime: '15:00',
    checkOutTime: '11:00',
    houseRules: [
      'No smoking',
      'No pets allowed',
      'No parties or events',
      'Quiet hours: 10 PM - 7 AM'
    ],
    nearbyAttractions: [
      { name: 'Karen Blixen Museum', distance: '2.5 km' },
      { name: 'Giraffe Centre', distance: '3.1 km' },
      { name: 'Karen Country Club', distance: '1.8 km' },
      { name: 'Junction Mall', distance: '4.2 km' }
    ],
    availabilityCalendar: {
      // This would typically come from a booking system
      unavailableDates: ['2024-01-15', '2024-01-16', '2024-02-01']
    }
  },
  {
    id: 2,
    title: 'Modern 2BR Apartment - Kilimani',
    location: 'Kilimani, Nairobi',
    coordinates: { lat: -1.2921, lng: 36.7857 },
    price: 6000,
    rating: 4.6,
    reviews: 87,
    maxGuests: 4,
    beds: 2,
    baths: 2,
    images: [
      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800',
      'https://images.unsplash.com/photo-1560448204-61dc36dc98c8?w=800',
      'https://images.unsplash.com/photo-1574691250077-03a929faece5?w=800'
    ],
    amenities: ['WiFi', 'Kitchen', 'AC', 'Gym', 'Security'],
    description: 'Spacious modern apartment in the heart of Kilimani with great city views and premium amenities. Close to shopping and entertainment.',
    host: {
      name: 'David Ochieng',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
      rating: 4.7,
      verified: true,
      superhost: false,
      responseTime: '2 hours',
      joinedYear: 2020,
      totalProperties: 2,
      languages: ['English', 'Swahili', 'French']
    },
    instantBook: false,
    propertyType: 'Apartment',
    cancellationPolicy: 'Moderate',
    checkInTime: '16:00',
    checkOutTime: '10:00',
    houseRules: [
      'No smoking indoors',
      'Pets allowed with prior approval',
      'No loud music after 9 PM',
      'Maximum 4 guests'
    ],
    nearbyAttractions: [
      { name: 'Yaya Centre', distance: '1.2 km' },
      { name: 'Kilimani Market', distance: '800 m' },
      { name: 'ABC Place', distance: '2.1 km' },
      { name: 'Uhuru Park', distance: '3.5 km' }
    ]
  },
  {
    id: 3,
    title: 'Luxury Villa with Pool - Runda',
    location: 'Runda, Nairobi',
    coordinates: { lat: -1.2107, lng: 36.7622 },
    price: 12000,
    rating: 4.9,
    reviews: 156,
    maxGuests: 8,
    beds: 4,
    baths: 3,
    images: [
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800',
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800'
    ],
    amenities: ['WiFi', 'Kitchen', 'Pool', 'Garden', 'Parking', 'Security'],
    description: 'Stunning luxury villa perfect for families or groups. Private pool, beautiful garden setting, and premium amenities throughout.',
    host: {
      name: 'Sarah Kimani',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150',
      rating: 4.9,
      verified: true,
      superhost: true,
      responseTime: '30 minutes',
      joinedYear: 2018,
      totalProperties: 5,
      languages: ['English', 'Swahili', 'German']
    },
    instantBook: true,
    propertyType: 'Villa',
    cancellationPolicy: 'Strict',
    checkInTime: '15:00',
    checkOutTime: '12:00',
    houseRules: [
      'No smoking anywhere on property',
      'No pets allowed',
      'Pool supervision required for children',
      'Respect neighbors - quiet after 10 PM'
    ],
    nearbyAttractions: [
      { name: 'Runda Mall', distance: '1.5 km' },
      { name: 'Ridgeways Mall', distance: '3.2 km' },
      { name: 'UN Offices', distance: '2.8 km' },
      { name: 'Karura Forest', distance: '4.1 km' }
    ]
  },
  {
    id: 4,
    title: 'Beachfront Cottage - Diani',
    location: 'Diani Beach, Kwale',
    coordinates: { lat: -4.2954, lng: 39.5751 },
    price: 8500,
    rating: 4.7,
    reviews: 203,
    maxGuests: 6,
    beds: 3,
    baths: 2,
    images: [
      'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800',
      'https://images.unsplash.com/photo-1540541338287-41700207dee6?w=800',
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800'
    ],
    amenities: ['WiFi', 'Kitchen', 'Beach Access', 'BBQ', 'Garden'],
    description: 'Wake up to ocean views in this charming beachfront cottage. Direct beach access, perfect for water sports and relaxation.',
    host: {
      name: 'Omar Hassan',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
      rating: 4.8,
      verified: true,
      superhost: true,
      responseTime: '1 hour',
      joinedYear: 2017,
      totalProperties: 4,
      languages: ['English', 'Swahili', 'Arabic']
    },
    instantBook: false,
    propertyType: 'Cottage',
    cancellationPolicy: 'Moderate',
    checkInTime: '14:00',
    checkOutTime: '11:00',
    houseRules: [
      'No smoking indoors',
      'Beach equipment available',
      'Respect marine life',
      'Clean up after beach visits'
    ],
    nearbyAttractions: [
      { name: 'Diani Beach', distance: '0 km' },
      { name: 'Colobus Conservation', distance: '1.5 km' },
      { name: 'Kongo Mosque', distance: '2.1 km' },
      { name: 'Shimba Hills Reserve', distance: '15 km' }
    ]
  },
  {
    id: 5,
    title: 'City Penthouse - Westlands',
    location: 'Westlands, Nairobi',
    coordinates: { lat: -1.2676, lng: 36.8108 },
    price: 9500,
    rating: 4.8,
    reviews: 92,
    maxGuests: 6,
    beds: 3,
    baths: 2,
    images: [
      'https://images.unsplash.com/photo-1560448204-603b3fc33ddc?w=800',
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800',
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800'
    ],
    amenities: ['WiFi', 'Kitchen', 'AC', 'Gym', 'Rooftop Terrace', 'Concierge'],
    description: 'Stunning penthouse with panoramic city views. Located in the heart of Westlands business district with premium amenities.',
    host: {
      name: 'Michael Wanjiku',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
      rating: 4.9,
      verified: true,
      superhost: true,
      responseTime: '45 minutes',
      joinedYear: 2019,
      totalProperties: 2,
      languages: ['English', 'Swahili']
    },
    instantBook: true,
    propertyType: 'Penthouse',
    cancellationPolicy: 'Moderate',
    checkInTime: '15:00',
    checkOutTime: '11:00',
    houseRules: [
      'No smoking',
      'No pets',
      'Maximum occupancy strictly enforced',
      'Quiet hours: 9 PM - 8 AM'
    ],
    nearbyAttractions: [
      { name: 'Westgate Mall', distance: '500 m' },
      { name: 'Sarit Centre', distance: '1.2 km' },
      { name: 'ABC Place', distance: '2.1 km' },
      { name: 'UN Offices', distance: '1.8 km' }
    ]
  }
];

export const amenityCategories = {
  basics: ['WiFi', 'Kitchen', 'AC', 'Heating'],
  facilities: ['Pool', 'Gym', 'Parking', 'Garden'],
  services: ['Security', 'Concierge', 'Cleaning', 'Laundry'],
  entertainment: ['TV', 'Sound System', 'Game Room', 'Library'],
  outdoors: ['BBQ', 'Beach Access', 'Balcony', 'Rooftop Terrace']
};

export const propertyTypes = ['Studio', 'Apartment', 'House', 'Villa', 'Cottage', 'Penthouse'];

export const searchBnbs = (filters) => {
  return bnbListings.filter(bnb => {
    // Location filter
    if (filters.location && !bnb.location.toLowerCase().includes(filters.location.toLowerCase()) &&
        !bnb.title.toLowerCase().includes(filters.location.toLowerCase())) {
      return false;
    }

    // Guest count
    if (filters.guests && bnb.maxGuests < filters.guests) {
      return false;
    }

    // Price range
    if (filters.priceRange && (bnb.price < filters.priceRange[0] || bnb.price > filters.priceRange[1])) {
      return false;
    }

    // Property types
    if (filters.propertyTypes && filters.propertyTypes.length > 0 && 
        !filters.propertyTypes.includes(bnb.propertyType)) {
      return false;
    }

    // Amenities
    if (filters.amenities && filters.amenities.length > 0 && 
        !filters.amenities.every(amenity => bnb.amenities.includes(amenity))) {
      return false;
    }

    // Rating
    if (filters.rating && bnb.rating < filters.rating) {
      return false;
    }

    // Instant book
    if (filters.instantBook && !bnb.instantBook) {
      return false;
    }

    return true;
  });
};

export const getBnbById = (id) => {
  return bnbListings.find(bnb => bnb.id === parseInt(id));
};

export const formatBnbPrice = (price) => {
  if (price >= 1000) {
    return `KES ${(price / 1000).toFixed(price % 1000 === 0 ? 0 : 1)}K`;
  }
  return `KES ${price.toLocaleString()}`;
};