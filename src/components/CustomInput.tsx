function CustomInput({ maxLength = 500, ...props }) {
  return <input {...props} maxLength={maxLength} />;
}

export default CustomInput;
