import { Language, Topic } from "@/types/grammar";

// Italian topics
import presenteData from "@/data/italian/topics/presente.json";
import articoliData from "@/data/italian/topics/articoli.json";
import preposizioniData from "@/data/italian/topics/preposizioni.json";

// Japanese topics
import desuMasuData from "@/data/japanese/topics/desu-masu.json";
import partikelsData from "@/data/japanese/topics/partikels.json";
import zinsvolgordeData from "@/data/japanese/topics/zinsvolgorde.json";

// Spanish (Latin American) topics
import presenteEsData from "@/data/spanish/topics/presente.json";
import serEstarData from "@/data/spanish/topics/ser-estar.json";
import porParaData from "@/data/spanish/topics/por-para.json";

const italianTopics: Topic[] = [
  presenteData as unknown as Topic,
  articoliData as unknown as Topic,
  preposizioniData as unknown as Topic,
];

const japaneseTopics: Topic[] = [
  desuMasuData as unknown as Topic,
  partikelsData as unknown as Topic,
  zinsvolgordeData as unknown as Topic,
];

const spanishTopics: Topic[] = [
  presenteEsData as unknown as Topic,
  serEstarData as unknown as Topic,
  porParaData as unknown as Topic,
];

export const languages: Language[] = [
  {
    id: "italian",
    name: "Italiaans",
    flag: "\u{1F1EE}\u{1F1F9}",
    topics: italianTopics,
  },
  {
    id: "japanese",
    name: "Japans",
    flag: "\u{1F1EF}\u{1F1F5}",
    topics: japaneseTopics,
  },
  {
    id: "spanish",
    name: "Spaans (Latijns-Amerika)",
    flag: "\u{1F30E}",
    topics: spanishTopics,
  },
];

export function getLanguage(languageId: string): Language | undefined {
  return languages.find((l) => l.id === languageId);
}

export function getTopic(
  languageId: string,
  topicId: string
): Topic | undefined {
  const language = getLanguage(languageId);
  if (!language) return undefined;
  return language.topics.find((t) => t.id === topicId);
}

export function getAllLanguages(): Language[] {
  return languages;
}
