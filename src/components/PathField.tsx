import { open } from "@tauri-apps/plugin-dialog";
import { Field } from "./Field";

export function PathField({
  label,
  value,
  onChange,
  directory
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  directory?: boolean;
}) {
  return (
    <Field label={label}>
      <div className="input-group">
        <input type="text" value={value} onChange={(event) => onChange(event.target.value)} />
        <button
          type="button"
          className="icon-button secondary"
          aria-label={`Browse ${label}`}
          onClick={async () => {
            const selected = await open({ multiple: false, directory: Boolean(directory) });
            if (typeof selected === "string") {
              onChange(selected);
            }
          }}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true" className="icon">
            <path
              d="M4 7.5h5l2 2H20a1 1 0 0 1 1 1v7.5a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-9.5a1 1 0 0 1 1-1Z"
              fill="currentColor"
            />
          </svg>
        </button>
      </div>
    </Field>
  );
}
