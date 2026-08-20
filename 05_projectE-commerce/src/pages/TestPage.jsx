import { useForm } from "react-hook-form";
import { productService } from "../services/productService";
import { Navigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { productSchema } from "../schemas/productSchema";
import FormInput from "../components/Form/FormInput";

function FormPracticePage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(productSchema),
  });

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
        <FormInput
          id="title"
          label="product title"
          placeholder="Enter product title"
          registeration={register("title")}
          error={errors.title}
        />
        <FormInput
          id="price"
          label="Price"
        //   type="number"
          placeholder="Enter product price"
          registeration={register("price")}
          error={errors.price}
        />
        <FormInput
          id="stock"
          label="stock"
        //   type="number"
          placeholder="stock"
          registeration={register("stock")}
          error={errors.stock}
        />
        <FormInput
          id="image"
          label="product image"
          placeholder="Enter product image"
          registeration={register("image")}
          error={errors.image}
        />
        <FormInput
          id="description"
          type="textarea"
          label="product description"
          placeholder="Enter product description"
          registeration={register("description")}
          error={errors.description}
        />

        <div>
          <label htmlFor="category" className="mb-1 block font-medium">
            Category
          </label>

          <select
            id="category"
            {...register("category")}
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
