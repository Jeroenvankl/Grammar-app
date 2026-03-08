export interface TravelPhrase {
  id: string;
  japanese: string;
  romaji: string;
  dutch: string;
  context?: string;
  audio?: string; // for future TTS
}

export interface PhraseCategory {
  id: string;
  name: string;
  icon: string;
  description: string;
  phrases: TravelPhrase[];
}

export const japaneseTravelPhrases: PhraseCategory[] = [
  {
    id: "basis",
    name: "Basis & Begroetingen",
    icon: "👋",
    description: "De allerbelangrijkste zinnen die je overal nodig hebt",
    phrases: [
      { id: "b1", japanese: "こんにちは", romaji: "Konnichiwa", dutch: "Hallo / Goedemiddag" },
      { id: "b2", japanese: "おはようございます", romaji: "Ohayou gozaimasu", dutch: "Goedemorgen" },
      { id: "b3", japanese: "こんばんは", romaji: "Konbanwa", dutch: "Goedenavond" },
      { id: "b4", japanese: "ありがとうございます", romaji: "Arigatou gozaimasu", dutch: "Heel erg bedankt" },
      { id: "b5", japanese: "すみません", romaji: "Sumimasen", dutch: "Pardon / Excuseer me / Sorry" },
      { id: "b6", japanese: "はい", romaji: "Hai", dutch: "Ja" },
      { id: "b7", japanese: "いいえ", romaji: "Iie", dutch: "Nee" },
      { id: "b8", japanese: "お願いします", romaji: "Onegai shimasu", dutch: "Alstublieft (bij een verzoek)" },
      { id: "b9", japanese: "大丈夫です", romaji: "Daijoubu desu", dutch: "Het is oké / Geen probleem" },
      { id: "b10", japanese: "わかりません", romaji: "Wakarimasen", dutch: "Ik begrijp het niet" },
      { id: "b11", japanese: "日本語が話せません", romaji: "Nihongo ga hanasemasen", dutch: "Ik spreek geen Japans" },
      { id: "b12", japanese: "英語を話せますか？", romaji: "Eigo wo hanasemasu ka?", dutch: "Spreekt u Engels?" },
    ],
  },
  {
    id: "transport",
    name: "Openbaar Vervoer",
    icon: "🚆",
    description: "Trein, metro, bus en taxi — kom overal in Japan",
    phrases: [
      { id: "t1", japanese: "〜駅はどこですか？", romaji: "~ eki wa doko desu ka?", dutch: "Waar is station ~?", context: "Vervang ~ door de stationsnaam" },
      { id: "t2", japanese: "切符を一枚ください", romaji: "Kippu wo ichimai kudasai", dutch: "Een kaartje alstublieft" },
      { id: "t3", japanese: "東京行きの電車はどれですか？", romaji: "Toukyou-iki no densha wa dore desu ka?", dutch: "Welke trein gaat naar Tokyo?" },
      { id: "t4", japanese: "次の電車は何時ですか？", romaji: "Tsugi no densha wa nanji desu ka?", dutch: "Hoe laat is de volgende trein?" },
      { id: "t5", japanese: "乗り換えはありますか？", romaji: "Norikae wa arimasu ka?", dutch: "Moet ik overstappen?" },
      { id: "t6", japanese: "このバスは〜に行きますか？", romaji: "Kono basu wa ~ ni ikimasu ka?", dutch: "Gaat deze bus naar ~?" },
      { id: "t7", japanese: "タクシーを呼んでください", romaji: "Takushii wo yonde kudasai", dutch: "Kunt u een taxi bellen?" },
      { id: "t8", japanese: "ここで降ります", romaji: "Koko de orimasu", dutch: "Ik stap hier uit" },
      { id: "t9", japanese: "Suicaカードをチャージしたいです", romaji: "Suica kaado wo chaaji shitai desu", dutch: "Ik wil mijn Suica-kaart opladen" },
      { id: "t10", japanese: "終電は何時ですか？", romaji: "Shuuden wa nanji desu ka?", dutch: "Hoe laat is de laatste trein?" },
    ],
  },
  {
    id: "restaurant",
    name: "Restaurant & Eten",
    icon: "🍜",
    description: "Bestellen, afrekenen en dieetwensen aangeven",
    phrases: [
      { id: "r1", japanese: "二人です", romaji: "Futari desu", dutch: "Met twee personen", context: "Bij binnenkomst restaurant" },
      { id: "r2", japanese: "メニューをください", romaji: "Menyuu wo kudasai", dutch: "Het menu alstublieft" },
      { id: "r3", japanese: "これをください", romaji: "Kore wo kudasai", dutch: "Dit alstublieft", context: "Wijs naar wat je wilt op het menu" },
      { id: "r4", japanese: "おすすめは何ですか？", romaji: "Osusume wa nan desu ka?", dutch: "Wat is de aanbeveling?" },
      { id: "r5", japanese: "お会計お願いします", romaji: "Okaikei onegai shimasu", dutch: "De rekening alstublieft" },
      { id: "r6", japanese: "ベジタリアンの料理はありますか？", romaji: "Bejitarian no ryouri wa arimasu ka?", dutch: "Heeft u vegetarische gerechten?" },
      { id: "r7", japanese: "アレルギーがあります", romaji: "Arerugii ga arimasu", dutch: "Ik heb een allergie" },
      { id: "r8", japanese: "とてもおいしいです！", romaji: "Totemo oishii desu!", dutch: "Het is erg lekker!" },
      { id: "r9", japanese: "水をください", romaji: "Mizu wo kudasai", dutch: "Water alstublieft" },
      { id: "r10", japanese: "いただきます", romaji: "Itadakimasu", dutch: "Smakelijk eten (voor het eten)", context: "Japans gebruik: zeg dit altijd voor je begint te eten" },
      { id: "r11", japanese: "ごちそうさまでした", romaji: "Gochisousama deshita", dutch: "Dank voor het eten (na het eten)", context: "Zeg dit wanneer je klaar bent" },
      { id: "r12", japanese: "予約をしたいのですが", romaji: "Yoyaku wo shitai no desu ga", dutch: "Ik zou graag willen reserveren" },
    ],
  },
  {
    id: "hotel",
    name: "Hotel & Accommodatie",
    icon: "🏨",
    description: "Inchecken, kamerverzoeken en uitchecken",
    phrases: [
      { id: "h1", japanese: "予約があります", romaji: "Yoyaku ga arimasu", dutch: "Ik heb een reservering" },
      { id: "h2", japanese: "チェックインお願いします", romaji: "Chekkuin onegai shimasu", dutch: "Ik wil graag inchecken" },
      { id: "h3", japanese: "チェックアウトは何時ですか？", romaji: "Chekkuauto wa nanji desu ka?", dutch: "Hoe laat is uitchecken?" },
      { id: "h4", japanese: "Wi-Fiのパスワードは何ですか？", romaji: "Waifai no pasuwaado wa nan desu ka?", dutch: "Wat is het Wi-Fi wachtwoord?" },
      { id: "h5", japanese: "タオルをもう一枚ください", romaji: "Taoru wo mou ichimai kudasai", dutch: "Nog een handdoek alstublieft" },
      { id: "h6", japanese: "部屋を掃除してください", romaji: "Heya wo souji shite kudasai", dutch: "Kunt u de kamer schoonmaken?" },
      { id: "h7", japanese: "荷物を預けてもいいですか？", romaji: "Nimotsu wo azukete mo ii desu ka?", dutch: "Mag ik mijn bagage achterlaten?" },
      { id: "h8", japanese: "近くにコンビニはありますか？", romaji: "Chikaku ni konbini wa arimasu ka?", dutch: "Is er een convenience store in de buurt?" },
    ],
  },
  {
    id: "winkelen",
    name: "Winkelen",
    icon: "🛍️",
    description: "Prijzen vragen, betalen en belastingvrij winkelen",
    phrases: [
      { id: "w1", japanese: "いくらですか？", romaji: "Ikura desu ka?", dutch: "Hoeveel kost het?" },
      { id: "w2", japanese: "これを試着してもいいですか？", romaji: "Kore wo shichaku shite mo ii desu ka?", dutch: "Mag ik dit passen?" },
      { id: "w3", japanese: "もう少し安いのはありますか？", romaji: "Mou sukoshi yasui no wa arimasu ka?", dutch: "Heeft u iets goedkopers?" },
      { id: "w4", japanese: "カードで払えますか？", romaji: "Kaado de haraemasu ka?", dutch: "Kan ik met een kaart betalen?" },
      { id: "w5", japanese: "免税で買えますか？", romaji: "Menzei de kaemasu ka?", dutch: "Kan ik belastingvrij kopen?", context: "Bij aankopen boven ¥5.000 als toerist" },
      { id: "w6", japanese: "袋はいりません", romaji: "Fukuro wa irimasen", dutch: "Ik heb geen tas nodig" },
      { id: "w7", japanese: "Sサイズはありますか？", romaji: "Esu saizu wa arimasu ka?", dutch: "Heeft u maat S?" },
      { id: "w8", japanese: "プレゼント用に包んでください", romaji: "Purezento-you ni tsutsunde kudasai", dutch: "Kunt u het als cadeau inpakken?" },
    ],
  },
  {
    id: "navigatie",
    name: "Weg Vragen & Navigatie",
    icon: "🗺️",
    description: "De weg vinden in steden en naar bezienswaardigheden",
    phrases: [
      { id: "n1", japanese: "〜はどこですか？", romaji: "~ wa doko desu ka?", dutch: "Waar is ~?" },
      { id: "n2", japanese: "ここはどこですか？", romaji: "Koko wa doko desu ka?", dutch: "Waar ben ik?" },
      { id: "n3", japanese: "地図を見せてもらえますか？", romaji: "Chizu wo misete moraemasu ka?", dutch: "Kunt u me de kaart laten zien?" },
      { id: "n4", japanese: "まっすぐ行ってください", romaji: "Massugu itte kudasai", dutch: "Ga rechtdoor" },
      { id: "n5", japanese: "右に曲がってください", romaji: "Migi ni magatte kudasai", dutch: "Sla rechtsaf" },
      { id: "n6", japanese: "左に曲がってください", romaji: "Hidari ni magatte kudasai", dutch: "Sla linksaf" },
      { id: "n7", japanese: "歩いてどのくらいですか？", romaji: "Aruite dono kurai desu ka?", dutch: "Hoe ver is het lopen?" },
      { id: "n8", japanese: "トイレはどこですか？", romaji: "Toire wa doko desu ka?", dutch: "Waar is het toilet?" },
    ],
  },
  {
    id: "noodgevallen",
    name: "Noodgevallen & Hulp",
    icon: "🆘",
    description: "Medische hulp, politie en noodsituaties",
    phrases: [
      { id: "e1", japanese: "助けてください！", romaji: "Tasukete kudasai!", dutch: "Help alstublieft!" },
      { id: "e2", japanese: "警察を呼んでください", romaji: "Keisatsu wo yonde kudasai", dutch: "Bel de politie alstublieft" },
      { id: "e3", japanese: "救急車を呼んでください", romaji: "Kyuukyuusha wo yonde kudasai", dutch: "Bel een ambulance alstublieft" },
      { id: "e4", japanese: "病院に行きたいです", romaji: "Byouin ni ikitai desu", dutch: "Ik wil naar het ziekenhuis" },
      { id: "e5", japanese: "パスポートをなくしました", romaji: "Pasupooto wo nakushimashita", dutch: "Ik ben mijn paspoort kwijt" },
      { id: "e6", japanese: "具合が悪いです", romaji: "Guai ga warui desu", dutch: "Ik voel me niet lekker" },
      { id: "e7", japanese: "薬局はどこですか？", romaji: "Yakkyoku wa doko desu ka?", dutch: "Waar is de apotheek?" },
      { id: "e8", japanese: "オランダ大使館はどこですか？", romaji: "Oranda taishikan wa doko desu ka?", dutch: "Waar is de Nederlandse ambassade?" },
    ],
  },
  {
    id: "cultuur",
    name: "Cultuur & Etiquette",
    icon: "⛩️",
    description: "Tempels, onsen en culturele gebruiken",
    phrases: [
      { id: "c1", japanese: "写真を撮ってもいいですか？", romaji: "Shashin wo totte mo ii desu ka?", dutch: "Mag ik een foto nemen?" },
      { id: "c2", japanese: "靴を脱ぎますか？", romaji: "Kutsu wo nugimasu ka?", dutch: "Moet ik mijn schoenen uittrekken?" },
      { id: "c3", japanese: "お寺の参拝方法を教えてください", romaji: "Otera no sanpai houhou wo oshiete kudasai", dutch: "Kunt u uitleggen hoe ik in de tempel moet bidden?" },
      { id: "c4", japanese: "温泉の入り方を教えてください", romaji: "Onsen no hairikata wo oshiete kudasai", dutch: "Kunt u uitleggen hoe ik de onsen gebruik?" },
      { id: "c5", japanese: "チップは必要ですか？", romaji: "Chippu wa hitsuyou desu ka?", dutch: "Is fooi geven nodig?", context: "Antwoord: Nee! In Japan geef je geen fooi." },
      { id: "c6", japanese: "お土産におすすめは何ですか？", romaji: "Omiyage ni osusume wa nan desu ka?", dutch: "Wat raadt u aan als souvenir?" },
    ],
  },
];
