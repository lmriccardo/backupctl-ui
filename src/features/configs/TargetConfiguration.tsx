import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Field } from "../../components/Field";
import { ListField } from "../../components/ListField";
import { PathField } from "../../components/PathField";
import { PathListField } from "../../components/PathListField";
import { SelectField } from "../../components/SelectField";
import { ToggleField } from "../../components/ToggleField";
import { useBreadcrumb } from "../../app/BreadcrumbProvider";
import { useConfigs } from "./ConfigsProvider";
import { scheduleOptions } from "./configState";

export function TargetConfiguration() {
  const { name, target } = useParams();
  const navigate = useNavigate();
  const { updateConfig, normalizeName, getBySlug, saveConfig, setLastTarget } = useConfigs();
  const { setBreadcrumb } = useBreadcrumb();
  const [configTab, setConfigTab] = useState<"remote" | "rsync" | "schedule" | "notification">("remote");
  const [notificationTab, setNotificationTab] = useState<"email" | "webhooks">("email");

  const record = getBySlug(name ?? "");
  const currentTarget = record?.draft.targets.find((item) => item.name === target);
  const slug = record ? record.fileName || normalizeName(record.name) : (name ?? "");
  const initialSnapshot = useRef<string>("");

  useEffect(() => {
    if (currentTarget) {
      initialSnapshot.current = JSON.stringify(currentTarget);
    }
  }, [record?.name, currentTarget?.name]);

  const isDirty = useMemo(() => {
    if (!currentTarget) return false;
    return initialSnapshot.current !== JSON.stringify(currentTarget);
  }, [currentTarget]);

  useEffect(() => {
    if (record && currentTarget) {
      const normalized = record.fileName || normalizeName(record.name);
      setBreadcrumb(`Configurations / ${normalized} / ${currentTarget.name}`);
      if (record.lastTarget !== currentTarget.name) {
        setLastTarget(normalized, currentTarget.name);
      }
    }
  }, [record, currentTarget, normalizeName, setBreadcrumb, setLastTarget]);

  if (!record || !currentTarget) {
    return (
      <main className="grid">
        <section className="card">
          <h2>Target not found</h2>
          <button type="button" onClick={() => navigate("/configurations")}>Back to list</button>
        </section>
      </main>
    );
  }

  const updateTarget = (nextTarget: typeof currentTarget) => {
    updateConfig(slug, (draft) => ({
      ...draft,
      targets: draft.targets.map((item) => (item.name === currentTarget.name ? nextTarget : item))
    }));
  };

  return (
    <main className="grid">
      <section className="card">
        <div className="config-header">
          <div>
            <h2 className="primary-title">{currentTarget.name}</h2>
            <p className="subtitle">Target configuration</p>
          </div>
          <button
            type="button"
            className="text-button"
            onClick={() => {
              saveConfig(slug);
              navigate(`/configurations/${slug}`);
            }}
          >
            ← Back to targets
          </button>
        </div>

        <div className="tabs">
          {(["remote", "rsync", "schedule", "notification"] as const).map((tab) => (
            <button
              key={tab}
              type="button"
              className={configTab === tab ? "active" : ""}
              onClick={() => setConfigTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>

        {configTab === "remote" && (
          <div className="form-grid">
            <Field label="Host">
              <input
                type="text"
                value={currentTarget.remote.host}
                onChange={(event) =>
                  updateTarget({
                    ...currentTarget,
                    remote: { ...currentTarget.remote, host: event.target.value }
                  })
                }
              />
            </Field>
            <Field label="Port">
              <input
                type="number"
                min={1}
                max={65535}
                value={currentTarget.remote.port}
                onChange={(event) =>
                  updateTarget({
                    ...currentTarget,
                    remote: {
                      ...currentTarget.remote,
                      port: event.target.value === "" ? "" : Number(event.target.value)
                    }
                  })
                }
              />
            </Field>
            <Field label="User">
              <input
                type="text"
                value={currentTarget.remote.user}
                onChange={(event) =>
                  updateTarget({
                    ...currentTarget,
                    remote: { ...currentTarget.remote, user: event.target.value }
                  })
                }
              />
            </Field>
            <PathField
              label="Password file"
              value={currentTarget.remote.passwordFile}
              onChange={(value) =>
                updateTarget({
                  ...currentTarget,
                  remote: { ...currentTarget.remote, passwordFile: value }
                })
              }
            />
            <Field label="Dest module">
              <input
                type="text"
                value={currentTarget.remote.destModule}
                onChange={(event) =>
                  updateTarget({
                    ...currentTarget,
                    remote: { ...currentTarget.remote, destModule: event.target.value }
                  })
                }
              />
            </Field>
            <Field label="Dest folder">
              <input
                type="text"
                value={currentTarget.remote.destFolder}
                onChange={(event) =>
                  updateTarget({
                    ...currentTarget,
                    remote: { ...currentTarget.remote, destFolder: event.target.value }
                  })
                }
              />
            </Field>
          </div>
        )}

        {configTab === "rsync" && (
          <div className="form-stack">
            <PathField
              label="Exclude output folder"
              value={currentTarget.rsync.excludeOutputFolder}
              onChange={(value) =>
                updateTarget({
                  ...currentTarget,
                  rsync: { ...currentTarget.rsync, excludeOutputFolder: value }
                })
              }
              directory
            />
            <PathField
              label="Exclude from"
              value={currentTarget.rsync.excludeFrom}
              onChange={(value) =>
                updateTarget({
                  ...currentTarget,
                  rsync: { ...currentTarget.rsync, excludeFrom: value }
                })
              }
            />
            <PathListField
              label="Excludes"
              values={currentTarget.rsync.excludes}
              onChange={(values) =>
                updateTarget({
                  ...currentTarget,
                  rsync: { ...currentTarget.rsync, excludes: values }
                })
              }
            />
            <PathListField
              label="Includes"
              values={currentTarget.rsync.includes}
              onChange={(values) =>
                updateTarget({
                  ...currentTarget,
                  rsync: { ...currentTarget.rsync, includes: values }
                })
              }
            />
            <PathListField
              label="Sources"
              values={currentTarget.rsync.sources}
              onChange={(values) =>
                updateTarget({
                  ...currentTarget,
                  rsync: { ...currentTarget.rsync, sources: values }
                })
              }
              directory
            />

            <div className="options-grid">
              <ToggleField
                label="Verbose"
                checked={currentTarget.rsync.options.verbose}
                onChange={(checked) =>
                  updateTarget({
                    ...currentTarget,
                    rsync: {
                      ...currentTarget.rsync,
                      options: { ...currentTarget.rsync.options, verbose: checked }
                    }
                  })
                }
              />
              <ToggleField
                label="Show progress"
                checked={currentTarget.rsync.options.showProgress}
                onChange={(checked) =>
                  updateTarget({
                    ...currentTarget,
                    rsync: {
                      ...currentTarget.rsync,
                      options: { ...currentTarget.rsync.options, showProgress: checked }
                    }
                  })
                }
              />
              <ToggleField
                label="Compress"
                checked={currentTarget.rsync.options.compress}
                onChange={(checked) =>
                  updateTarget({
                    ...currentTarget,
                    rsync: {
                      ...currentTarget.rsync,
                      options: { ...currentTarget.rsync.options, compress: checked }
                    }
                  })
                }
              />
              <Field label="Delete mode">
                <input
                  type="text"
                  value={currentTarget.rsync.options.deleteMode}
                  onChange={(event) =>
                    updateTarget({
                      ...currentTarget,
                      rsync: {
                        ...currentTarget.rsync,
                        options: { ...currentTarget.rsync.options, deleteMode: event.target.value }
                      }
                    })
                  }
                />
              </Field>
              <ToggleField
                label="Itemize changes"
                checked={currentTarget.rsync.options.itemizeChanges}
                onChange={(checked) =>
                  updateTarget({
                    ...currentTarget,
                    rsync: {
                      ...currentTarget.rsync,
                      options: { ...currentTarget.rsync.options, itemizeChanges: checked }
                    }
                  })
                }
              />
              <ToggleField
                label="Keep specials"
                checked={currentTarget.rsync.options.keepSpecials}
                onChange={(checked) =>
                  updateTarget({
                    ...currentTarget,
                    rsync: {
                      ...currentTarget.rsync,
                      options: { ...currentTarget.rsync.options, keepSpecials: checked }
                    }
                  })
                }
              />
              <ToggleField
                label="Keep devices"
                checked={currentTarget.rsync.options.keepDevices}
                onChange={(checked) =>
                  updateTarget({
                    ...currentTarget,
                    rsync: {
                      ...currentTarget.rsync,
                      options: { ...currentTarget.rsync.options, keepDevices: checked }
                    }
                  })
                }
              />
            </div>
          </div>
        )}

        {configTab === "schedule" && (
          <div className="form-grid">
            <SelectField
              label="Weekday"
              value={currentTarget.schedule.weekday}
              options={scheduleOptions.weekday}
              onChange={(value) =>
                updateTarget({
                  ...currentTarget,
                  schedule: { ...currentTarget.schedule, weekday: value }
                })
              }
            />
            <SelectField
              label="Month"
              value={currentTarget.schedule.month}
              options={scheduleOptions.month}
              onChange={(value) =>
                updateTarget({
                  ...currentTarget,
                  schedule: { ...currentTarget.schedule, month: value }
                })
              }
            />
            <SelectField
              label="Day"
              value={currentTarget.schedule.day}
              options={scheduleOptions.day}
              onChange={(value) =>
                updateTarget({
                  ...currentTarget,
                  schedule: { ...currentTarget.schedule, day: value }
                })
              }
            />
            <SelectField
              label="Hour"
              value={currentTarget.schedule.hour}
              options={scheduleOptions.hour}
              onChange={(value) =>
                updateTarget({
                  ...currentTarget,
                  schedule: { ...currentTarget.schedule, hour: value }
                })
              }
            />
            <SelectField
              label="Minute"
              value={currentTarget.schedule.minute}
              options={scheduleOptions.minute}
              onChange={(value) =>
                updateTarget({
                  ...currentTarget,
                  schedule: { ...currentTarget.schedule, minute: value }
                })
              }
            />
          </div>
        )}

        {configTab === "notification" && (
          <div className="form-stack">
            <div className="tabs secondary">
              <button
                type="button"
                className={notificationTab === "email" ? "active" : ""}
                onClick={() => setNotificationTab("email")}
              >
                Email
              </button>
              <button
                type="button"
                className={notificationTab === "webhooks" ? "active" : ""}
                onClick={() => setNotificationTab("webhooks")}
              >
                Webhooks
              </button>
            </div>

            {notificationTab === "email" && (
              <div className="form-grid">
                <Field label="From">
                  <input
                    type="email"
                    value={currentTarget.notification.email.from}
                    onChange={(event) =>
                      updateTarget({
                        ...currentTarget,
                        notification: {
                          ...currentTarget.notification,
                          email: {
                            ...currentTarget.notification.email,
                            from: event.target.value
                          }
                        }
                      })
                    }
                  />
                </Field>
                <ListField
                  label="To"
                  values={currentTarget.notification.email.to}
                    onChange={(values) =>
                      updateTarget({
                        ...currentTarget,
                        notification: {
                          ...currentTarget.notification,
                        email: { ...currentTarget.notification.email, to: values }
                      }
                    })
                  }
                />
                <Field label="Password">
                  <input
                    type="password"
                    value={currentTarget.notification.email.password}
                    onChange={(event) =>
                      updateTarget({
                        ...currentTarget,
                        notification: {
                          ...currentTarget.notification,
                          email: { ...currentTarget.notification.email, password: event.target.value }
                        }
                      })
                    }
                  />
                </Field>
                <Field label="SMTP server">
                  <input
                    type="text"
                    value={currentTarget.notification.email.smtpServer}
                    onChange={(event) =>
                      updateTarget({
                        ...currentTarget,
                        notification: {
                          ...currentTarget.notification,
                          email: { ...currentTarget.notification.email, smtpServer: event.target.value }
                        }
                      })
                    }
                  />
                </Field>
                <Field label="SMTP port">
                  <input
                    type="number"
                    min={1}
                    max={65535}
                    value={currentTarget.notification.email.smtpPort}
                    onChange={(event) =>
                      updateTarget({
                        ...currentTarget,
                        notification: {
                          ...currentTarget.notification,
                          email: {
                            ...currentTarget.notification.email,
                            smtpPort: event.target.value === "" ? "" : Number(event.target.value)
                          }
                        }
                      })
                    }
                  />
                </Field>
                <ToggleField
                  label="SMTP SSL"
                  checked={currentTarget.notification.email.smtpSsl}
                    onChange={(checked) =>
                      updateTarget({
                        ...currentTarget,
                        notification: {
                          ...currentTarget.notification,
                        email: { ...currentTarget.notification.email, smtpSsl: checked }
                      }
                    })
                  }
                />
              </div>
            )}

            {notificationTab === "webhooks" && (
              <div className="form-stack">
                {currentTarget.notification.webhooks.map((hook, index) => (
                  <div className="card nested" key={`${hook.name}-${index}`}>
                    <div className="inline space-between">
                      <strong>Webhook {index + 1}</strong>
                      <button
                        type="button"
                        onClick={() => {
                          const next = currentTarget.notification.webhooks.filter((_, i) => i !== index);
                          updateTarget({
                            ...currentTarget,
                            notification: {
                              ...currentTarget.notification,
                              webhooks: next.length ? next : []
                            }
                          });
                        }}
                      >
                        Remove
                      </button>
                    </div>
                    <div className="form-grid">
                      <Field label="Name">
                        <input
                          type="text"
                          value={hook.name}
                          onChange={(event) => {
                            const next = [...currentTarget.notification.webhooks];
                            next[index] = { ...hook, name: event.target.value };
                              updateTarget({
                                ...currentTarget,
                                notification: { ...currentTarget.notification, webhooks: next }
                              });
                          }}
                        />
                      </Field>
                      <Field label="Type">
                        <input
                          type="text"
                          value={hook.type}
                          onChange={(event) => {
                            const next = [...currentTarget.notification.webhooks];
                            next[index] = { ...hook, type: event.target.value };
                              updateTarget({
                                ...currentTarget,
                                notification: { ...currentTarget.notification, webhooks: next }
                              });
                          }}
                        />
                      </Field>
                      <Field label="URL">
                        <input
                          type="text"
                          value={hook.url}
                          onChange={(event) => {
                            const next = [...currentTarget.notification.webhooks];
                            next[index] = { ...hook, url: event.target.value };
                              updateTarget({
                                ...currentTarget,
                                notification: { ...currentTarget.notification, webhooks: next }
                              });
                          }}
                        />
                      </Field>
                      <Field label="Events (comma separated)">
                        <input
                          type="text"
                          value={hook.events.join(", ")}
                          onChange={(event) => {
                            const next = [...currentTarget.notification.webhooks];
                            next[index] = {
                              ...hook,
                              events: event.target.value
                                .split(",")
                                .map((value) => value.trim())
                                .filter(Boolean)
                            };
                              updateTarget({
                                ...currentTarget,
                                notification: { ...currentTarget.notification, webhooks: next }
                              });
                          }}
                        />
                      </Field>
                      <Field label="Timeout">
                        <input
                          type="text"
                          value={hook.timeout}
                          onChange={(event) => {
                            const next = [...currentTarget.notification.webhooks];
                            next[index] = { ...hook, timeout: event.target.value };
                              updateTarget({
                                ...currentTarget,
                                notification: { ...currentTarget.notification, webhooks: next }
                              });
                          }}
                        />
                      </Field>
                      <Field label="Max retries">
                        <input
                          type="number"
                          min={0}
                          value={hook.maxRetries}
                          onChange={(event) => {
                            const next = [...currentTarget.notification.webhooks];
                            next[index] = {
                              ...hook,
                              maxRetries: event.target.value === "" ? "" : Number(event.target.value)
                            };
                            updateTarget({
                              ...currentTarget,
                              notification: { ...currentTarget.notification, webhooks: next }
                            });
                          }}
                        />
                      </Field>
                    </div>
                    <Field label="Headers (one per line)">
                      <textarea
                        rows={4}
                        value={hook.headers}
                        onChange={(event) => {
                          const next = [...currentTarget.notification.webhooks];
                          next[index] = { ...hook, headers: event.target.value };
                          updateTarget({
                            ...currentTarget,
                            notification: { ...currentTarget.notification, webhooks: next }
                          });
                        }}
                      />
                    </Field>
                  </div>
                ))}

                <button
                  type="button"
                  onClick={() => {
                    updateTarget({
                      ...currentTarget,
                      notification: {
                        ...currentTarget.notification,
                        webhooks: [
                          ...currentTarget.notification.webhooks,
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
                  }}
                >
                  Add webhook
                </button>
              </div>
            )}
          </div>
        )}
      </section>

    </main>
  );
}
