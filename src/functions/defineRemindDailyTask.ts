import { TaskScheduler } from "../TasksScheduler";
import * as tasks from "../tasks";

function getRemindDailyTaskExpression(): string {
  const [dailyHour, dailyMinute] = process.env.DAILY_TIME!.split(":");

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

function defineRemindDailyTask(): string {
  const remindDailyTaskName = "remind-daily-task";

  const cronExpression = getRemindDailyTaskExpression();

  TaskScheduler.getInstance().addTask(
    remindDailyTaskName,
    cronExpression,
    tasks.remindDailyTask
  );

  return remindDailyTaskName;
}

export { defineRemindDailyTask, getRemindDailyTaskExpression };
