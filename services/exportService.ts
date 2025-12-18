import PptxGenJS from "pptxgenjs";
import { PresentationData, SlideType } from "../types";

export const exportPresentation = async (data: PresentationData) => {
  const pptx = new PptxGenJS();

  pptx.layout = "LAYOUT_16x9";
  pptx.title = data.title;
  pptx.author = "KIMI DIGINOTE";
  pptx.company = "KIMI DIGINOTE";

  // Common styles
  const bgDark = { color: "0F172A" }; // Slate 900
  const textWhite = { color: "FFFFFF" };
  const textMuted = { color: "94A3B8" }; // Slate 400
  
  for (const [index, slide] of data.slides.entries()) {
    const slidePage = pptx.addSlide();
    
    // Default background
    slidePage.background = bgDark;

    // Add footer/slide number
    slidePage.addText(`${index + 1}`, { 
        x: "95%", y: "92%", w: "5%", h: 0.3, 
        fontSize: 10, color: "64748B", align: "right"
    });

    switch (slide.type) {
      case SlideType.TitleSlide:
        slidePage.addText("PRESENTATION", {
            x: 0, y: 1.5, w: "100%", h: 0.5,
            fontSize: 14, color: "3B82F6", align: "center", bold: true, charSpacing: 3
        });
        slidePage.addText(slide.content.title, {
          x: 0.5, y: 2.2, w: "90%", h: 2,
          fontSize: 44, bold: true, align: "center", ...textWhite
        });
        if (slide.content.subtitle) {
          slidePage.addText(slide.content.subtitle, {
            x: 1, y: 4.5, w: "80%", h: 1,
            fontSize: 24, align: "center", ...textMuted
          });
        }
        break;

      case SlideType.SectionHeader:
        slidePage.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: "100%", h: "100%", fill: "0F172A" });
        // Decorative line
        slidePage.addShape(pptx.ShapeType.line, { x: 4.5, y: 2.5, w: 1, h: 0, line: { color: "3B82F6", width: 3 } });
        
        slidePage.addText(slide.content.title, {
          x: 0, y: 3, w: "100%", h: 1.5,
          fontSize: 40, bold: true, align: "center", color: "A78BFA"
        });
        if (slide.content.subtitle) {
             slidePage.addText(slide.content.subtitle, {
                x: 0, y: 4.5, w: "100%", h: 0.5,
                fontSize: 18, align: "center", italic: true, ...textMuted
             });
        }
        break;

      case SlideType.Graph:
        if (slide.content.chart) {
            slidePage.addText(slide.content.title, {
                x: 0.5, y: 0.5, w: "90%", h: 1,
                fontSize: 32, bold: true, ...textWhite
            });

            const chartData = [
                {
                    name: slide.content.chart.dataLabel,
                    labels: slide.content.chart.labels,
                    values: slide.content.chart.data
                }
            ];

            let chartType = pptx.ChartType.bar;
            if (slide.content.chart.type === 'line') chartType = pptx.ChartType.line;
            if (slide.content.chart.type === 'pie') chartType = pptx.ChartType.pie;

            slidePage.addChart(chartType, chartData, { 
                x: 0.5, y: 1.8, w: 9, h: 5,
                showLegend: true,
                legendPos: 'r',
                showTitle: false,
                chartColors: ['3B82F6', '8B5CF6', 'F43F5E', '10B981', 'F59E0B', '6366F1'],
                chartColorsOpacity: 80
            });
            
            if (slide.content.body) {
                slidePage.addText(slide.content.body, {
                    x: 0.5, y: 6.9, w: "90%", h: 0.5,
                    fontSize: 12, color: "94A3B8"
                });
            }
        }
        break;

      case SlideType.ContentWithImage:
        // Title
        slidePage.addText(slide.content.title, {
          x: 0.5, y: 0.5, w: "45%", h: 1,
          fontSize: 28, bold: true, ...textWhite
        });

        // Points
        if (slide.content.points) {
          slidePage.addText(slide.content.points.map(p => ({ text: p, options: { breakLine: true } })), {
            x: 0.5, y: 1.8, w: "45%", h: 5,
            fontSize: 14, color: "CBD5E1", bullet: { type: 'oval', color: "3B82F6" }, lineSpacing: 28
          });
        }

        // Image
        const imageUrl = slide.content.image_prompt 
             ? `https://picsum.photos/800/800?random=${index}` 
             : 'https://picsum.photos/800/800';
             
        slidePage.addImage({
            path: imageUrl,
            x: "53%", y: 0, w: "47%", h: "100%"
        });
        break;

      case SlideType.BulletPoints:
      case SlideType.Summary:
      default:
        // Background decoration
        slidePage.addShape(pptx.ShapeType.ellipse, { x: 8, y: -2, w: 6, h: 6, fill: { color: "1E293B" } });

        // Title
        slidePage.addText(slide.content.title, {
          x: 0.5, y: 0.5, w: "90%", h: 1,
          fontSize: 32, bold: true, ...textWhite
        });
        
        // Content
        if (slide.content.points) {
            slidePage.addText(slide.content.points.map(p => ({ text: p, options: { breakLine: true } })), {
                x: 0.5, y: 1.8, w: "90%", h: 5,
                fontSize: 18, color: "CBD5E1", bullet: { type: 'number', color: "3B82F6" }, lineSpacing: 35
            });
        } else if (slide.content.body) {
            slidePage.addText(slide.content.body, {
                x: 0.5, y: 1.8, w: "90%", h: 5,
                fontSize: 18, color: "CBD5E1"
            });
        }
        break;
    }
  }

  await pptx.writeFile({ fileName: `${data.title.replace(/[^a-z0-9]/gi, '_')}.pptx` });
};