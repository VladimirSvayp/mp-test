import Select from "react-select";

interface IProps {
  options: {
    label: string;
    value: number;
  } [];
}

const CustomSelect = ({ options }: IProps) => {
  return (
    <Select
      options={options}
    />
  );
};

export default CustomSelect;
