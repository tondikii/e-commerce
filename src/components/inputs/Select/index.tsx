import {Select, Option} from "@mui/joy";
import type {FC} from "react";
import {CustomTargetType} from "@/types";
import FormControl from "../FormControl";

interface Option {
  label: string;
  value: string;
}

interface Props {
  options: Option[];
  placeholder?: string;
  onChange: (e: CustomTargetType) => void;
  name: string;
  label?: string;
  errorMessage?: string;
}

const CustomSelect: FC<Props> = ({
  options,
  placeholder = "Pilih salah satu",
  onChange,
  name,
  label,
  errorMessage,
}) => {
  const handleChange = (_: any, value: any) => {
    onChange({name, value});
  };

  return (
    <FormControl label={label} errorMessage={errorMessage}>
      <Select size="lg" placeholder={placeholder} onChange={handleChange}>
        {options.map(({label, value}, idx) => (
          <Option key={idx + 1} value={value}>
            {label}
          </Option>
        ))}
      </Select>
    </FormControl>
  );
};
export default CustomSelect;
