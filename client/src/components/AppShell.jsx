import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Home, Utensils, MessageCircle, LogOut, MapPin } from "lucide-react";

function getUser() {
  try {
    const raw = localStorage.getItem("user");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function Icon({ children }) {
  return <div style={{ width: 24, height: 24, display: "flex", alignItems: "center", justifyContent: "center" }}>{children}</div>;
}

export default function AppShell({ children }) {
  const nav = useNavigate();
  const user = getUser();

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    nav("/login", { replace: true });
  };

  return (
    <>
      {/* Topbar đơn giản */}
      <div className="topbar">
        <div className="container">
          <div className="topbar-inner">
            <div className="brand">
              <div className="brand-badge" />
              <div className="brand-title">Foodbook</div>
            </div>

            <div className="search">
              <input placeholder="Tìm..." readOnly />
            </div>

            <div className="pill">
              <MapPin size={14} style={{ marginRight: 6 }} />
              Đà Nẵng
            </div>
          </div>
        </div>
      </div>

      {/* Layout */}
      <div className="container">
        <div className="row">
          {/* Sidebar đơn giản */}
          <div className="sidebar">
            <div className="card soft side-section">
              <NavLink to="/feed" className={({ isActive }) => `side-item ${isActive ? "active" : ""}`}>
                <div className="side-left">
                  <div className="icon"><Home size={18} /></div>
                  <div className="side-main">Trang chủ</div>
                </div>
              </NavLink>

              <NavLink to="/restaurants" className={({ isActive }) => `side-item ${isActive ? "active" : ""}`}>
                <div className="side-left">
                  <div className="icon"><Utensils size={18} /></div>
                  <div className="side-main">Quán ăn</div>
                </div>
              </NavLink>

              <NavLink to="/appointments" className={({ isActive }) => `side-item ${isActive ? "active" : ""}`}>
                <div className="side-left">
                  <div className="icon"><MessageCircle size={18} /></div>
                  <div className="side-main">Cuộc hẹn</div>
                </div>
              </NavLink>

              <button className="btn full" style={{ marginTop: 20 }} onClick={logout}>
                <LogOut size={16} style={{ marginRight: 6 }} />
                Thoát
              </button>
            </div>
          </div>

          {/* Main */}
          <div style={{ flex: 1 }}>{children}</div>

          {/* Right (optional) - ẩn để đơn giản */}
          {/* <div style={{ width: 280, position: "sticky", top: 78, alignSelf: "flex-start" }} className="hide-right">
            <div className="card soft side-section">
              <div className="muted" style={{ fontSize: 13, lineHeight: 1.6 }}>
                Đăng bài • Review • Tạo cuộc hẹn
              </div>
            </div>
          </div> */}
        </div>
      </div>
    </>
  );
}
