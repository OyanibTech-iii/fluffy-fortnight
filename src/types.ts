export interface CarouselImageItem {
  id: string;
  model: string;
  name: string;
  tagline: string;
  description: string;
  edition: string;
  scale: string;
  src: string;
  bg: string;
  panel: string;
}

export type CarouselRole = 'center' | 'left' | 'right' | 'back';
