import axios from "axios";

import { createChatCard } from "../functions";

async function remindDailyTask(): Promise<void> {
  try {
    const dailyInviteLink = process.env.DAILY_INVITE_LINK as string;

    const chatCard = createChatCard(dailyInviteLink);

    const googleChatWebhookLink = process.env
      .GOOGLE_CHAT_WEBHOOK_LINK as string;

    await axios.post(googleChatWebhookLink, {
      cardsV2: [chatCard],
    });
  } catch (error) {
    console.dir({ error }, { depth: null });
  }
}

export { remindDailyTask };
