import { NavLink } from "react-router-dom";
import URL from "@/constants/url";
import { getSessionItem } from "@/utils/storage";

function EgovLeftNavProduct() {
  const sessionUser = getSessionItem("loginUser");
  const sessionUserSe = sessionUser?.userSe;

  return (
    <div className="nav">
      <div className="inner">
        <h2>쇼핑몰</h2>
        <ul className="menu4">
          <li> <NavLink to={URL.PRODUCT_EVENT} className={({ isActive }) => (isActive ? "cur" : "")} > 이벤트 </NavLink> </li>
          <li> <NavLink to={URL.PRODUCT_CLOTHING} className={({ isActive }) => (isActive ? "cur" : "")} > 의류 </NavLink> </li>
          <li> <NavLink to={URL.PRODUCT_OTHER} className={({ isActive }) => (isActive ? "cur" : "")} > 잡화 </NavLink> </li>
          {sessionUserSe && (
            <li> <NavLink to={URL.PRODUCT_EXAM} className={({ isActive }) => (isActive ? "cur" : "")} > 테스트 </NavLink> </li>
          )}
        </ul>
      </div>
    </div>
  );
}

export default EgovLeftNavProduct;


