export enum SlideType {
  TitleSlide = 'TitleSlide',
  ContentWithImage = 'ContentWithImage',
  BulletPoints = 'BulletPoints',
  SectionHeader = 'SectionHeader',
  Summary = 'Summary',
  Graph = 'Graph'
}

export interface ChartData {
  type: 'bar' | 'line' | 'pie';
  title: string;
  labels: string[]; // X-axis categories
  data: number[];   // Y-axis values
  dataLabel: string; // Label for the dataset
}

export interface SlideContent {
  title: string;
  subtitle?: string;
  points?: string[];
  image_prompt?: string;
  body?: string;
  chart?: ChartData;
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