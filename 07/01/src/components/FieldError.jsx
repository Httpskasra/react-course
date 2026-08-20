export default function FieldError({ message }) {
  if (!message) return null;
  return <p className="error-text">{message}</p>;
}
