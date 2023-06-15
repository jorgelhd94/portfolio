import { useState } from "react";
import reactLogo from "./assets/react.svg";
import Layout from "./components/templates/Layout/Layout";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <Layout>
        <div className="flex justify-center">
          <a href="https://react.dev" target="_blank">
            <img src={reactLogo} className="logo react" alt="React logo" />
          </a>
        </div>
        <h1 className="text-blue-500">Vite + React</h1>
        <div className="card">
          <button
            className="btn w-40"
            onClick={() => setCount((count) => count + 1)}
          >
            count is {count}
          </button>
          <p>
            Edit <code>src/App.tsx</code> and save to test HMR
          </p>
        </div>
        <p className="read-the-docs">
          Click on the Vite and React logos to learn more
        </p>
      </Layout>
    </>
  );
}

export default App;
