import { useState, ChangeEvent, InputHTMLAttributes } from "react";

interface CustomInputProps extends InputHTMLAttributes<HTMLInputElement> {
  maxLength?: number;
}

function CustomInput({
  maxLength,
  value,
  onChange,
  ...props
}: CustomInputProps) {
  const [error, setError] = useState("");

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    if (maxLength && value.length > maxLength) {
      setError(`Input cannot exceed ${maxLength} characters`);
    } else {
      setError("");
      // Call the passed onChange handler from the parent component
      if (onChange) {
        onChange(event);
      }
    }
  };

  return (
    <div>
      <input {...props} value={value} onChange={handleChange} />
      {error && <div className="text-red-500">{error}</div>}
    </div>
  );
}

export default CustomInput;
