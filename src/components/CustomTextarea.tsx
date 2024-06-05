interface CustomTextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  maxLength?: number;
}

function CustomTextarea({ maxLength, ...props }: CustomTextareaProps) {
  return <textarea {...props} maxLength={maxLength} />;
}

export default CustomTextarea;
