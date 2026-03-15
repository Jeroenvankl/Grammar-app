import { Language, Topic } from "@/types/grammar";

// Italian topics
import presenteData from "@/data/italian/topics/presente.json";
import articoliData from "@/data/italian/topics/articoli.json";
import preposizioniData from "@/data/italian/topics/preposizioni.json";
import passatoProssimoData from "@/data/italian/topics/passato-prossimo.json";
import pronomiData from "@/data/italian/topics/pronomi.json";

// Japanese topics
import desuMasuData from "@/data/japanese/topics/desu-masu.json";
import partikelsData from "@/data/japanese/topics/partikels.json";
import zinsvolgordeData from "@/data/japanese/topics/zinsvolgorde.json";
import teVormData from "@/data/japanese/topics/te-vorm.json";
import bijvoeglijkData from "@/data/japanese/topics/bijvoeglijk.json";

// Spanish (Latin American) topics
import presenteEsData from "@/data/spanish/topics/presente.json";
import serEstarData from "@/data/spanish/topics/ser-estar.json";
import porParaData from "@/data/spanish/topics/por-para.json";
import preteritoData from "@/data/spanish/topics/preterito.json";
import subjuntivoData from "@/data/spanish/topics/subjuntivo.json";

// French topics
import presentFrData from "@/data/french/topics/present.json";
import articlesFrData from "@/data/french/topics/articles.json";
import prepositionsFrData from "@/data/french/topics/prepositions.json";
import passeComposeFrData from "@/data/french/topics/passe-compose.json";
import pronomsFrData from "@/data/french/topics/pronoms.json";

const italianTopics: Topic[] = [
  presenteData as unknown as Topic,
  articoliData as unknown as Topic,
  preposizioniData as unknown as Topic,
  passatoProssimoData as unknown as Topic,
  pronomiData as unknown as Topic,
];

const japaneseTopics: Topic[] = [
  desuMasuData as unknown as Topic,
  partikelsData as unknown as Topic,
  zinsvolgordeData as unknown as Topic,
  teVormData as unknown as Topic,
  bijvoeglijkData as unknown as Topic,
];

const spanishTopics: Topic[] = [
  presenteEsData as unknown as Topic,
  serEstarData as unknown as Topic,
  porParaData as unknown as Topic,
  preteritoData as unknown as Topic,
  subjuntivoData as unknown as Topic,
];

const frenchTopics: Topic[] = [
  presentFrData as unknown as Topic,
  articlesFrData as unknown as Topic,
  prepositionsFrData as unknown as Topic,
  passeComposeFrData as unknown as Topic,
  pronomsFrData as unknown as Topic,
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
  {
    id: "french",
    name: "Frans",
    flag: "\u{1F1EB}\u{1F1F7}",
    topics: frenchTopics,
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
