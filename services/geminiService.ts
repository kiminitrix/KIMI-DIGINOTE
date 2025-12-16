import { GoogleGenAI, Type } from "@google/genai";
import { FileData, PresentationData } from "../types";

// Schema definition matching the user's requirements strictly
const slideSchema = {
  type: Type.OBJECT,
  properties: {
    id: { type: Type.INTEGER, description: "Sequential ID of the slide" },
    type: {
      type: Type.STRING,
      enum: ["TitleSlide", "ContentWithImage", "BulletPoints", "SectionHeader", "Summary"],
      description: "The layout type of the slide."
    },
    content: {
      type: Type.OBJECT,
      properties: {
        title: { type: Type.STRING },
        subtitle: { type: Type.STRING, description: "Used for TitleSlide or SectionHeader" },
        points: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
          description: "Bullet points for content slides"
        },
        image_prompt: { type: Type.STRING, description: "Visual description for image generation if needed" },
        body: { type: Type.STRING, description: "Paragraph text if applicable" }
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
    You are an expert presentation designer.
    Analyze the attached document content.
    Extract the key information and structure it into a compelling slide deck.
    
    Guidelines:
    1. Create a logical flow: Title -> Introduction -> Key Points -> Conclusion.
    2. Summarize dense text into punchy bullet points.
    3. Suggest an image prompt for slides that need visuals.
    4. Ensure at least 5 slides are generated.
    5. Output STRICT JSON following the schema provided.
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
        temperature: 0.2, // Low temperature for consistent formatting
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
