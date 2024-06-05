import { useState, ChangeEvent, TextareaHTMLAttributes } from "react";
interface CustomTextareaProps
  extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  maxLength?: number;
}

function CustomTextarea({
  maxLength,
  value,
  onChange,
  ...props
}: CustomTextareaProps) {
  const [error, setError] = useState("");

  const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
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
      <textarea {...props} value={value} onChange={handleChange} />
      {error && <div className="text-red-500 text-xs italic">{error}</div>}
    </div>
  );
}

export default CustomTextarea;
