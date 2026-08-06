import { useForm } from "react-hook-form";
import { productService } from "../services/productService";
import { Navigate } from "react-router-dom";

function FormPracticePage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    
    try {
      const createdProduct = await productService.createProduct(data);
      Navigate(`/products/${createdProduct.id}`);
    } catch (err) {
    } finally {
    }
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
            {...register("title", {
              required: "must be fill",
              minLength: {
                value: 3,
                message: "must be more than 3",
              },
              maxLength: {
                value: 20,
                message: "less than 20",
              },
            })}
            className="w-full rounded-lg border px-3 py-2"
            placeholder="Enter product title"
          />
          {errors.title && (
            <p className="text-red-600">{errors.title.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="price" className="mb-1 block font-medium">
            Price
          </label>

          <input
            id="price"
            type="number"
            {...register("price", {
              valueAsNumber: true,
              required: "must be fill",
              min: {
                value: 1,
                message: "must be more than 1",
              },
            })}
            className="w-full rounded-lg border px-3 py-2"
            placeholder="Enter product price"
          />
          {errors.price && (
            <p className="text-red-600">{errors.price.message}</p>
          )}
        </div>
        <div>
          <label htmlFor="stock" className="mb-1 block font-medium">
            Stock
          </label>

          <input
            id="stock"
            type="text"
            {...register("stock", {
              valueAsNumber: true,
              required: " benevis",
              min: {
                value: 0,
                message: "asdadsax",
              },
              validate: {
                isInteger: (value) => Number.isInteger(value) || "must be int",
              },
            })}
            className="w-full rounded-lg border px-3 py-2"
          />
          {errors.stock && (
            <p className="text-red-600">{errors.stock.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="category" className="mb-1 block font-medium">
            Category
          </label>

          <select
            id="category"
            {...register("category", {
              required: "select",
            })}
            className="w-full rounded-lg border px-3 py-2">
            <option value="">Select category</option>
            <option value="Phone">Phone</option>
            <option value="Laptop">Laptop</option>
            <option value="Tablet">Tablet</option>
            <option value="Accessory">Accessory</option>
          </select>
          {errors.category && (
            <p className="text-red-600">{errors.category.message}</p>
          )}
        </div>
        <div>
          <label htmlFor="image" className="mb-1 block font-medium">
            Url
          </label>
          <input
            id="image"
            {...register("image", {
              required: "Image URL is required",
              pattern: {
                value: /^https?:\/\/.+/i,
                message: "Please enter a valid image URL",
              },
            })}
            className="w-full rounded-lg border px-3 py-2"
          />

          {errors.image && (
            <p className="mt-1 text-sm text-red-600">{errors.image.message}</p>
          )}
        </div>
        <div>
          <label htmlFor="description" className="mb-1 block font-medium">
            Description
          </label>

          <textarea
            id="description"
            {...register("description")}
            rows={5}
            className="w-full rounded-lg border px-3 py-2"
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
// {
//   title: 'iPhone 15',
//   price: 999,
//   stock: 10,
//   category: 'Phone',  (Accessory ,Phone, Laptop ,Tablet )
//   description: 'Apple flagship phone'
// }
//  https:// or http://
