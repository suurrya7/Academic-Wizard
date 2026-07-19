import { GoogleGenAI } from '@google/genai';
const ai = new GoogleGenAI({ apiKey: "dummy_key" });
async function test() {
  try {
    await ai.models.generateContent({ model: "gemini-2.5-flash", contents: "hi" });
    console.log("gemini-2.5-flash worked");
  } catch(e) { console.log("gemini-2.5-flash:", e.message); }
  
  try {
    await ai.models.generateContent({ model: "models/gemini-2.5-flash", contents: "hi" });
    console.log("models/gemini-2.5-flash worked");
  } catch(e) { console.log("models/gemini-2.5-flash:", e.message); }
}
test();
