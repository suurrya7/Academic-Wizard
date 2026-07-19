import { GoogleGenAI } from '@google/genai';
const ai = new GoogleGenAI({ apiKey: process.env.BACKLINK_GEMINI_API_KEY });
async function test() {
  try {
    const result = await ai.models.generateContent({ model: "gemini-2.5-flash", contents: "hi" });
    console.log("gemini-2.5-flash worked:", result.text);
  } catch(e) { console.log("gemini-2.5-flash error:", e.message); }
  
  try {
    const result = await ai.models.generateContent({ model: "models/gemini-2.5-flash", contents: "hi" });
    console.log("models/gemini-2.5-flash worked:", result.text);
  } catch(e) { console.log("models/gemini-2.5-flash error:", e.message); }
}
test();
