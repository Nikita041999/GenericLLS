import Header from "./Header";
import Sidebar from "./Sidebar";
import Footer from "./Footer";
import { useState } from "react";

export default function Layout({ children }) {
  const [show_sidebar, setShowSidebar] = useState(false);
  const toggleSidebar = () => {
    setShowSidebar(!show_sidebar);
  };
  return (
    <div className={`inner menu ${show_sidebar ? "menu-clicked" : ""}`}>
      <Header toggleSidebar={toggleSidebar} />{" "}
      <Sidebar toggleSidebar={toggleSidebar} /> {children} <Footer />
    </div>
  );
}
