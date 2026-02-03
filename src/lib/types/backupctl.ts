export type CommandResult = {
  exitCode: number;
  stdout: string;
  stderr: string;
  startedAt: string;
  endedAt: string;
};

export type OnlineStatus = {
  online: boolean;
  detail?: string;
};

export type AppErrorKind = "cli" | "io" | "net" | "ui";

export type AppError = {
  kind: AppErrorKind;
  message: string;
  detail?: string;
  exitCode?: number;
  stdout?: string;
  stderr?: string;
};
