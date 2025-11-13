
import { GoogleGenAI, Type } from "@google/genai";
import type { AuditReportData } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const auditSchema = {
  type: Type.OBJECT,
  properties: {
    websiteUx: {
      type: Type.OBJECT,
      properties: {
        score: { type: Type.NUMBER, description: "Score from 0-100 for Website & User Experience." },
        comment: { type: Type.STRING, description: "Analysis of design, usability, mobile-friendliness, CTAs, and overall professionalism. Identifies opportunities for a new or redesigned website." }
      }
    },
    seo: {
      type: Type.OBJECT,
      properties: {
        score: { type: Type.NUMBER, description: "Score from 0-100 for SEO." },
        comment: { type: Type.STRING, description: "Analysis of on-page SEO factors like title/meta tags, H1-H6 structure, alt-tags, and internal linking. Highlights potential for technical SEO and keyword optimization services." }
      }
    },
    digitalMarketingPresence: {
      type: Type.OBJECT,
      properties: {
        score: { type: Type.NUMBER, description: "Score from 0-100 for Digital Marketing Presence." },
        comment: { type: Type.STRING, description: "Looks for signs of a broader digital strategy: social media links, newsletter signup forms, pixels/trackers, etc. Identifies gaps that can be filled by Social Media, Google Ads, or E-mail marketing services." }
      }
    },
    contentCommunication: {
      type: Type.OBJECT,
      properties: {
        score: { type: Type.NUMBER, description: "Score from 0-100 for Content & Communication." },
        comment: { type: Type.STRING, description: "Evaluates the quality, clarity, and tone-of-voice of the website's content. Assesses whether the content effectively communicates the company's value, suggesting opportunities for content strategy or creation." }
      }
    },
    aiAutomation: {
      type: Type.OBJECT,
      properties: {
        score: { type: Type.NUMBER, description: "Score from 0-100 for AI & Automation potential." },
        comment: { type: Type.STRING, description: "Analysis of existing AI tools like chatbots and potential for new AI workflows, lead nurturing, or customer service automation. Identifies opportunities for Outsource.dk to implement custom AI solutions." }
      }
    },
    overallPotential: {
      type: Type.OBJECT,
      properties: {
        score: { type: Type.NUMBER, description: "Overall potential score from 0-100, indicating the client's need for digital marketing services." },
        comment: { type: Type.STRING, description: "A concluding remark on the growth opportunity for a digital marketing partner." }
      }
    },
    summary: {
      type: Type.STRING,
      description: "A 2-3 sentence executive summary of the most critical digital marketing and AI findings, framed as opportunities for Outsource.dk."
    }
  },
};

export const generateAuditReport = async (url: string): Promise<AuditReportData> => {
  const prompt = `
    Act as a senior digital marketing and AI consultant for Outsource.dk, a digital agency whose services cover Hjemmesider (Websites), Sociale medier (Social Media), Google Ads, SEO, E-mail marketing, AI Chatbots, and AI Workflows.
    Your task is to conduct a targeted audit of the website: ${url}.
    Your analysis must identify specific pain points that align directly with Outsource.dk's services. The audience is a salesperson who needs clear, actionable insights to initiate a conversation.

    Evaluate the following 5 categories. Provide a score from 0 to 100 for each, and a concise, actionable comment IN DANISH for each category.

    1.  **Hjemmeside & Brugeroplevelse (Website & UX):**
        - Assess the overall design. Is it modern and professional, or outdated?
        - Evaluate user experience (UX). Is navigation clear? Are there clear calls-to-action (CTAs)?
        - Check for mobile-friendliness and general responsiveness.
        - Frame the comment around how Outsource.dk can build a custom, user-friendly, and secure website that converts visitors into customers.

    2.  **SEO (Søgemaskineoptimering):**
        - Analyze on-page SEO elements: Are title tags and meta descriptions present and optimized? Is there a logical H1-H6 structure?
        - Look for technical SEO basics: Does the site use HTTPS? Are there alt-tags on images?
        - Frame the comment to highlight the missed opportunity for organic traffic and how Outsource.dk's SEO services (on-page, technical, keyword analysis) can improve visibility.

    3.  **Digital Marketing Tilstedeværelse (Digital Marketing Presence):**
        - Look for evidence of a wider marketing strategy. Are there links to active social media profiles? Is there an e-mail newsletter signup form?
        - Check for any tracking pixels (like Facebook Pixel or Google Analytics) which indicate ad campaigns.
        - Frame the comment to suggest opportunities for growth through integrated campaigns, such as Google Ads, Social Media management, or E-mail marketing automation.

    4.  **Indhold & Kommunikation (Content & Communication):**
        - Evaluate the website's copy. Is the tone-of-voice consistent and professional? Is the message clear?
        - Assess if the content is engaging and provides value, or if it's just a simple brochure-site. Is there a blog?
        - Frame the comment by connecting strong content to building trust and authority, and suggest that Outsource.dk can help develop a content strategy.
    
    5.  **AI & Automation:**
        - Check for existing chatbots or other AI-powered tools on the site.
        - Evaluate the potential for an AI chatbot to improve user engagement, capture leads, or provide support.
        - Consider if workflows (e.g., contact forms, bookings) could be automated or enhanced with AI.
        - Frame the comment to introduce Outsource.dk's ability to build and integrate intelligent chatbots and custom AI workflows to boost efficiency.

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
  return JSON.parse(jsonText);
};

export const generateSalesPitch = async (reportData: AuditReportData): Promise<string> => {
  const prompt = `
    Based on the following digital marketing audit report for a potential client, generate a compelling and concise 30-second sales pitch in Danish.
    The pitch is for a meeting booker from Outsource.dk. The goal is to secure a meeting by highlighting a key pain point identified in the new audit categories (Website/UX, SEO, Digital Marketing, Content, AI/Automation).

    1.  Identify the most critical issue from the report that directly maps to one of Outsource.dk's core services.
    2.  Start by acknowledging something professional about their website to build rapport.
    3.  Pivot to the specific issue you identified. Use clear language. (e.g., "Jeg bemærkede, at jeres SEO-potentiale ikke udnyttes fuldt ud," or "Jeg så, at I kunne effektivisere jeres kundehenvendelser med en AI-chatbot. Hvordan håndterer I dem i dag?").
    4.  Connect this issue to a business problem (e.g., "det kan betyde, at I går glip af værdifuld trafik fra Google," or "det kunne frigøre tid for jeres medarbejdere").
    5.  Briefly introduce how Outsource.dk solves this specific problem. (e.g., "Hos Outsource.dk specialiserer vi os i at få virksomheder til tops på Google," or "Vi er eksperter i at bygge AI-løsninger, der skaber resultater.").
    6.  End with a clear, low-pressure call to action to book a meeting.

    The tone should be professional, helpful, and confident.

    Audit Report Data:
    ${JSON.stringify(reportData, null, 2)}

    Example structure:
    "Hej [Navn], jeg ringer fra Outsource.dk. Jeg har kigget på jeres hjemmeside, og den præsenterer jer rigtig flot. Jeg lagde dog mærke til [specifikt problem fra rapporten, f.eks. at I ikke har en chatbot til at hjælpe jeres besøgende]. Ofte kan en simpel AI-assistent gøre en kæmpe forskel for, hvor mange henvendelser man får. Vi er specialister i AI og hjælper virksomheder som jeres med at automatisere og vokse. Har du 15 minutter i næste uge til en kort snak om jeres uudnyttede potentiale?"

    Generate only the pitch text.
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
  });

  return response.text;
};