import type { NextPage } from "next";
import About from "../src/components/sections/About/About";
import Education from "../src/components/sections/Education/Education";
import Skills from "../src/components/sections/Skills/Skills";
import Layout from "../src/components/templates/Layout/Layout";

const Home: NextPage = () => {
  return (
    <Layout>
      <About />
      <Education />
      <Skills />
    </Layout>
  );
};

export default Home;
