export enum SlideType {
  TitleSlide = 'TitleSlide',
  ContentWithImage = 'ContentWithImage',
  BulletPoints = 'BulletPoints',
  SectionHeader = 'SectionHeader',
  Summary = 'Summary'
}

export interface SlideContent {
  title: string;
  subtitle?: string;
  points?: string[];
  image_prompt?: string;
  body?: string;
}

export interface Slide {
  id: number;
  type: SlideType;
  content: SlideContent;
}

export interface PresentationData {
  title: string;
  theme: string;
  slides: Slide[];
}

export interface FileData {
  name: string;
  type: string;
  data: string; // Base64
}
