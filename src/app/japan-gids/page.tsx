"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ArrowLeft } from "lucide-react";
import Link from "next/link";
import Layout from "@/components/ui/Layout";

interface EtiquetteSection {
  id: string;
  title: string;
  icon: string;
  items: { rule: string; explanation: string; doOrDont: "do" | "dont" | "info" }[];
}

const sections: EtiquetteSection[] = [
  {
    id: "begroetingen",
    title: "Begroetingen & Communicatie",
    icon: "\u{1F647}",
    items: [
      { rule: "Buig bij begroeting", explanation: "Een lichte buiging (15\u00B0) is de standaard begroeting. Hoe dieper je buigt, hoe meer respect je toont. Als toerist is een lichte knik al prima.", doOrDont: "do" },
      { rule: "Spreek niet te hard", explanation: "Japanners praten over het algemeen zachter dan Nederlanders. Vooral in de trein, bus en restaurants wordt stilte gewaardeerd.", doOrDont: "do" },
      { rule: "Vermijd direct oogcontact", explanation: "Langdurig direct oogcontact kan als confronterend worden ervaren. Een zachte blik is beleefder.", doOrDont: "info" },
      { rule: "Gebruik twee handen", explanation: "Geef en ontvang visitekaartjes, geld en cadeaus altijd met twee handen. Dit is een teken van respect.", doOrDont: "do" },
      { rule: "Zeg niet gewoon \u2018nee\u2019", explanation: "Japanners vermijden direct \u2018nee\u2019 zeggen. Ze zullen eerder zeggen \u2018dat is misschien moeilijk\u2019 (\u3061\u3087\u3063\u3068\u96E3\u3057\u3044\u3067\u3059). Wees je hiervan bewust.", doOrDont: "info" },
      { rule: "Bel niet in het OV", explanation: "Telefoneren in de trein of bus is een grote faux pas. Zet je telefoon op stil (\u30DE\u30CA\u30FC\u30E2\u30FC\u30C9) en stuur desnoods een berichtje.", doOrDont: "dont" },
    ],
  },
  {
    id: "eten",
    title: "Eten & Drinken",
    icon: "\u{1F371}",
    items: [
      { rule: "Zeg \u2018itadakimasu\u2019 voor het eten", explanation: "Dit betekent letterlijk \u2018ik ontvang nederig\u2019 en is een dankzegging voor het eten. Vouw je handen licht samen en buig even.", doOrDont: "do" },
      { rule: "Zeg \u2018gochisousama deshita\u2019 na het eten", explanation: "Bedank de kok en het personeel na je maaltijd. Zeg het ook als je het restaurant verlaat.", doOrDont: "do" },
      { rule: "Slurp je noedels", explanation: "Slurpen is niet alleen geaccepteerd, het is een compliment! Het toont dat je geniet van de soep. Doe dit gerust bij ramen, soba en udon.", doOrDont: "do" },
      { rule: "Prik je eetstokjes niet rechtop in rijst", explanation: "Dit lijkt op wierookstokjes bij een begrafenisritueel en is erg respectloos. Leg je stokjes op het stokjessteuntje (\u7BB8\u7F6E\u304D).", doOrDont: "dont" },
      { rule: "Geef geen eten door van stokje naar stokje", explanation: "Dit doet denken aan een begrafenisritueel waarbij botten worden doorgegeven. Leg het eten eerst op een bord.", doOrDont: "dont" },
      { rule: "Schenk niet je eigen glas in", explanation: "Schenk altijd het glas van je tafelgenoot in, en zij doen hetzelfde voor jou. Dit heet \u2018oshaku\u2019 en is een sociaal ritueel.", doOrDont: "do" },
      { rule: "Geef geen fooi", explanation: "Fooi geven wordt in Japan als beledigend beschouwd. De service is altijd inclusief, en personeel wordt goed betaald. Laat geen extra geld achter.", doOrDont: "dont" },
      { rule: "Eet niet al wandelend", explanation: "Eten op straat of in het OV (behalve de shinkansen) wordt als onbeleefd gezien. Sta stil bij een eetstalletje of zoek een bankje.", doOrDont: "dont" },
      { rule: "Water is gratis", explanation: "In vrijwel elk restaurant krijg je gratis water of thee. Je hoeft dit niet apart te bestellen.", doOrDont: "info" },
    ],
  },
  {
    id: "tempels",
    title: "Tempels & Heiligdommen",
    icon: "\u26E9\uFE0F",
    items: [
      { rule: "Trek je schoenen uit", explanation: "Bij het betreden van tempels, ryokans en sommige restaurants moet je je schoenen uittrekken. Er staan vaak slippers klaar.", doOrDont: "do" },
      { rule: "Was je handen bij het temizuya", explanation: "Bij de ingang van een schrijn vind je een waterbak (temizuya). Was eerst je linkerhand, dan je rechterhand, dan spoel je mond (slik het niet door!).", doOrDont: "do" },
      { rule: "Gooi een munt en buig twee keer, klap twee keer", explanation: "Bij een Shinto-schrijn: gooi een munt (5 yen brengt geluk), buig twee keer diep, klap twee keer in je handen, bid, en buig nog een keer.", doOrDont: "do" },
      { rule: "Loop niet door het midden van de torii", explanation: "Het middenpad (\u6B63\u4E2D) is gereserveerd voor de goden. Loop aan de zijkant door de torii-poort.", doOrDont: "do" },
      { rule: "Wees stil en respectvol", explanation: "Tempels en schrijnen zijn heilige plaatsen. Praat zacht, lach niet te hard, en respecteer andere bezoekers.", doOrDont: "do" },
      { rule: "Vraag voor je foto\u2019s maakt", explanation: "Sommige gebieden in tempels zijn verboden voor fotografie. Let op borden met \u64AE\u5F71\u7981\u6B62 (fotograferen verboden).", doOrDont: "info" },
    ],
  },
  {
    id: "onsen",
    title: "Onsen (Warmwaterbronnen)",
    icon: "\u2668\uFE0F",
    items: [
      { rule: "Was je grondig voor je het bad ingaat", explanation: "Neem uitgebreid een douche op de waskrukjes v\u00F3\u00F3r je het gedeelde bad in gaat. Dit is de belangrijkste regel.", doOrDont: "do" },
      { rule: "Ga naakt het water in", explanation: "Zwemkleding is verboden in traditionele onsen. Iedereen gaat naakt. Er zijn gescheiden baden voor mannen en vrouwen.", doOrDont: "do" },
      { rule: "Leg je kleine handdoekje op je hoofd", explanation: "Het kleine handdoekje mag NIET in het water. Vouw het op en leg het op je hoofd \u2014 dit is de standaard gewoonte.", doOrDont: "do" },
      { rule: "Tatoeages kunnen een probleem zijn", explanation: "Veel onsen verbieden tatoeages vanwege de associatie met yakuza. Vraag altijd vooraf, of zoek \u2018tattoo-friendly\u2019 onsen.", doOrDont: "info" },
      { rule: "Niet zwemmen of spetteren", explanation: "Een onsen is een plek voor rust en ontspanning. Zit stil in het water en geniet. Zwemmen en lawaai zijn niet de bedoeling.", doOrDont: "dont" },
      { rule: "Drink genoeg water", explanation: "Het hete water kan uitdrogend werken. Drink water voor en na je bad. Veel onsen hebben gratis water of melk beschikbaar.", doOrDont: "do" },
    ],
  },
  {
    id: "openbaar",
    title: "Openbaar Vervoer",
    icon: "\u{1F689}",
    items: [
      { rule: "Sta in de rij", explanation: "Op perrons staan markeringen op de grond. Japanners vormen perfecte rijen. Voordringen is absoluut niet geaccepteerd.", doOrDont: "do" },
      { rule: "Laat mensen eerst uitstappen", explanation: "Wacht tot iedereen is uitgestapt voordat je instapt. Dit geldt voor treinen, liften en metro.", doOrDont: "do" },
      { rule: "Wees stil in de trein", explanation: "Praat zacht of helemaal niet. Luister naar muziek alleen met oordopjes. Zet je telefoon op stil.", doOrDont: "do" },
      { rule: "Niet eten in lokale treinen", explanation: "In lokale treinen en metro is eten niet gepast. In de shinkansen (hogesnelheidstrein) is het w\u00E9l normaal \u2014 er worden zelfs bento\u2019s verkocht!", doOrDont: "info" },
      { rule: "Sta aan de juiste kant op roltrappen", explanation: "In Tokyo sta je links en loop je rechts. In Osaka is het andersom! Let op wat anderen doen.", doOrDont: "info" },
      { rule: "Koop een IC-kaart", explanation: "Een Suica of Pasmo kaart werkt in heel Japan voor treinen, bussen, konbini en automaten. Koop er een bij aankomst op het vliegveld.", doOrDont: "do" },
      { rule: "Priority seats zijn heilig", explanation: "Ga niet op priority seats (\u512A\u5148\u5E2D) zitten als de trein vol begint te raken. Deze zijn voor ouderen, zwangeren en mensen met een beperking.", doOrDont: "do" },
    ],
  },
  {
    id: "dagelijks",
    title: "Dagelijks Leven",
    icon: "\u{1F3E0}",
    items: [
      { rule: "Sorteer je afval", explanation: "Japan heeft strikte afvalscheiding. Let op de bakken: brandbaar, niet-brandbaar, PET-flessen, blikjes. Neem je afval mee als er geen prullenbak is.", doOrDont: "do" },
      { rule: "Gebruik konbini voor alles", explanation: "Convenience stores (7-Eleven, Lawson, FamilyMart) zijn 24/7 open en hebben ATMs, eten, toiletten, wifi, print-service en meer.", doOrDont: "info" },
      { rule: "Heb altijd contant geld bij je", explanation: "Hoewel creditcards steeds vaker worden geaccepteerd, zijn veel kleine restaurants en winkels alleen contant. ATMs in konbini accepteren buitenlandse kaarten.", doOrDont: "do" },
      { rule: "Draag een mondkapje als je verkouden bent", explanation: "Het dragen van een mondkapje bij verkoudheid of griep is in Japan al decennia normaal. Het is een teken van beleefdheid naar anderen.", doOrDont: "do" },
      { rule: "Geef cadeaus netjes verpakt", explanation: "Presentatie is erg belangrijk. Als je een cadeau geeft, zorg dat het netjes is verpakt. Weiger een cadeau eerst beleefd een keer voordat je het accepteert.", doOrDont: "info" },
      { rule: "Spreek niet op je telefoon in liften", explanation: "In liften is het beleefd om stil te zijn. Een kort knikje naar anderen is een aardige begroeting.", doOrDont: "do" },
      { rule: "Neus snuiten in het openbaar is onbeleefd", explanation: "Snuit je neus niet in het openbaar, vooral niet aan tafel. Ga naar het toilet als het nodig is. Snuffen is wel geaccepteerd.", doOrDont: "dont" },
      { rule: "Japan is extreem veilig", explanation: "Japan is een van de veiligste landen ter wereld. Verloren portemonnees worden vaak ingeleverd bij de politie. Loop gerust \u2019s nachts rond.", doOrDont: "info" },
    ],
  },
  {
    id: "winkelen",
    title: "Winkelen & Geld",
    icon: "\u{1F4B4}",
    items: [
      { rule: "Leg geld in het geldbakje", explanation: "Bij de kassa staat een klein bakje. Leg je geld of kaart daarin, geef het niet direct aan de caissier.", doOrDont: "do" },
      { rule: "Niet afdingen", explanation: "Afdingen is in Japan niet gebruikelijk. De prijs is de prijs, behalve op sommige vlooienmarkten.", doOrDont: "dont" },
      { rule: "Tax-free winkelen", explanation: "Als toerist kun je bij aankopen boven \u00A55.000 belastingvrij (\u514D\u7A0E) winkelen. Neem altijd je paspoort mee.", doOrDont: "info" },
      { rule: "Combini-eten is verrassend goed", explanation: "Konbini-eten (onigiri, bento, sandwiches) is lekker, vers en goedkoop. Probeer het zeker!", doOrDont: "info" },
      { rule: "Vending machines zijn overal", explanation: "Japan heeft miljoenen automaten met dranken (warm \u00E9n koud), snacks en meer. Ze accepteren contant geld \u00E9n IC-kaarten.", doOrDont: "info" },
    ],
  },
  {
    id: "seizoenen",
    title: "Seizoenen & Evenementen",
    icon: "\u{1F338}",
    items: [
      { rule: "Sakura-seizoen (maart-april)", explanation: "Kersenbloesem is h\u00E9t hoogtepunt. Japanners doen hanami (picknicken onder bloesembomen). Populaire spots raken snel vol.", doOrDont: "info" },
      { rule: "Rainy season (juni-juli)", explanation: "De tsuyu (regenseizoen) brengt veel regen. Neem een paraplu mee. Transparante plastic paraplu\u2019s koop je overal voor \u00A5500.", doOrDont: "info" },
      { rule: "Zomer is heet en vochtig", explanation: "Juli-augustus zijn extreem warm (35\u00B0C+) en vochtig. Drink veel, gebruik een waaiertje en draag lichte kleding.", doOrDont: "info" },
      { rule: "Kouyou (november)", explanation: "De herfstbladeren zijn spectaculair, vooral in Kyoto en Nikko. Even mooi als de sakura!", doOrDont: "info" },
      { rule: "Nieuwjaar is de belangrijkste feestdag", explanation: "Veel winkels en restaurants sluiten rond 31 december - 3 januari. Tempels zijn dan juist druk met hatsumode (eerste tempelbezoek).", doOrDont: "info" },
      { rule: "Tyfoonseizoen (augustus-oktober)", explanation: "Tyfoons kunnen vluchten en treinen verstoren. Check het weer en heb een noodplan. Volg NHK World voor waarschuwingen.", doOrDont: "info" },
    ],
  },
];

function SectionCard({ section }: { section: EtiquetteSection }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="space-y-2">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center gap-3 bg-white rounded-2xl p-4 border border-stone-200 shadow-sm hover:shadow-md hover:border-rose-200 transition-all"
      >
        <span className="text-2xl">{section.icon}</span>
        <div className="flex-1 text-left">
          <h3 className="font-bold text-stone-800">{section.title}</h3>
          <p className="text-xs text-stone-500">
            {section.items.length} regels &amp; tips
          </p>
        </div>
        <ChevronDown
          className={`w-4 h-4 text-stone-400 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden space-y-2 pl-2"
          >
            {section.items.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                className="bg-white rounded-xl border border-stone-200 p-4"
              >
                <div className="flex items-start gap-3">
                  <span
                    className={`flex-shrink-0 mt-0.5 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                      item.doOrDont === "do"
                        ? "bg-emerald-100 text-emerald-700"
                        : item.doOrDont === "dont"
                        ? "bg-rose-100 text-rose-700"
                        : "bg-blue-100 text-blue-700"
                    }`}
                  >
                    {item.doOrDont === "do"
                      ? "\u2713"
                      : item.doOrDont === "dont"
                      ? "\u2717"
                      : "i"}
                  </span>
                  <div>
                    <h4 className="font-semibold text-stone-800 text-sm">
                      {item.rule}
                    </h4>
                    <p className="text-xs text-stone-500 mt-1 leading-relaxed">
                      {item.explanation}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function JapanGidsPage() {
  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <Link
            href="/reiszinnen"
            className="p-2 rounded-xl hover:bg-stone-100 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-stone-500" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-stone-800">
              Japanse Cultuur &amp; Etiquette
            </h1>
            <p className="text-stone-500 text-sm">
              Onmisbare omgangsvormen om je als toerist goed te gedragen
            </p>
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-3 text-xs">
          <span className="flex items-center gap-1.5 bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-full font-medium">
            <span className="w-4 h-4 rounded-full bg-emerald-100 flex items-center justify-center text-[10px] font-bold">&check;</span>
            Do
          </span>
          <span className="flex items-center gap-1.5 bg-rose-50 text-rose-700 px-3 py-1.5 rounded-full font-medium">
            <span className="w-4 h-4 rounded-full bg-rose-100 flex items-center justify-center text-[10px] font-bold">&cross;</span>
            Don&apos;t
          </span>
          <span className="flex items-center gap-1.5 bg-blue-50 text-blue-700 px-3 py-1.5 rounded-full font-medium">
            <span className="w-4 h-4 rounded-full bg-blue-100 flex items-center justify-center text-[10px] font-bold">i</span>
            Info
          </span>
        </div>

        {/* Sections */}
        <div className="space-y-3">
          {sections.map((section) => (
            <SectionCard key={section.id} section={section} />
          ))}
        </div>

        {/* Bottom CTA */}
        <Link
          href="/reiszinnen"
          className="block text-center bg-indigo-600 text-white rounded-2xl p-4 font-semibold hover:bg-indigo-700 transition-colors"
        >
          Bekijk alle reiszinnen &rarr;
        </Link>
      </div>
    </Layout>
  );
}
