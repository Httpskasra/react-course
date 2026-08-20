import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { productSchema } from '../../schemas/productSchema'
import FormInput from '../form/FormInput'

const emptyProduct = {
  title: '',
  price: '',
  stock: '',
  category: '',
  description: '',
  image: '',
}

function ProductForm({
  initialValues = emptyProduct,
  onSubmit,
  submitText = 'Save Product',
}) {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: {
      errors,
      isSubmitting,
      isDirty,
    },
  } = useForm({
    resolver: zodResolver(productSchema),
    defaultValues: initialValues,
    mode: 'onBlur',
  })

  useEffect(() => {
    reset(initialValues)
  }, [initialValues, reset])

  const imageUrl = watch('image')

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-5"
      noValidate
    >
      <FormInput
        id="title"
        label="Product title"
        placeholder="Example: iPhone 15 Pro"
        registration={register('title')}
        error={errors.title}
      />

      <div className="grid gap-5 md:grid-cols-2">
        <FormInput
          id="price"
          label="Price"
          type="number"
          placeholder="Example: 999"
          registration={register('price')}
          error={errors.price}
        />

        <FormInput
          id="stock"
          label="Stock"
          type="number"
          placeholder="Example: 10"
          registration={register('stock')}
          error={errors.stock}
        />
      </div>

      <div>
        <label
          htmlFor="category"
          className="mb-1 block font-medium text-gray-700"
        >
          Category
        </label>

        <select
          id="category"
          {...register('category')}
          className={`w-full rounded-lg border px-3 py-2 outline-none ${
            errors.category
              ? 'border-red-500'
              : 'border-gray-300'
          }`}
        >
          <option value="">Select category</option>
          <option value="Phone">Phone</option>
          <option value="Laptop">Laptop</option>
          <option value="Tablet">Tablet</option>
          <option value="Accessory">Accessory</option>
        </select>

        {errors.category && (
          <p className="mt-1 text-sm text-red-600">
            {errors.category.message}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor="description"
          className="mb-1 block font-medium text-gray-700"
        >
          Description
        </label>

        <textarea
          id="description"
          rows={5}
          {...register('description')}
          placeholder="Write a description for the product"
          className={`w-full rounded-lg border px-3 py-2 outline-none ${
            errors.description
              ? 'border-red-500'
              : 'border-gray-300'
          }`}
        />

        {errors.description && (
          <p className="mt-1 text-sm text-red-600">
            {errors.description.message}
          </p>
        )}
      </div>

      <FormInput
        id="image"
        label="Image URL"
        placeholder="https://example.com/image.jpg"
        registration={register('image')}
        error={errors.image}
      />

      {imageUrl && !errors.image && (
        <div>
          <p className="mb-2 font-medium text-gray-700">
            Image preview
          </p>

          <img
            src={imageUrl}
            alt="Product preview"
            className="h-48 w-48 rounded-lg border object-cover"
            onError={(event) => {
              event.currentTarget.style.display = 'none'
            }}
          />
        </div>
      )}

      <div className="flex items-center gap-4">
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-lg bg-blue-600 px-5 py-2 text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSubmitting ? 'Saving...' : submitText}
        </button>

        {isDirty && (
          <span className="text-sm text-amber-600">
            You have unsaved changes
          </span>
        )}
      </div>
    </form>
  )
}

export default ProductForm
