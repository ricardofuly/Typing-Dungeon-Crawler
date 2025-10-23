import { GoogleGenAI, Type } from "@google/genai";
import { Language } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const themes = [
    "a dark fantasy dungeon passage description",
    "an ancient cursed library's forbidden text",
    "a cryptic prophecy from a forgotten god",
    "an excerpt from a mad wizard's journal",
    "a battle cry from a legendary warrior",
    "a haunting verse from a ghost's lament"
];

const getRandomTheme = () => themes[Math.floor(Math.random() * themes.length)];

export const generateBattleText = async (language: Language, level: number): Promise<string> => {
  try {
    const wordCount = 30 + Math.floor(level * 2.5);
    const theme = getRandomTheme();
    
    let difficultyInstruction = '';
    if (level <= 3) {
      difficultyInstruction = "Use simple sentence structures and common vocabulary. Punctuation should be limited to commas and periods.";
    } else if (level <= 7) {
      difficultyInstruction = "Introduce more complex sentences with varied clauses. Include punctuation like question marks, exclamation points, and semicolons.";
    } else if (level <= 12) {
      difficultyInstruction = "Craft longer, more intricate sentences. Use sophisticated and less common vocabulary. Include quoted text and colons.";
    } else {
      difficultyInstruction = "Generate a highly complex text with challenging sentence structures, archaic or technical fantasy terms, and difficult punctuation combinations (e.g., nested quotes, hyphens). The text should be a true test of typing mastery.";
    }

    const systemInstruction = `You are a master storyteller for a dark fantasy typing game. Your role is to generate a single, evocative paragraph that serves as a challenge for the player to type. The texts should be grammatically correct, contain a mix of simple and complex words, and be rich in atmosphere. Do not use markdown or special formatting. Adhere strictly to the difficulty instructions provided.`;

    const prompt = `Generate a single paragraph of about ${wordCount} words for a typing battle in a video game.
The theme is: ${theme}.
The language must be ${language}.
Difficulty requirement: ${difficultyInstruction}
Do not include any introductory or concluding phrases. Just provide the raw paragraph.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-pro",
      contents: prompt,
      config: {
        systemInstruction: systemInstruction,
        thinkingConfig: { thinkingBudget: 32768 },
        temperature: 1.1,
      },
    });
    
    const text = response.text.trim();
    // A simple cleanup to ensure it's a single paragraph without unwanted newlines
    return text.replace(/[\r\n]+/g, ' ');
  } catch (error) {
    console.error("Error generating battle text:", error);
    // Fallback text in case of API error
    return language === Language.ENGLISH
      ? "The ancient stones beneath your feet hum with a dark energy, warning you of the encroaching danger."
      : "As pedras antigas sob seus pés vibram com uma energia sombria, avisando sobre o perigo que se aproxima.";
  }
};

export const generateMoreWords = async (language: Language, level: number): Promise<string> => {
  try {
    const wordCount = 5 + Math.floor(level / 3); // 5-9 words approx.
    const theme = getRandomTheme();
    
    let difficultyInstruction = '';
    if (level <= 3) {
      difficultyInstruction = "Use simple words.";
    } else if (level <= 7) {
      difficultyInstruction = "Use moderately complex words and simple punctuation.";
    } else {
      difficultyInstruction = "Use complex and varied vocabulary.";
    }

    const systemInstruction = `You are a storyteller for a dark fantasy typing game. Generate a short, challenging phrase to extend an ongoing battle. Do not use markdown or special formatting.`;

    const prompt = `Generate a short phrase of about ${wordCount} words to continue a typing battle.
The theme is: ${theme}.
The language must be ${language}.
Difficulty requirement: ${difficultyInstruction}
Do not include any introductory or concluding phrases. Just provide the raw phrase.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-pro",
      contents: prompt,
      config: {
        systemInstruction: systemInstruction,
        thinkingConfig: { thinkingBudget: 8192 }, // Lower budget for faster response
        temperature: 1.0,
      },
    });
    
    const text = response.text.trim();
    return text.replace(/[\r\n]+/g, ' ');
  } catch (error) {
    console.error("Error generating more words:", error);
    return language === Language.ENGLISH ? "the darkness deepens" : "a escuridão se aprofunda";
  }
};

export const generateCharacterNames = async (language: Language): Promise<string[]> => {
  try {
    const systemInstruction = `You are a creative assistant for a dark fantasy game. Your task is to generate thematic character names. Provide a JSON response according to the schema.`;
    const prompt = `Generate a list of 5 cool and thematic character names for a hero in a dark fantasy game. The names should be suitable for the ${language} language.`;
    
    const response = await ai.models.generateContent({
      model: "gemini-2.5-pro",
      contents: prompt,
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            names: {
              type: Type.ARRAY,
              description: "A list of 5 character names.",
              items: {
                type: Type.STRING
              }
            }
          }
        },
        thinkingConfig: { thinkingBudget: 8192 },
      },
    });

    const jsonString = response.text.trim();
    const result = JSON.parse(jsonString);
    return result.names || [];

  } catch (error) {
    console.error("Error generating character names:", error);
    return language === Language.ENGLISH
      ? ["Gideon", "Seraphina", "Kael", "Lyra", "Valerius"]
      : ["Gideão", "Seraphina", "Kael", "Lyra", "Valerius"];
  }
};