import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";

/// Strict Mode는 개발 단계에서 잠재적인 문제를 찾기 위해 컴포넌트를 의도적으로 두 번 렌더링
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode> 
    <App />
  </React.StrictMode>
);
