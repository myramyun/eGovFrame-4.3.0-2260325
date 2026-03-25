function EgovDxScoreing({ name, label, value, stem, checkedValue, setter }) {
  const checked = value === checkedValue;
  const toggledClassName = checked ? "f_rdo on" : "f_rdo";
  return (
    <label className={toggledClassName}>
      <input
        type="radio"
        name={name}
        value={value}
        title={label}
        stem={stem}
        checked={checked}
        onChange={() => setter(value)}
      />
      <em>{label}</em>
    </label>
  );
}

export default EgovDxScoreing;


