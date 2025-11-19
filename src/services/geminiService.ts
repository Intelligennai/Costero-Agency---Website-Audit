import { GoogleGenAI, Type, Chat } from "@google/genai";
import type { AuditReportData, AgencyProfile } from '../types';

const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY || '' });

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
      description: "Analysis of on-page SEO factors like title/meta tags, H1-H6 structure, alt-tags, internal linking, and schema markup. Highlights potential for technical SEO and keyword optimization services."
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
              followers: { type: Type.STRING, description: "Number of followers/likes as a string (e.g., '1,234', '5.6k', 'Unknown')." }
            },
            required: ['platform', 'followers']
          }
        },
        trustpilot: {
          type: Type.OBJECT,
          description: "Trustpilot review statistics. Omit if not found.",
          properties: {
            score: { type: Type.STRING, description: "Overall score, e.g., '4.5/5'." },
            reviewCount: { type: Type.STRING, description: "Total number of reviews, e.g., '1,234 reviews'." }
          },
          required: ['score', 'reviewCount']
        },
        googleReviews: {
          type: Type.OBJECT,
          description: "Google Reviews statistics from their Business Profile. Omit if not found.",
          properties: {
            score: { type: Type.STRING, description: "Overall score, e.g., '4.8/5'." },
            reviewCount: { type: Type.STRING, description: "Total number of reviews, e.g., '512 reviews'." }
          },
          required: ['score', 'reviewCount']
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
      description: "Analysis of existing AI tools like chatbots and potential for new AI workflows, lead nurturing, or customer service automation. Identifies opportunities for the agency to implement custom AI solutions."
    },
    overallPotential: {
      ...auditSectionSchema,
      description: "An overall potential score and a concluding remark on the growth opportunity for a digital marketing partner."
    },
    advertisingOptimization: {
      type: Type.OBJECT,
      properties: {
        comment: { type: Type.STRING, description: "A detailed analysis of current Google/Meta advertising. MUST start with a summary of current ad performance, then provide 3-4 specific, actionable recommendations as bullet points for how the agency can achieve better results." }
      },
      required: ['comment'],
      description: "Analysis of current advertising efforts and suggestions for improvement."
    },
    googleMyBusiness: {
      type: Type.OBJECT,
      properties: {
        comment: { type: Type.STRING, description: "Detailed analysis of the Google My Business profile with 3-4 specific, actionable recommendations as bullet points." }
      },
      required: ['comment'],
      description: "Analysis of the company's Google My Business profile and local SEO potential."
    },
    summary: {
      type: Type.STRING,
      description: "A 2-3 sentence executive summary of the most critical digital marketing and AI findings, framed as opportunities for the agency."
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
    'googleMyBusiness',
  ]
};

export const generateAuditReport = async (url: string, agencyProfile: AgencyProfile, language: string): Promise<AuditReportData> => {
  const languageMap: { [key: string]: string } = {
    da: 'DANISH',
    en: 'ENGLISH',
    es: 'SPANISH',
  };
  const targetLanguage = languageMap[language] || 'ENGLISH';

  const prompt = `
    Act as a senior digital marketing and AI consultant for ${agencyProfile.name}, a digital agency whose services cover ${agencyProfile.services.join(', ')}.
    Your task is to conduct a targeted audit of the website: ${url}.
    Your analysis must identify specific pain points that align directly with ${agencyProfile.name}'s services. The audience is a salesperson who needs clear, actionable insights to initiate a conversation.

    Evaluate the following categories. Provide a score from 0 to 100 for the first 5, and a concise, actionable comment IN ${targetLanguage} for each category.

    1.  **Website & UX:**
        - Assess design, UX, CTAs, and mobile-friendliness. Frame comment around ${agencyProfile.name}'s ability to build a high-converting website.

    2.  **SEO (Search Engine Optimization):**
        - Analyze on-page and technical SEO, including Schema Markup, internal linking, title/meta tags, H1-H6 structure, and image alt-tags. Frame the comment to highlight missed opportunities for organic traffic.

    3.  **Digital Marketing Presence:**
        - Find social media links and list follower counts.
        - CRITICAL: Search for the company's Trustpilot page and Google Business Profile. If found, extract their score and total review count. Omit if not found.
        - Check for newsletters and tracking pixels. Frame comment to suggest growth via integrated campaigns.

    4.  **Content & Communication:**
        - Evaluate copy, tone-of-voice, and value. Frame comment by connecting strong content to building trust.
    
    5.  **AI & Automation:**
        - Check for chatbots and automation potential. Frame comment to introduce ${agencyProfile.name}'s AI solutions if applicable.

    6.  **Advertising & Optimization:**
        - This section should NOT have a score.
        - Scan for evidence of Google Ads and Meta Ads.
        - **Competitor Analysis:** You MUST find 1-2 key competitors. Briefly summarize their advertising strategy.
        - **Industry Benchmarks:** You MUST research and include **specific** industry benchmarks for a similar business in their local region (e.g., average conversion rate, CTR, Cost-Per-Lead).
        - Provide a concise summary comparing their likely performance against competitors and benchmarks.
        - Provide 3-4 concrete, actionable recommendations as bullet points (using '*') for how ${agencyProfile.name} can improve results.
    
    7. **Google My Business Optimization:**
        - This section should NOT have a score.
        - Analyze the completeness of their Google Business Profile.
        - Provide 3-4 concrete, actionable recommendations as bullet points (using '*') for how to improve their GMB listing for local visibility.

    Finally, provide an "Overall Potential" score (0-100) and a 2-3 sentence executive summary.

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
    throw new Error("error_invalid_json");
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

export const generateSalesPitch = async (reportData: AuditReportData, agencyProfile: AgencyProfile, language: string): Promise<string[]> => {
  const languageMap: { [key: string]: string } = {
    da: 'DANISH',
    en: 'ENGLISH',
    es: 'SPANISH',
  };
  const targetLanguage = languageMap[language] || 'ENGLISH';

  const prompt = `
    Based on the following digital marketing audit report, generate an array of 3 compelling, concise 30-second sales pitch variations in ${targetLanguage}.
    The pitch is for a meeting booker from ${agencyProfile.name}. The goal is to secure a meeting.
    Each pitch should highlight a key pain point from the audit from a different angle.

    - **Variation 1 (Data-Driven):** Focus heavily on specific numbers and benchmarks from the 'advertisingOptimization' or 'googleMyBusiness' sections.
    - **Variation 2 (Rapport-Building):** Start with a compliment and frame the opportunity in a more collaborative way.
    - **Variation 3 (Urgency-Focused):** Emphasize the risk of inaction and what they are losing to competitors.

    Audit Report Data:
    ${JSON.stringify(reportData, null, 2)}

    Provide the entire output in a single JSON object with a "pitches" key. Do not include markdown formatting.
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-pro',
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
    throw new Error("error_pitch_invalid_json");
  }
};

export const createChatSession = (systemInstruction: string): Chat => {
    return ai.chats.create({
        model: 'gemini-2.5-flash',
        config: {
            systemInstruction,
        },
    });
};

const agencyProfileSchema = {
    type: Type.OBJECT,
    properties: {
        name: { type: Type.STRING, description: "The official name of the company or agency from the website." },
        services: {
            type: Type.ARRAY,
            description: "A list of specific digital marketing services offered by the agency.",
            items: {
                type: Type.STRING,
                description: "A single service (e.g., 'SEO', 'Web Design', 'Social Media Marketing')."
            }
        }
    },
    required: ['name', 'services']
};

export const analyzeAgencyWebsite = async (url: string): Promise<AgencyProfile> => {
    const prompt = `
        Analyze the content of the website at this URL: ${url}.
        Your goal is to identify the company's name and the specific digital marketing services it provides.
        
        1.  **Company Name:** Find the official name of the company.
        2.  **Services:** Scan the website to find a list of their offerings. Focus only on digital marketing services (e.g., "SEO", "Web Design", "Google Ads").

        Return the result as a single JSON object. Do not include any markdown formatting.
    `;

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
            responseMimeType: 'application/json',
            responseSchema: agencyProfileSchema,
        },
    });

    const jsonText = response.text.trim();
    try {
        return JSON.parse(jsonText) as AgencyProfile;
    } catch (e) {
        console.error("Failed to parse JSON response for agency profile:", jsonText);
        throw new Error("error_agency_invalid_json");
    }
};
