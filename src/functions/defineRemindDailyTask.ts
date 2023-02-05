import { exit } from "process";

import * as tasks from "../tasks";
import { TaskScheduler } from "../TasksScheduler";

function getRemindDailyTaskExpression(dailyTime: string): string {
  const [dailyHour, dailyMinute] = dailyTime.split(":");

  const minutesToDiscountOnReminder = 5;

  let dailyMinutesToSendReminder =
    Number(dailyMinute) - minutesToDiscountOnReminder;

  let dailyHourToSendReminder = Number(dailyHour);

  if (dailyMinutesToSendReminder < 0) {
    dailyMinutesToSendReminder = 60 + dailyMinutesToSendReminder;
    dailyHourToSendReminder = dailyHourToSendReminder - 1;
  }

  if (dailyHourToSendReminder < 0) {
    dailyHourToSendReminder = 24 + dailyHourToSendReminder;
  }

  const formattedHour = String(dailyHourToSendReminder).padStart(2, "0");
  const formattedMinutes = String(dailyMinutesToSendReminder).padStart(2, "0");

  const cronExpression = `0 ${formattedMinutes} ${formattedHour} * * MON,TUE,WED,THU,FRI`;

  return cronExpression;
}

function defineRemindDailyTask() {
  const dailyCollection = process.env.DAILY_COLLECTION?.split(";");

  if (!dailyCollection) {
    console.error(`Environment key "DAILY_COLLECTION" is not defined`);
    exit(1);
  }

  dailyCollection
    .filter((p) => p.trim())
    .forEach((dailyDataString, index) => {
      const [dailyTime, dailyLink, chatWebhookLink] =
        dailyDataString.split(",");

      const remindDailyTaskName = `remind-daily-task-${index}`;

      const cronExpression = getRemindDailyTaskExpression(dailyTime);

      TaskScheduler.getInstance().addTask(
        remindDailyTaskName,
        cronExpression,
        () => tasks.remindDailyTask(dailyLink, chatWebhookLink)
      );
    });
}

export { defineRemindDailyTask, getRemindDailyTaskExpression };
