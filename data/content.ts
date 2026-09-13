import { products } from './products';

export type Product = {
  id: string;
  name: string;
  slug: string;
  category: string;
  space: string;
  description: string;
  shortDescription: string;
  materials: string[];
  finish: string;
  dimensions: {
    width: string;
    depth: string;
    height: string;
  };
  images: string[];
  customizable: boolean;
  featured: boolean;
};

const images = {
  desk: 'https://images.pexels.com/photos/3847582/pexels-photo-3847582.jpeg?auto=compress&cs=tinysrgb&h=1200&w=1800',
  workspace: 'https://images.pexels.com/photos/8082224/pexels-photo-8082224.jpeg?auto=compress&cs=tinysrgb&h=1200&w=1800',
  dining: 'https://images.pexels.com/photos/7195900/pexels-photo-7195900.jpeg?auto=compress&cs=tinysrgb&h=1200&w=1800',
  conference: 'https://images.pexels.com/photos/9300726/pexels-photo-9300726.jpeg?auto=compress&cs=tinysrgb&h=1200&w=1800',
  office: 'https://images.pexels.com/photos/6794970/pexels-photo-6794970.jpeg?auto=compress&cs=tinysrgb&h=1200&w=1800',
  wood: 'https://images.pexels.com/photos/37178407/pexels-photo-37178407.jpeg?auto=compress&cs=tinysrgb&h=1200&w=1800',
};

export type Space = {
  slug: string;
  name: string;
  eyebrow: string;
  description: string;
  image: string;
  products: string[];
};

export const spaces: Space[] = [
  {
    slug: 'home',
    name: 'Home',
    eyebrow: '01 / HOME',
    description: 'Pieces designed around the way you live, from daily dining to the quiet corners you return to.',
    image: images.dining,
    products: [
      'Dark Walnut Gold Filigree Storage Bed',
      'White Gold Medallion Six-Door Wardrobe',
      'Six-Door Copper Brown Wardrobe',
    ],
  },
  {
    slug: 'office',
    name: 'Office',
    eyebrow: '02 / OFFICE',
    description: 'Furniture designed for the way your team works, with considered details that keep the day moving.',
    image: images.workspace,
    products: [
      'Slim Computer Desk',
      'Black Office Desk',
      'Pale Wood Office Desk',
    ],
  },
  {
    slug: 'corporate',
    name: 'Corporate',
    eyebrow: '03 / CORPORATE',
    description: 'A dependable furniture language for workplaces, meeting rooms and reception areas.',
    image: images.conference,
    products: [
      'Three-Tier Shelf Table',
      'Green Ornate Frame Table',
      'Woodgrain X-Frame Table',
    ],
  },
  {
    slug: 'school',
    name: 'School',
    eyebrow: '04 / SCHOOL',
    description: 'Built for daily use. Ready for every batch, every lesson and every shared space.',
    image: images.office,
    products: [
      'Pale Wood School Desk Set',
      'Blue Student Desk Unit',
      'Turquoise Frame School Bench',
    ],
  },
  {
    slug: 'institutional',
    name: 'Institutional',
    eyebrow: '05 / INSTITUTIONAL',
    description: 'Practical, durable furniture packages developed for the rhythm of institutions.',
    image: images.wood,
    products: [
      'Black Standard Bunk Bed',
      'Silver Arched Bunk Bed',
      'Gray Cafeteria Table Bench Set',
    ],
  },
];

export type Project = {
  slug: string;
  title: string;
  type: string;
  overview: string;
  image: string;
  scope: string[];
  materials: string[];
  gallery: string[];
};

export const projects: Project[] = [
  {
    slug: 'quiet-workplace',
    title: 'A quieter workplace',
    type: 'Corporate',
    overview: 'An editable sample project showing how a consistent furniture language can give a shared workplace more clarity.',
    image: images.workspace,
    scope: ['Workstations', 'Meeting table', 'Storage'],
    materials: ['Laminate', 'Metal', 'Upholstery'],
    gallery: [images.workspace, images.conference, images.wood],
  },
  {
    slug: 'the-open-classroom',
    title: 'The open classroom',
    type: 'School',
    overview: 'An editable sample project for learning environments where furniture needs to be clear, durable and ready to move with the day.',
    image: images.office,
    scope: ['Benches', 'Storage', 'Teacher desks'],
    materials: ['Wood', 'Laminate'],
    gallery: [images.office, images.dining, images.wood],
  },
  {
    slug: 'room-to-gather',
    title: 'Room to gather',
    type: 'Residential',
    overview: 'An editable sample project focused on warm proportions, honest materials and the everyday rituals around a dining table.',
    image: images.dining,
    scope: ['Dining table', 'Seating', 'Storage'],
    materials: ['Wood', 'Upholstery'],
    gallery: [images.dining, images.wood, images.workspace],
  },
];

export { products, images };
