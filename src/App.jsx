import RootRoutes from "@/routes";
import { BrowserRouter as Router } from "react-router-dom";

import "@/css/base.css";
import "@/css/layout.css";
import "@/css/component.css";
import "@/css/page.css";
import "@/css/response.css";

function App() {
  return (
    <div className="wrap">
      {/* /// future 플래그를 추가하여 경고를 제거하고 v7 동작을 미리 적용합니다 */}
      <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <RootRoutes />
      </Router>
    </div>
  );
}

export default App;
