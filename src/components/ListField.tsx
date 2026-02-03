export function ListField({
  label,
  values,
  onChange
}: {
  label: string;
  values: string[];
  onChange: (values: string[]) => void;
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
