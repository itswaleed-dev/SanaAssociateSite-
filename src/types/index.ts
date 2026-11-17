export interface Project {
  id: string; title: string; category: 'Architecture' | 'Interior' | 'Exterior';
  location: string; year: number; description: string;
  coverImage: string; images: string[]; featured: boolean;
}
