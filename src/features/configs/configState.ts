export type TargetConfig = {
  name: string;
  remote: {
    host: string;
    port: number | "";
    user: string;
    passwordFile: string;
    destModule: string;
    destFolder: string;
  };
  rsync: {
    excludeOutputFolder: string;
    excludeFrom: string;
    excludes: string[];
    includes: string[];
    sources: string[];
    options: {
      verbose: boolean;
      showProgress: boolean;
      compress: boolean;
      deleteMode: string;
      itemizeChanges: boolean;
      keepSpecials: boolean;
      keepDevices: boolean;
    };
  };
  schedule: {
    weekday: string;
    month: string;
    day: string;
    hour: string;
    minute: string;
  };
  notification: {
    email: {
      from: string;
      to: string[];
      password: string;
      smtpServer: string;
      smtpPort: number | "";
      smtpSsl: boolean;
    };
    webhooks: Array<{
      name: string;
      type: string;
      url: string;
      events: string[];
      timeout: string;
      maxRetries: number | "";
      headers: string;
    }>;
  };
};

export type ConfigDraft = {
  excludeOutput: string;
  targets: TargetConfig[];
};

export type ConfigListItem = {
  name: string;
  path: string;
  updatedAt: string;
};

export const CONFIG_DIR = "~/.backups/configs";

export const scheduleOptions = {
  weekday: ["any", "0", "1", "2", "3", "4", "5", "6", "7"],
  month: ["any", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"],
  day: ["any", ...Array.from({ length: 31 }, (_, i) => String(i + 1))],
  hour: ["any", ...Array.from({ length: 24 }, (_, i) => String(i))],
  minute: ["any", ...Array.from({ length: 60 }, (_, i) => String(i))]
};

export const emptyTarget = (name: string): TargetConfig => ({
  name,
  remote: {
    host: "",
    port: "",
    user: "",
    passwordFile: "",
    destModule: "",
    destFolder: ""
  },
  rsync: {
    excludeOutputFolder: "",
    excludeFrom: "",
    excludes: [""],
    includes: [""],
    sources: [""],
    options: {
      verbose: false,
      showProgress: false,
      compress: false,
      deleteMode: "after",
      itemizeChanges: false,
      keepSpecials: false,
      keepDevices: false
    }
  },
  schedule: {
    weekday: "any",
    month: "any",
    day: "any",
    hour: "any",
    minute: "any"
  },
  notification: {
    email: {
      from: "",
      to: [""],
      password: "",
      smtpServer: "",
      smtpPort: "",
      smtpSsl: false
    },
    webhooks: [
      {
        name: "",
        type: "discord",
        url: "",
        events: [],
        timeout: "",
        maxRetries: "",
        headers: ""
      }
    ]
  }
});
