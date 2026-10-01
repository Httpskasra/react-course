let isDone: boolean = true;

let price: number = 1212;

let name1: string = "kasra ";

const arr: number[] = [1, 2, 3, 4];

const arr1: any = [",1123", 2, true];

let sum: Number = 0;
function setter(a: number): void {
  sum = +a;
}

let x: number | string = 1;
x = "kjasra";


function buildName(firstName: string, lastName: string = "famili"): void {
  console.log(`firs:${firstName} , last: ${lastName}`);
}


async function sendMail(to: string, sub: string): Promise<boolean> {
  
  return Promise.resolve(true);
}
sendMail("kasra@gmail.com" , "salam").then(console.log)