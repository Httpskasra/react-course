import { useForm } from "react-hook-form";

function FormPracticePage() {
  const { register, handleSubmit } = useForm();

  const onSubmit = (data) => {
    console.log(data);
  };

  return (
    <div className="mx-auto max-w-xl p-6">
      <h1 className="mb-6 text-2xl font-bold">Product Form Practice</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label htmlFor="title" className="mb-1 block font-medium">
            Product title
          </label>

          <input
            id="title"
            {...register("title")}
            className="w-full rounded-lg border px-3 py-2"
            placeholder="Enter product title"
          />
        </div>

        <div>
          <label htmlFor="price" className="mb-1 block font-medium">
            Price
          </label>

          <input
            id="price"
            type="number"
            {...register("price", { valueAsNumber: true })}
            className="w-full rounded-lg border px-3 py-2"
            placeholder="Enter product price"
          />
        </div>

        <button
          type="submit"
          className="rounded-lg bg-blue-600 px-5 py-2 text-white">
          Submit
        </button>
      </form>
    </div>
  );
}

export default FormPracticePage;
