import About from "./components/sections/About/About";
import Education from "./components/sections/Education/Education";
import Skills from "./components/sections/Skills/Skills";
import Works from "./components/sections/Works/Works";
import Layout from "./components/templates/Layout/Layout";

function App() {
  return (
    <>
      <Layout>
        <About />
        <Education />
        <Skills />
        <Works />
      </Layout>
    </>
  );
}

export default App;
