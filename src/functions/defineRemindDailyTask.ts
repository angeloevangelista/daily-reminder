import { TaskScheduler } from "../TasksScheduler";
import * as tasks from "../tasks";

function defineRemindDailyTask(): string {
  const remindDailyTaskName = "remind-daily-task";

  const [dailyHour, dailyMinute] = process.env.DAILY_TIME!.split(":");

  const dailyMinutesToSendReminder = String(Number(dailyMinute) - 1).padStart(
    2,
    "0"
  );

  const cronExpression = `0 ${dailyMinutesToSendReminder} ${dailyHour} * * MON,TUE,WED,THU,FRI`;

  TaskScheduler.getInstance().addTask(
    remindDailyTaskName,
    cronExpression,
    tasks.remindDailyTask
  );

  return remindDailyTaskName;
}

export { defineRemindDailyTask };
