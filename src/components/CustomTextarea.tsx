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
  return <textarea {...props} maxLength={maxLength} />;
}

export default CustomTextarea;
