import { GoogleGenAI, Content } from "@google/genai";

// This type definition is a stand-in for Vercel's request object.
interface VercelRequest {
  method: string;
  body: {
    messages: { sender: 'user' | 'bot'; text: string }[];
    systemInstruction: string;
  };
}

// This type definition is a stand-in for Vercel's response object.
interface VercelResponse {
  setHeader: (key: string, value: any) => void;
  status: (code: number) => {
    json: (data: any) => void;
    end: (message: string) => void;
  };
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  try {
    const { messages, systemInstruction } = req.body;

    if (!messages || !Array.isArray(messages) || !systemInstruction) {
      return res.status(400).json({ error: 'Invalid request body. "messages" and "systemInstruction" are required.' });
    }
    
    // Ensure the API_KEY is available
    if (!process.env.API_KEY) {
      console.error('API_KEY is not configured in environment variables.');
      return res.status(500).json({ error: 'Server configuration error.' });
    }

    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    // Convert frontend message format to Gemini's content format
    const contents: Content[] = messages.map(msg => ({
      role: msg.sender === 'user' ? 'user' : 'model',
      parts: [{ text: msg.text }],
    }));

    const result = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: contents,
      config: {
        systemInstruction: systemInstruction,
      },
    });
    const responseText = result.text;
    
    return res.status(200).json({ reply: responseText });

  } catch (error) {
    console.error('Error calling Gemini API:', error);
    return res.status(500).json({ error: 'Failed to get response from AI' });
  }
}
