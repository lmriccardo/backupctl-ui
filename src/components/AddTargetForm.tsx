import { useState } from "react";

export function AddTargetForm({
  onAdd,
  label,
  helperText
}: {
  onAdd: (name: string) => void;
  label?: string;
  helperText?: string;
}) {
  const [name, setName] = useState("");
  return (
    <div className="field">
      {label && <span className="label">{label}</span>}
      <div className="inline">
        <input
          type="text"
          placeholder="target name"
          value={name}
          onChange={(event) => setName(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              onAdd(name);
              setName("");
            }
          }}
        />
        <button
          type="button"
          className="icon-button add"
        onClick={() => {
          onAdd(name);
          setName("");
        }}
      >
          +
        </button>
      </div>
      {helperText && <p className="helper-text error-text">{helperText}</p>}
    </div>
  );
}
