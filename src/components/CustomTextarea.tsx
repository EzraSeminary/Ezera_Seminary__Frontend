function CustomTextarea({ maxLength = 500, ...props }) {
  return <textarea {...props} maxLength={maxLength} />;
}

export default CustomTextarea;
