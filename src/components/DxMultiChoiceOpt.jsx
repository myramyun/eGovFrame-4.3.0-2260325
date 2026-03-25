const DxMultiChoiceOpt = v => {
  const { name, label, value, opt, checkedValue, setter } = v;

  const checked = value === checkedValue;
  const toggledClassName = checked ? "f_rdo on" : "f_rdo";
  return (
    <label className={toggledClassName}>
      <input
        type="radio"
        name={name}
        value={value}
        title={label}
        opt={opt}
        checked={checked}
        onChange={() => setter(value)}
      />
      <em>{label}</em>
    </label>
  );
}

export default DxMultiChoiceOpt;


