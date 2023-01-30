import cron from "node-cron";

type TasksMap = {
  [key: string]: cron.ScheduledTask | undefined;
};

class TaskScheduler {
  private _tasksMap: TasksMap;
  private static _taskSchedulerInstance: TaskScheduler;

  private constructor() {
    this._tasksMap = {};
  }

  public static getInstance() {
    if (!this._taskSchedulerInstance) {
      this._taskSchedulerInstance = new TaskScheduler();
    }

    return this._taskSchedulerInstance;
  }

  public pauseAllTasks(): void {
    Object.values(this._tasksMap).forEach((task) => task?.stop());
  }

  public resumeAllTasks(): void {
    Object.values(this._tasksMap).forEach((task) => task?.start());
  }

  public getTasks(): TasksMap {
    return { ...this._tasksMap };
  }

  public pauseTask(taskKey: string): void {
    const cronTask = this._tasksMap[taskKey];

    if (!cronTask) throw new Error(`cron task "${taskKey}" not defined`);

    cronTask.stop();
  }

  public resumeTask(taskKey: string): void {
    const cronTask = this._tasksMap[taskKey];

    if (!cronTask) throw new Error(`cron task "${taskKey}" not defined`);

    cronTask.start();
  }

  public addTask(
    taskKey: string,
    cronExpression: string,
    taskCallback: (now: Date | "manual" | "init") => void
  ): cron.ScheduledTask {
    const cronTask = cron.schedule(cronExpression, taskCallback, {
      name: taskKey,
      scheduled: false,
    });

    this._tasksMap[taskKey] = cronTask;

    return cronTask;
  }
}

export { TaskScheduler };
