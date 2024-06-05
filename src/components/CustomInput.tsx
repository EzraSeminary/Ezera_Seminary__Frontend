import { useState } from "react";

interface CustomInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  maxLength?: number;
}

function CustomInput({
  maxLength,
  value,
  onChange,
  ...props
}: CustomInputProps) {
  const [error, setError] = useState("");

  const handleChange = (event) => {
    const { value } = event.target;
    if (maxLength && value.length > maxLength) {
      setError(`Input cannot exceed ${maxLength} characters`);
      console.log("error");
    } else {
      setError("");

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
