function FormInput({
  id,
  label,
  type = "text",
  registeration,
  error,
  placeholder,
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-1 block font-medium">
        {label}
      </label>

      <input
        id={id}
        type={type}
        {...registeration}
        className="w-full rounded-lg border px-3 py-2"
        placeholder={placeholder}
      />
      {error && <p className="text-red-600">{error.message}</p>}
    </div>
  );
}

export default FormInput;

// <   refistration={register("title")}  >
