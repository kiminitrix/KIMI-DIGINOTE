import { GoogleGenAI, Type } from "@google/genai";
import { FileData, PresentationData } from "../types";

// Schema definition matching the user's requirements strictly
const slideSchema = {
  type: Type.OBJECT,
  properties: {
    id: { type: Type.INTEGER, description: "Sequential ID of the slide" },
    type: {
      type: Type.STRING,
      enum: ["TitleSlide", "ContentWithImage", "BulletPoints", "SectionHeader", "Summary", "Graph"],
      description: "The layout type of the slide. Use 'Graph' when numerical data is present."
    },
    content: {
      type: Type.OBJECT,
      properties: {
        title: { type: Type.STRING },
        subtitle: { type: Type.STRING, description: "Used for TitleSlide or SectionHeader" },
        points: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
          description: "Detailed bullet points. Do not summarize excessively."
        },
        image_prompt: { type: Type.STRING, description: "Visual description for image generation if needed" },
        body: { type: Type.STRING, description: "Detailed paragraph text if applicable" },
        chart: {
          type: Type.OBJECT,
          properties: {
            type: { type: Type.STRING, enum: ['bar', 'line', 'pie'], description: "Best chart type for the data" },
            title: { type: Type.STRING, description: "Title of the chart" },
            labels: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Labels for X-axis or Segments" },
            data: { type: Type.ARRAY, items: { type: Type.NUMBER }, description: "Numerical values corresponding to labels" },
            dataLabel: { type: Type.STRING, description: "Name of the dataset (e.g., 'Revenue', 'Sales')" }
          },
          description: "Structure data here if slide type is Graph"
        }
      }
    }
  },
  required: ["id", "type", "content"]
};

const presentationSchema = {
  type: Type.OBJECT,
  properties: {
    title: { type: Type.STRING, description: "Overall title of the presentation" },
    theme: { type: Type.STRING, description: "Design theme suggestion" },
    slides: {
      type: Type.ARRAY,
      items: slideSchema,
      description: "List of slides in the presentation"
    }
  },
  required: ["title", "theme", "slides"]
};

export const generatePresentation = async (file: FileData): Promise<PresentationData> => {
  if (!process.env.API_KEY) {
    throw new Error("API Key is missing. Please check your environment configuration.");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const modelId = "gemini-2.5-flash"; // Excellent for document processing

  const prompt = `
    You are an expert presentation designer and data analyst.
    Analyze the attached document content.
    
    CRITICAL INSTRUCTIONS:
    1. **DATA ACCURACY**: You must retain 100% of the key information from the file. Do not over-simplify. If the source text is detailed, create multiple slides to cover the details rather than cutting content.
    2. **GRAPHS & CHARTS**: If the document contains CSV data, financial tables, or statistical lists, you MUST create 'Graph' slides. Visualize the numbers.
    3. **STRUCTURE**: Logical flow: Title -> Introduction -> Comprehensive Details (Chunked) -> Visual Data (Graphs) -> Conclusion.
    4. **CONTENT**: Use 'BulletPoints' for text lists, 'ContentWithImage' for conceptual sections, and 'Graph' for numerical data.
    
    Output STRICT JSON following the schema provided.
  `;

  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: [
        {
          role: 'user',
          parts: [
            { text: prompt },
            {
              inlineData: {
                mimeType: file.type,
                data: file.data
              }
            }
          ]
        }
      ],
      config: {
        responseMimeType: "application/json",
        responseSchema: presentationSchema,
        temperature: 0.1, // Very low temperature for high fidelity to source
      }
    });

    if (!response.text) {
      throw new Error("No response generated from Gemini.");
    }

    const data = JSON.parse(response.text);
    return data as PresentationData;

  } catch (error) {
    console.error("Gemini Generation Error:", error);
    throw error;
  }
};