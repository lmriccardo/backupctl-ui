import { open } from "@tauri-apps/plugin-dialog";

export function PathListField({
  label,
  values,
  onChange,
  directory
}: {
  label: string;
  values: string[];
  onChange: (values: string[]) => void;
  directory?: boolean;
}) {
  return (
    <div className="list-field">
      <span className="label">{label}</span>
      {values.map((value, index) => (
        <div className="inline" key={`${label}-${index}`}>
          <input
            type="text"
            value={value}
            onChange={(event) => {
              const next = [...values];
              next[index] = event.target.value;
              onChange(next);
            }}
          />
          <button
            type="button"
            onClick={async () => {
              const selected = await open({ multiple: false, directory: Boolean(directory) });
              if (typeof selected === "string") {
                const next = [...values];
                next[index] = selected;
                onChange(next);
              }
            }}
          >
            Browse
          </button>
          <button
            type="button"
            onClick={() => {
              const next = values.filter((_, i) => i !== index);
              onChange(next.length ? next : [""]);
            }}
          >
            Remove
          </button>
        </div>
      ))}
      <button type="button" className="icon-button" onClick={() => onChange([...values, ""])}>
        +
      </button>
    </div>
  );
}
