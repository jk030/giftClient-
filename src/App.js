import React from "react";
import Navbar from "./components/Navbar";
import { Routes, Route } from "react-router-dom";
import routes from "./config/routes";

function App() {
  return (
    <div className="App">
      <Navbar />
      <Routes> 
        {routes({}).map((route) => (
          <Route key={route.path} path={route.path} element={route.element} />
        ))}
      </Routes>
    </div>
  );
}

export default App;
