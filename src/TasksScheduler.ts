import cron from "node-cron";

type TasksMap = {
  [key: string]:
    | {
        active: boolean;
        taskDefinition: string;
        cronTask: cron.ScheduledTask;
      }
    | undefined;
};

type TaskInfo = {
  key: string;
  active: boolean;
  taskDefinition: string;
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
    Object.values(this._tasksMap).forEach((task) => {
      task!.cronTask.stop();
      task!.active = false;
    });
  }

  public resumeAllTasks(): void {
    Object.values(this._tasksMap).forEach((task) => {
      task!.cronTask.start();
      task!.active = true;
    });
  }

  public pauseTask(taskKey: string): void {
    const cronTask = this._tasksMap[taskKey];

    if (!cronTask) throw new Error(`cron task "${taskKey}" not defined`);

    cronTask.cronTask.stop();
    cronTask.active = false;
  }

  public resumeTask(taskKey: string): void {
    const cronTask = this._tasksMap[taskKey];

    if (!cronTask) throw new Error(`cron task "${taskKey}" not defined`);

    cronTask.cronTask.start();
    cronTask.active = true;
  }

  public getTasks(): TaskInfo[] {
    const tasksInfo: TaskInfo[] = [];

    Object.entries(this._tasksMap).forEach(([taskKey, task]) => {
      tasksInfo.push({
        key: taskKey,
        active: task!.active,
        taskDefinition: this._tasksMap[taskKey]?.taskDefinition || "???",
      });
    });

    return tasksInfo;
  }

  public addTask(
    taskKey: string,
    cronExpression: string,
    taskCallback: (now: Date | "manual" | "init") => void
  ): cron.ScheduledTask {
    const cronTask = cron.schedule(cronExpression, taskCallback, {
      name: taskKey,
      scheduled: false,
      timezone: "America/Sao_Paulo",
    });

    this._tasksMap[taskKey] = {
      active: false,
      cronTask,
      taskDefinition: cronExpression,
    };

    return cronTask;
  }
}

export { TaskScheduler };
