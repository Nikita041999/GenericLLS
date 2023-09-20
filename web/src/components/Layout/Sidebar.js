import logo from "assets/images/trdeshowlogo.png";
import userIcon from "assets/images/users.svg";
import eventIcon from "assets/images/events.svg";
import styles from '../../containers/Users.module.css'
import dashbordIcon from "assets/images/manage_masters.svg";
import { useState } from "react";
import { useLocation } from "react-router-dom";

export default function Sidebar({ toggleSidebar }) {
  const location = useLocation();
  const [menus, setMenus] = useState([
    // { name: "Dashboard", url: "/dashboard", icon: dashbordIcon },
    { name: "Players", url: "/players", icon: userIcon },
    { name: "Questions", url: "/dashboard", icon: userIcon },
    // { name: "Events", url: "/events", icon: eventIcon },
  ]);
  const handleClick = (e) => {
    e.preventDefault()
  }
  const getMenus = () => {
    return menus.map((menu, index) => {
      let pathname = location.pathname.split("/")[1];
      console.log("pathname", pathname);
      return (
        // <li className={`/${pathname}` == menu.url ? "active" : ""} key={index}>
        <li className={`/${pathname}` == menu.url ? "active" : ""} key={index}>
          <a href={menu.url}>
            <img src={menu.icon} alt="" /> {menu.name}
          </a>
        </li>
      );
    });
  };
  return (
    <aside className={`${styles.sidebar}`}>
      <button
        type="button"
        className={`${styles.btn_close} text-reset ${styles.menu_btn}`}
        data-bs-dismiss="offcanvas"
        aria-label="Close"
        onClick={toggleSidebar}
      ></button>
      <div className={`text-center w-100`}>
        <a href="" onClick={(e) => e.preventDefault()} className={`${styles.logo}`}>
          <img src={logo} alt="logo" />
        </a>
      </div>

      <ul className={`${styles.leftBarMenu}`}>
        {getMenus()}
        {/*<li>
          <a href="#">
            <img src="assets/images/manage-Customers-Agency.svg" alt="" />{" "}
            Manage Customers Agency
          </a>
        </li>
        <li>
          <a href="#">
            <img src="assets/images/manage_supplier.svg" alt="" /> Manage
            Suppliers
          </a>
        </li>
        <li>
          <a href="#">
            <img src="assets/images/manage_guide.svg" alt="" /> Manage Guides
          </a>
        </li>
        <li>
          <a href="#">
            <img src="assets/images/multi-picklist.svg" alt="" /> Manage
            Picklist
          </a>
        </li>
        <li>
          <a href="#">
            <img src="assets/images/manageServices.svg" alt="" /> Manage
            Services
          </a>
        </li> */}
      </ul>
    </aside>
  );
}
