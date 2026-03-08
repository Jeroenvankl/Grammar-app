"use client";

interface FuriganaProps {
  kanji: string;
  reading: string;
  className?: string;
}

export default function Furigana({ kanji, reading, className = "" }: FuriganaProps) {
  return (
    <ruby className={`font-[family-name:'Noto_Sans_JP'] ${className}`}>
      {kanji}
      <rp>(</rp>
      <rt>{reading}</rt>
      <rp>)</rp>
    </ruby>
  );
}

export function parseFurigana(text: string): React.ReactNode[] {
  // Parse format: {漢字|かんじ} into Furigana components
  const parts = text.split(/(\{[^}]+\})/g);
  return parts.map((part, i) => {
    const match = part.match(/^\{(.+)\|(.+)\}$/);
    if (match) {
      return <Furigana key={i} kanji={match[1]} reading={match[2]} />;
    }
    return <span key={i}>{part}</span>;
  });
}
