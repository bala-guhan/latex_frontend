import { useState } from "react";
import './index.css';

export default function App() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");

  const handleInputChange = (e) => {
    setInput(e.target.value);
  }

  const handleConvert = () => {
    fetch("http://localhost:8000/convert", {
      method: "POST",
      body: JSON.stringify({ input }),
      headers: { "Content-Type": "application/json" }
    })
      .then(response => response.json())
      .then(data => setOutput(data.output))
      .catch(error => {
        console.error("Error:", error);
      });
  }

  return (
    <div>
      <h1 className="text-2xl font-poppins font-bold text-center mt-10">Latex code converter bot</h1>
      <div className="flex flex-row gap-4 justify-center items-start p-4">
        <div className="flex-1 bg-gray-100 p-4 rounded-lg shadow-md">
          <h2 className="text-lg font-poppins font-bold mb-4">Input</h2>
          <textarea
            value={input}
            onChange={handleInputChange}
            className="w-full h-64 p-2 rounded-md border border-gray-300 resize-none align-top"
            placeholder="Enter your latex code"
          />
          <button className="bg-blue-500 text-white px-4 py-2 rounded-md mt-2" onClick={handleConvert}>Convert</button>
        </div>
        <div className="flex-1 bg-gray-100 p-4 rounded-lg shadow-md">
          <h2 className="text-lg font-poppins font-bold mb-4">Output</h2>
          <textarea
            className="w-full h-64 p-2 rounded-md border border-gray-300"
            placeholder="Output will be shown here"
            value={output}
            readOnly
          />
        </div>
      </div>
    </div>
  )
}