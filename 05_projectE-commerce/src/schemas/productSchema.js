import { z } from "zod";

export const productSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Product title is required")
    .min(3, "Title must be at least 3 characters")
    .max(100, "Title cannot exceed 100 characters"),

  price: z.coerce
    .number({
      invalid_type_error: "Price must be a number",
    })
    .positive("Price must be greater than zero"),

  stock: z.coerce
    .number({
      invalid_type_error: "Stock must be a number",
    })
    .int("Stock must be an integer")
    .min(0, "Stock cannot be negative"),

  category: z.enum(["Phone", "Accessory", "Tablet", "Laptop"]),

  description: z
    .string()
    .trim()
    .min(1, "Description is required")
    .min(10, "Description must be at least 10 characters")
    .max(500, "Description cannot exceed 500 characters"),

  image: z
    .string()
    .trim()
    .min(1, "Image URL is required")
    .url("Please enter a valid image URL"),
});





const employeeSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(3, 'Full name must be at least 3 characters'),

  email: z
    .string()
    .email('Please enter a valid email'),

  salary: z.coerce
    .number()
    .positive('Salary must be greater than zero'),

  experience: z.coerce
    .number()
    .int('Experience must be an integer')
    .min(0, 'Experience cannot be negative'),
})
