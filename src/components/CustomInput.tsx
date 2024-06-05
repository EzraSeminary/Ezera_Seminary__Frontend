interface CustomInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  maxLength?: number;
}

function CustomInput({ maxLength, ...props }: CustomInputProps) {
  return <input {...props} maxLength={maxLength} />;
}

export default CustomInput;
