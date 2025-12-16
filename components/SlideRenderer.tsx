import React from 'react';
import { Slide, SlideType } from '../types';
import { TitleSlide } from './slides/TitleSlide';
import { ContentWithImage } from './slides/ContentWithImage';
import { BulletPoints } from './slides/BulletPoints';
import { SectionHeader } from './slides/SectionHeader';

interface SlideRendererProps {
  slide: Slide;
}

export const SlideRenderer: React.FC<SlideRendererProps> = ({ slide }) => {
  switch (slide.type) {
    case SlideType.TitleSlide:
      return <TitleSlide content={slide.content} />;
    case SlideType.ContentWithImage:
      return <ContentWithImage content={slide.content} />;
    case SlideType.BulletPoints:
    case SlideType.Summary: // Fallback to BulletPoints for Summary for now
      return <BulletPoints content={slide.content} />;
    case SlideType.SectionHeader:
      return <SectionHeader content={slide.content} />;
    default:
      return (
        <div className="flex items-center justify-center h-full text-slate-500">
          Unknown Slide Type: {slide.type}
        </div>
      );
  }
};
