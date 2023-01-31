import fs from "fs";
import path from "path";

type Quote = {
  text: string;
  used_times: number;
};

function getDailyInviteMessage(): string {
  const quotesFilePath = path.resolve(__dirname, "..", "quotes.json");

  const quotesRawContent = fs.readFileSync(quotesFilePath).toString();

  const quotes = JSON.parse(quotesRawContent) as Quote[];

  let lowestUsedCount =
    quotes.sort((a, b) => a.used_times - b.used_times).at(0)?.used_times || 0;

  const lessUsedQuotes = quotes.filter((p) => p.used_times === lowestUsedCount);

  const randomIndex = Math.floor(Math.random() * lessUsedQuotes.length);

  const currentQuote = lessUsedQuotes[randomIndex];

  let updatedQuotes =
    lowestUsedCount == 5
      ? quotes.map((p) =>
          p.text === currentQuote.text
            ? { ...p, used_times: 1 }
            : { ...p, used_times: 0 }
        )
      : quotes.map((p) =>
          p.text === currentQuote.text
            ? { ...p, used_times: p.used_times + 1 }
            : p
        );

  fs.writeFileSync(quotesFilePath, JSON.stringify(updatedQuotes, null, 2));

  return currentQuote.text;
}

export { getDailyInviteMessage };
