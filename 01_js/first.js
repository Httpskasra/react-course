// // const id = data.id;
// // const name = data.name;
// // const age = data.age;

// // console.log(id, name,age);
// const data = {
//   id: 1,
//   name: "kasra",
//   age: 22,
// };
// const { name, ...rest } = data;

// console.log(name, rest);
// const obj2 = { ...data, test: true };
// console.log(obj2);

// const arr = [1, 2, 3, 4];
// const newArr = [...arr, 88];

// console.log(newArr[0]);

// // if (true) {
// // } else if (true) {
// // } else {
// // }

// // const con = id === 1 ? "yes " : "no";

// // const id = 1
// // const test = !id===1 && "kasra";
// // console.log(test);
// // const test1 = !id===1 || "kasra";
// // console.log(test1);

// const user = [
//   {
//     name: "kasra",
//     lastNam3: "rahmanian",
//     age: 20,
//     gender: "female",
//     password: "Ali123!",
//   },
//   {
//     name: "ali",
//     lastNam3: "aliiii",
//     age: 21,
//     gender: "male",
//     password: "Ali123!2222",
//   },
//   {
//     name: "sara",
//     lastNam3: "saraaaaaii",
//     age: 10,
//     gender: "female",
//     password: "i12323!",
//   },
// ];

// const newUser = user.map((r) => {
//   return (r.password = "123");
// });
// console.log(newUser);

// const newUser2 = user.filter((r) => {
//   return r.age > 11;
// });
// console.log(newUser2);

// const user1 = user.find((i) => {
//   return i.age > 18;
// });

// console.log(user1);

// const text = "kasra rahmanian";

// console.log(text.includes("kasw"));

const arr = ["kasr", "rahmanian", 22];

// arr.push(true);
arr[3] = true;

const newArr = [...arr, true, { test: 0 }];
console.log(newArr);

const obj = { name: "kasr", age: 22 };

const newObj = { ...obj, name: "shiraz" };
console.log(newObj);
