import axios from "axios";

import { createChatCard } from "../functions";

async function remindDailyTask(
  dailyLink: string,
  chatWebhookLink: string
): Promise<void> {
  try {
    const chatCard = createChatCard(dailyLink);

    await axios.post(chatWebhookLink, {
      cardsV2: [chatCard],
    });
  } catch (error) {
    console.dir({ error }, { depth: null });
  }
}

export { remindDailyTask };
