import { StrictMode } from "react";
import ReactDOM from "react-dom";
import { StoreContext } from "./contex/StoreContext";

import App from "./App";

const rootElement = document.getElementById("root");
ReactDOM.render(
  <StrictMode>
    <StoreContext>
      <App />
    </StoreContext>
  </StrictMode>,
  rootElement
);
