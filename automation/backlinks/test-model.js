import { GoogleGenAI } from '@google/genai';
const ai = new GoogleGenAI({ apiKey: "dummy_key" });
async function test() {
  try {
    await ai.models.generateContent({ model: "gemini-3.1-flash-lite", contents: "hi" });
  } catch(e) { console.log("gemini-3.1:", e.message); }
  
  try {
    await ai.models.generateContent({ model: "gemini-2.0-flash", contents: "hi" });
  } catch(e) { console.log("gemini-2.0:", e.message); }
}
test();
