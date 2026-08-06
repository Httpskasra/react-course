import { z } from "zod";

const userSchema = z.object({
  name: z.string().min(3),
  age: z.number().min(18),
});

const user = {
  name: "kasra",
  age: 22,
};

const worngUser = {
  name: "Kaaaaaa",
  age: 2,
};

console.log(userSchema.safeParse(user));
console.log(userSchema.safeParse(worngUser));
