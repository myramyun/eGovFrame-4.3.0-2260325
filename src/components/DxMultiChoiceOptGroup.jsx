import EgovDxMultiChoiceOpt from "@/components/EgovDxMultiChoiceOpt";

const DxMultiChoiceOptGroup = v => {
  const { name, mcGroup, setValue, setter } = v;
   
  return (
    <>
      {mcGroup.map((mcOption, i) => {
        return (
          <EgovDxMultiChoiceOpt
            key={i}
            name={name}
            label={mcOption.label}
            value={mcOption.value}
            opt={mcOption.opt}
            checkedValue={setValue}
            setter={setter}
          />
        );
      })}
    </>
  );
}

export default DxMultiChoiceOptGroup;


