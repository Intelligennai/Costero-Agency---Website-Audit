import { GoogleGenAI, Type, Chat } from "@google/genai";
import type { AuditReportData } from './types';

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
              followers: { type: Type.STRING, description: "Number of followers/likes as a string (e.g., '1,234', '5.6k', 'Ukendt')." }
            },
            required: ['platform', 'followers']
          }
        },
        trustpilot: {
          type: Type.OBJECT,
          description: "Trustpilot review statistics. Omit if not found.",
          properties: {
            score: { type: Type.STRING, description: "Overall score, e.g., '4.5/5'." },
            reviewCount: { type: Type.STRING, description: "Total number of reviews, e.g., '1,234 anmeldelser'." }
          },
          required: ['score', 'reviewCount']
        },
        googleReviews: {
          type: Type.OBJECT,
          description: "Google Reviews statistics from their Business Profile. Omit if not found.",
          properties: {
            score: { type: Type.STRING, description: "Overall score, e.g., '4.8/5'." },
            reviewCount: { type: Type.STRING, description: "Total number of reviews, e.g., '512 anmeldelser'." }
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
    'googleMyBusiness',
  ]
};

export const generateAuditReport = async (url: string): Promise<AuditReportData> => {
  const prompt = `
    Act as a senior digital marketing and AI consultant for Outsource.dk, a digital agency whose services cover Hjemmesider (Websites), Sociale medier (Social Media), Google Ads, SEO, E-mail marketing, AI Chatbots, and AI Workflows.
    Your task is to conduct a targeted audit of the website: ${url}.
    Your analysis must identify specific pain points that align directly with Outsource.dk's services. The audience is a salesperson who needs clear, actionable insights to initiate a conversation.

    Evaluate the following categories. Provide a score from 0 to 100 for the first 5, and a concise, actionable comment IN DANISH for each category.

    1.  **Hjemmeside & Brugeroplevelse (Website & UX):**
        - Assess design, UX, CTAs, and mobile-friendliness. Frame comment around Outsource.dk's ability to build a high-converting website.

    2.  **SEO (Søgemaskineoptimering):**
        - Analyze on-page and technical SEO. Your analysis must go beyond basics and include these advanced topics:
        - **Schema Markup:** Check for structured data (e.g., \`Organization\`, \`LocalBusiness\`, \`Product\`, \`FAQPage\` schema). Comment on its presence and correct implementation. If missing, identify it as a major opportunity for rich snippets in search results.
        - **Internal Linking:** Evaluate the internal linking strategy. Are key pages well-linked together to show their relationship? Is anchor text descriptive and relevant? Is there a clear, logical link flow, or are there important pages with very few internal links (orphaned pages)?
        - **Core On-Page Factors:** Also include analysis of title/meta tags, H1-H6 structure, and image alt-tags.
        - Frame the final comment to highlight missed opportunities for organic traffic and improved search visibility.

    3.  **Digital Marketing Tilstedeværelse (Digital Marketing Presence):**
        - Look for social media links (Facebook, Instagram, LinkedIn, X, TikTok, etc.). For each platform found, find and list the number of followers (use 'Ukendt' if not found).
        - CRITICAL: Search for the company's Trustpilot page and their Google Business Profile. If found, extract their overall score (e.g., '4.5/5') and total number of reviews (e.g., '1,234 anmeldelser'). Omit if not found.
        - Check for newsletters, and tracking pixels to gauge their marketing activity.
        - Frame the comment to suggest growth via integrated campaigns, and comment on their online reputation based on the review scores.

    4.  **Indhold & Kommunikation (Content & Communication):**
        - Evaluate copy, tone-of-voice, and value. Frame comment by connecting strong content to building trust and authority.
    
    5.  **AI & Automation:**
        - Check for chatbots and automation potential in workflows. Frame comment to introduce Outsource.dk's ability to build intelligent solutions.

    6.  **Annoncering & Optimering (Advertising & Optimization):**
        - This section should NOT have a score.
        - Scan for evidence of Google Ads (e.g., gclid parameters) and Meta Ads (Facebook Pixel).
        - CRITICAL: To provide context, you MUST research and include **specific** industry benchmarks for a similar business in Denmark. For example, if the site is for a **SaaS company, find the average conversion rate for SaaS in Denmark. If it's e-commerce, find average e-commerce CTRs. If it's a local service business (like a plumber), find average Cost-Per-Lead.** This specific context is vital for a high-quality analysis.
        - Based on your findings:
          - If ad evidence is found, provide a concise summary of their current advertising strategy and compare their likely performance against the industry benchmarks you found.
          - If no ad evidence is found, state that this is a major untapped opportunity, using the industry benchmarks to quantify what they are missing out on.
        - Provide 3-4 concrete, actionable recommendations as bullet points (using '*') for how Outsource.dk can improve their results. These should be specific and data-driven.
        - Frame this entire section as a major growth opportunity.
    
    7. **Google My Business Optimering:**
        - This section should NOT have a score.
        - Search for the company's Google Business Profile (GMB).
        - Analyze its completeness: review count & rating, response rate to reviews, photo quality and quantity, recent posts, and accuracy of business information (NAP).
        - Provide 3-4 concrete, actionable recommendations as bullet points (using '*') for how Outsource.dk can improve their GMB listing for better local visibility.
        - Frame this as a critical component for local SEO and attracting nearby customers.

    Finally, provide an "Overall Potential" score (0-100) indicating how likely this prospect is a good fit for Outsource.dk.
    Also, write a 2-3 sentence executive summary of the most critical findings.

    Provide the entire output in a single JSON object. Do not include any markdown formatting like \`\`\`json.
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
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

    - **Variation 1 (Data-Driven):** Focus heavily on the specific numbers and benchmarks from the 'advertisingOptimization' or 'googleMyBusiness' sections. Be direct and analytical.
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

export const createChatSession = (): Chat => {
    const systemInstruction = `You are a friendly, expert AI assistant for Outsource.dk, a digital marketing agency. Your goal is to help users of the Website Audit AI tool.
    You are knowledgeable about all sections of the audit report: Hjemmeside & UX, SEO, Digital Marketing, Indhold & Kommunikation, AI & Automation, Annoncering & Optimering, and Google My Business.
    You can also answer questions about Outsource.dk's services, which include: Websites, Social Media management, Google Ads, SEO, E-mail marketing, AI Chatbots, and AI Workflows.
    Keep your answers concise and easy to understand. Be professional and encouraging. If you don't know an answer, politely say so. Do not make up information.
    The user is likely a salesperson or meeting booker. Frame your answers to be helpful for their role.`;

    return ai.chats.create({
        model: 'gemini-flash-lite-latest',
        config: {
            systemInstruction,
        },
    });
};
