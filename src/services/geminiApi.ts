/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function analyzeProjectScope(idea: string) {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `You are an expert engineering project evaluator. Evaluate this final year engineering project idea and return ONLY a valid JSON object.
    
    Project idea: ${idea}
    
    Required JSON structure:
    {
      "feasibility": number (0-10),
      "novelty": number (0-10),
      "industryRelevance": number (0-10),
      "publishability": number (0-10),
      "feasibilityReason": "string (max 15 words)",
      "noveltyReason": "string (max 15 words)",
      "industryRelevanceReason": "string (max 15 words)",
      "publishabilityReason": "string (max 15 words)",
      "overallVerdict": "string (max 25 words)",
      "alternativeIdeas": ["string (max 20 words)", "string (max 20 words)", "string (max 20 words)"]
    }`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          feasibility: { type: Type.NUMBER },
          novelty: { type: Type.NUMBER },
          industryRelevance: { type: Type.NUMBER },
          publishability: { type: Type.NUMBER },
          feasibilityReason: { type: Type.STRING },
          noveltyReason: { type: Type.STRING },
          industryRelevanceReason: { type: Type.STRING },
          publishabilityReason: { type: Type.STRING },
          overallVerdict: { type: Type.STRING },
          alternativeIdeas: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
          }
        },
        required: ["feasibility", "novelty", "industryRelevance", "publishability", "overallVerdict"]
      }
    }
  });

  return JSON.parse(response.text || "{}");
}

export async function generateMilestonePlan(title: string, domain: string, teamSize: number, startDate: string, endDate: string) {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Generate a detailed week-by-week project milestone plan for an engineering final year project titled '${title}' in the domain of ${domain} with a team of ${teamSize} students. Start date: ${startDate}. End date: ${endDate}. Return ONLY a JSON array.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            week: { type: Type.NUMBER },
            title: { type: Type.STRING },
            description: { type: Type.STRING },
            deliverable: { type: Type.STRING },
            category: { 
              type: Type.STRING,
              enum: ["Research", "Design", "Build", "Test", "Document", "Submit"]
            }
          },
          required: ["week", "title", "category"]
        }
      }
    }
  });

  return JSON.parse(response.text || "[]");
}

export async function generateLiteratureReviewOutline(title: string, domain: string) {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Generate a structured literature review outline for an engineering project titled '${title}' in the domain of ${domain}. Return ONLY a JSON object.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          sections: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                keyTopics: { type: Type.ARRAY, items: { type: Type.STRING } },
                suggestedSources: { type: Type.NUMBER }
              },
              required: ["title", "keyTopics"]
            }
          }
        },
        required: ["sections"]
      }
    }
  });

  return JSON.parse(response.text || "{}");
}

export async function generateWeeklyNudge(statsContext: string) {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `You are Nexora, an AI academic mentor. Based on the following student context, generate a powerful, encouraging weekly priority message (max 50 words). 
    
    Context: ${statsContext}`,
  });

  return response.text;
}
