import type { NextPage } from "next";
import About from "../src/components/sections/About/About";
import Layout from "../src/components/templates/Layout/Layout";

const Home: NextPage = () => {
  return (
    <Layout>
      <About />
    </Layout>
  );
};

export default Home;
