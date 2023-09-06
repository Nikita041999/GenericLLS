import menuImg from "assets/images/menu.svg";
import userImg from "assets/images/userImg.svg";
import { useState } from "react";
import { useNavigate } from "react-router-dom";


export default function Header({ toggleSidebar }) {
  const [show_menu, setShowMenu] = useState(false);
  const navigate = useNavigate();

  const toggleMenu = () => {
    setShowMenu(!show_menu);
  };
  
  const handleClick = (event) => {
    event.preventDefault();
  }
  const handleLogout = (event) => {
    event.preventDefault();
    localStorage.removeItem("Tradeshow-token");
    localStorage.removeItem("Tradeshow");

    window.location.href = "/admin-login";
  };
  return (
    <header className="admin-header">
      <div className="w-100 d-flex align-items-center">
        {/* <div className="menu-btn">
          <img src={menuImg} alt="menu" onClick={toggleSidebar} />
        </div> */}
        <div className="dropdown ms-auto">
          <a
            className="dropdown-toggle"
            href=""
            id="navbarDropdown"
            role="button"
            data-bs-toggle="dropdown"
            aria-expanded="false"
            onClick={handleClick}
          >
            <img src={userImg} className="profile-img" alt="profile-img" />{" "}
            Admin{" "}
            <i>
              {" "}
              <img src="assets/images/down_arrow.svg" alt="" />
            </i>
          </a>
          <div className="dropdown-menu" aria-labelledby="navbarDropdown">
            <ul>
              {/* <li>
                <a href="javascript:void(0);">
                  <i className="fa-solid fa-user"></i> My Profile
                </a>
              </li> */}
              {/* <li>
                <a href="/change-password">
                  <i className="fa-solid fa-unlock-keyhole"></i> Change Password
                </a>
              </li> */}
              <li>
                <a href="" onClick={handleLogout}>
                  <i className="fa-solid fa-right-from-bracket"></i> Logout
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </header>
  );
}
