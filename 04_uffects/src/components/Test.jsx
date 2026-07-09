export default function Test() {
  fetch("https://jsonplaceholder.typicode.com/usedrs")
    .then((response) => {
      return response.json();
    })

    .then((data) => {
      console.log(data);
    })

    .catch((error) => {
      console.log(error);
    });

  return <></>;
}
