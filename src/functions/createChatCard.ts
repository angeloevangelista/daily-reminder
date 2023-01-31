import { v4 } from "uuid";
import { getDailyInviteMessage } from "./";

function createChatCard(dailyInviteLink: string) {
  const inviteMessage = getDailyInviteMessage();

  const chatCard = {
    cardId: v4(),
    card: {
      header: {
        title: "Ó a daily!",
        subtitle: "Te vejo amanhã, nesse mesmo horário, amigão 😉",
        imageUrl: "https://cdn-icons-png.flaticon.com/512/55/55281.png",
        imageType: "SQUARE",
        imageAltText: "Avatar for Pede a permissão pro pai",
      },
      sections: [
        {
          header: inviteMessage,
          widgets: [
            {
              buttonList: {
                buttons: [
                  {
                    text: "Bora lá",
                    color: {
                      red: (1 / 255) * 235,
                      green: (1 / 255) * 145,
                      blue: (1 / 255) * 26,
                      alpha: 1,
                    },
                    onClick: {
                      openLink: {
                        url: dailyInviteLink,
                      },
                    },
                  },
                ],
              },
            },
          ],
        },
      ],
    },
  };

  return chatCard;
}

export { createChatCard };
