import "./App.css";
import Card from "./components/Card";
import Footer from "./components/Footer";
import Hero from "./components/Hero";
import NavBar from "./components/NavBar";
import Stats from "./components/Stat";

function App() {
  const data = [
    { title: "Dragon", desc: "Reusable orbital rocket. " },
    { title: "Falcon 9", desc: "Crew transportation spacecraft. " },
    { title: "Starship", desc: "Next generation rocket system. " },
    { title: "Starship", desc: "Next generation rocket system. " },
  ];
  return (
    <div className="bg-black text-white min-h-screen">
      <NavBar />
      <Hero />
      <section className="grid md:grid-cols-3 gap-6 px-10">
        <Card parentData={data}></Card>
      </section>
      <Stats />
      <Footer />
    </div>
  );
}

export default App;
