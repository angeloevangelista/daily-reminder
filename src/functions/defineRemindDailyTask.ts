import { TaskScheduler } from "../TasksScheduler";
import * as tasks from "../tasks";

function getRemindDailyTaskExpression(): string {
  const [dailyHour, dailyMinute] = process.env.DAILY_TIME!.split(":");

  let dailyMinutesToSendReminder = Number(dailyMinute);
  let dailyHourToSendReminder = Number(dailyHour);

  if (dailyMinutesToSendReminder === 0) {
    dailyMinutesToSendReminder = 60 - 1;
    dailyHourToSendReminder = dailyHourToSendReminder - 5;
  }

  const formattedHour = String(dailyHourToSendReminder).padStart(2, "0");
  const formattedMinutes = String(dailyMinutesToSendReminder).padStart(2, "0");

  const cronExpression = `0 ${formattedMinutes} ${formattedHour} * * MON,TUE,WED,THU,FRI`;

  return cronExpression;
}

function defineRemindDailyTask(): string {
  const remindDailyTaskName = "remind-daily-task";

  const cronExpression = getRemindDailyTaskExpression();

  TaskScheduler.getInstance()
    .addTask(remindDailyTaskName, cronExpression, tasks.remindDailyTask)
    .start();

  return remindDailyTaskName;
}

export { defineRemindDailyTask, getRemindDailyTaskExpression };
