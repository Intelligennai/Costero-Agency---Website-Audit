
import { GoogleGenAI, Type } from "@google/genai";
import type { AuditReportData } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const auditSectionSchema = {
  type: Type.OBJECT,
  properties: {
    score: { type: Type.NUMBER },
    comment: { type: Type.STRING }
  },
  required: ['score', 'comment']
};

const auditSchema = {
  type: Type.OBJECT,
  properties: {
    websiteUx: { 
      ...auditSectionSchema,
      description: "Analysis of design, usability, mobile-friendliness, CTAs, and overall professionalism. Identifies opportunities for a new or redesigned website."
    },
    seo: {
      ...auditSectionSchema,
      description: "Analysis of on-page SEO factors like title/meta tags, H1-H6 structure, alt-tags, and internal linking. Highlights potential for technical SEO and keyword optimization services."
    },
    digitalMarketingPresence: {
      type: Type.OBJECT,
      properties: {
        score: { type: Type.NUMBER },
        comment: { type: Type.STRING },
        socialMediaStats: {
          type: Type.ARRAY,
          description: "List of social media platforms found and their follower counts. Return an empty array if none are found.",
          items: {
            type: Type.OBJECT,
            properties: {
              platform: { type: Type.STRING, description: "Name of the social media platform (e.g., Facebook, Instagram, LinkedIn, X, TikTok)." },
              followers: { type: Type.STRING, description: "Number of followers/likes as a string (e.g., '1,234', '5.6k', 'Ukendt')." }
            },
            required: ['platform', 'followers']
          }
        }
      },
      required: ['score', 'comment', 'socialMediaStats']
    },
    contentCommunication: {
      ...auditSectionSchema,
      description: "Evaluates the quality, clarity, and tone-of-voice of the website's content. Assesses whether the content effectively communicates the company's value, suggesting opportunities for content strategy or creation."
    },
    aiAutomation: {
      ...auditSectionSchema,
      description: "Analysis of existing AI tools like chatbots and potential for new AI workflows, lead nurturing, or customer service automation. Identifies opportunities for Outsource.dk to implement custom AI solutions."
    },
    overallPotential: {
      ...auditSectionSchema,
      description: "An overall potential score and a concluding remark on the growth opportunity for a digital marketing partner."
    },
    advertisingOptimization: {
      type: Type.OBJECT,
      properties: {
        comment: { type: Type.STRING, description: "A detailed analysis of current Google/Meta advertising. MUST start with a summary of current ad performance, then provide 3-4 specific, actionable recommendations as bullet points for how Outsource.dk can achieve better results." }
      },
      required: ['comment'],
      description: "Analysis of current advertising efforts and suggestions for improvement."
    },
    summary: {
      type: Type.STRING,
      description: "A 2-3 sentence executive summary of the most critical digital marketing and AI findings, framed as opportunities for Outsource.dk."
    }
  },
  required: [
    'websiteUx',
    'seo',
    'digitalMarketingPresence',
    'contentCommunication',
    'aiAutomation',
    'overallPotential',
    'summary',
    'advertisingOptimization',
  ]
};

export const generateAuditReport = async (url: string): Promise<AuditReportData> => {
  const prompt = `
    Act as a senior digital marketing and AI consultant for Outsource.dk, a digital agency whose services cover Hjemmesider (Websites), Sociale medier (Social Media), Google Ads, SEO, E-mail marketing, AI Chatbots, and AI Workflows.
    Your task is to conduct a targeted audit of the website: ${url}.
    Your analysis must identify specific pain points that align directly with Outsource.dk's services. The audience is a salesperson who needs clear, actionable insights to initiate a conversation.

    Evaluate the following 6 categories. Provide a score from 0 to 100 for the first 5, and a concise, actionable comment IN DANISH for each category.

    1.  **Hjemmeside & Brugeroplevelse (Website & UX):**
        - Assess design, UX, CTAs, and mobile-friendliness. Frame comment around Outsource.dk's ability to build a high-converting website.

    2.  **SEO (Søgemaskineoptimering):**
        - Analyze on-page and technical SEO basics. Frame comment to highlight missed opportunities for organic traffic.

    3.  **Digital Marketing Tilstedeværelse (Digital Marketing Presence):**
        - Look for social media links (Facebook, Instagram, LinkedIn, X, TikTok, etc.). For each platform found, find and list the number of followers (use 'Ukendt' if not found).
        - Check for newsletters, and tracking pixels to gauge their marketing activity.
        - Frame the comment to suggest growth via integrated campaigns, and comment on their social media strength based on follower counts.

    4.  **Indhold & Kommunikation (Content & Communication):**
        - Evaluate copy, tone-of-voice, and value. Frame comment by connecting strong content to building trust and authority.
    
    5.  **AI & Automation:**
        - Check for chatbots and automation potential in workflows. Frame comment to introduce Outsource.dk's ability to build intelligent solutions.

    6.  **Annoncering & Optimering (Advertising & Optimization):**
        - This section should NOT have a score.
        - Scan for evidence of Google Ads (e.g., gclid parameters) and Meta Ads (Facebook Pixel).
        - CRITICAL: To provide context, you MUST research and include relevant industry benchmarks for a similar business in Denmark (e.g., average Click-Through Rate (CTR) or Conversion Rate for their specific sector). This context is vital.
        - Based on your findings:
          - If ad evidence is found, provide a concise summary of their current advertising strategy and compare their likely performance against the industry benchmarks you found.
          - If no ad evidence is found, state that this is a major untapped opportunity, using the industry benchmarks to quantify what they are missing out on.
        - Provide 3-4 concrete, actionable recommendations as bullet points (using '*') for how Outsource.dk can improve their results. These should be specific and data-driven.
        - Frame this entire section as a major growth opportunity.

    Finally, provide an "Overall Potential" score (0-100) indicating how likely this prospect is a good fit for Outsource.dk.
    Also, write a 2-3 sentence executive summary of the most critical findings.

    Provide the entire output in a single JSON object. Do not include any markdown formatting like \`\`\`json.
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-pro',
    contents: prompt,
    config: {
      responseMimeType: 'application/json',
      responseSchema: auditSchema,
    },
  });

  const jsonText = response.text.trim();
  try {
    return JSON.parse(jsonText) as AuditReportData;
  } catch (e) {
    console.error("Failed to parse JSON response:", jsonText);
    throw new Error("The AI returned an invalid JSON format.");
  }
};

const pitchSchema = {
  type: Type.OBJECT,
  properties: {
    pitches: {
      type: Type.ARRAY,
      description: "An array of 2-3 distinct sales pitch variations.",
      items: {
        type: Type.STRING,
        description: "A single sales pitch."
      }
    }
  },
  required: ['pitches']
};

export const generateSalesPitch = async (reportData: AuditReportData): Promise<string[]> => {
  const prompt = `
    Based on the following digital marketing audit report for a potential client, generate an array of 3 compelling and concise 30-second sales pitch variations in Danish.
    The pitch is for a meeting booker from Outsource.dk. The goal is to secure a meeting.
    Each pitch should highlight a key pain point from the audit but from a different angle.

    - **Variation 1 (Data-Driven):** Focus heavily on the specific numbers and benchmarks from the 'advertisingOptimization' section. Be direct and analytical.
    - **Variation 2 (Rapport-Building):** Start with a genuine compliment and frame the opportunity in a more collaborative, less aggressive way.
    - **Variation 3 (Urgency-Focused):** Emphasize the risk of inaction and what they are losing to competitors by not addressing the identified issues.

    Use the report data to make each pitch specific and actionable. End each with a clear, low-pressure call to action.

    The tone should be professional, helpful, and confident.

    Audit Report Data:
    ${JSON.stringify(reportData, null, 2)}

    Provide the entire output in a single JSON object with a "pitches" key containing the array of strings. Do not include any markdown formatting like \`\`\`json.
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
    config: {
      responseMimeType: 'application/json',
      responseSchema: pitchSchema,
    },
  });

  const jsonText = response.text.trim();
  try {
    const parsed = JSON.parse(jsonText);
    return parsed.pitches as string[];
  } catch (e) {
    console.error("Failed to parse JSON response for pitches:", jsonText);
    throw new Error("The AI returned an invalid JSON format for the sales pitch.");
  }
};
