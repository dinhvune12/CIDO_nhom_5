import React from "react";
import { NavLink, useNavigate } from "react-router-dom";

function getUser() {
  try {
    const raw = localStorage.getItem("user");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function Icon({ children }) {
  return <span style={{ width: 22, display: "inline-flex", justifyContent: "center" }}>{children}</span>;
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
      {/* Topbar (style theo doan.zip) */}
      <div className="topbar">
        <div className="container">
          <div className="topbar-inner">
            <div className="brand">
              <div className="brand-badge" />
              <div>
                <div className="brand-title">Foodbook</div>
                <div className="brand-sub">Mini social</div>
              </div>
            </div>

            <div className="search">
              <span style={{ opacity: 0.9 }}>🔎</span>
              <input placeholder="Tìm quán, món, khu vực..." readOnly />
            </div>

            <div className="pill">
              <span style={{ marginRight: 6 }}>📍</span>
              Đà Nẵng
            </div>
          </div>
        </div>
      </div>

      {/* Layout */}
      <div className="container">
        <div className="row">
          {/* Sidebar */}
          <div className="sidebar">
            <div className="card soft side-section">
              <div className="side-title">Menu</div>

              <NavLink to="/feed" className={({ isActive }) => `side-item ${isActive ? "active" : ""}`}>
                <div className="side-left">
                  <div className="icon"><Icon>🏠</Icon></div>
                  <div className="side-text">
                    <div className="side-main">Trang chủ</div>
                    <div className="side-sub">Feed</div>
                  </div>
                </div>
              </NavLink>

              <NavLink to="/restaurants" className={({ isActive }) => `side-item ${isActive ? "active" : ""}`}>
                <div className="side-left">
                  <div className="icon"><Icon>🍜</Icon></div>
                  <div className="side-text">
                    <div className="side-main">Tìm quán ăn</div>
                    <div className="side-sub">Restaurants</div>
                  </div>
                </div>
              </NavLink>

              <NavLink to="/appointments" className={({ isActive }) => `side-item ${isActive ? "active" : ""}`}>
                <div className="side-left">
                  <div className="icon"><Icon>💬</Icon></div>
                  <div className="side-text">
                    <div className="side-main">Cuộc hẹn</div>
                    <div className="side-sub">Chat trong cuộc hẹn</div>
                  </div>
                </div>
              </NavLink>

              <div style={{ marginTop: 14 }} className="muted">
                {user ? (
                  <div style={{ fontSize: 13, lineHeight: 1.6 }}>
                    {/* Đăng nhập: <b style={{ color: "var(--text)" }}>{user?.name}</b><br /> */}
                    Role: <b style={{ color: "var(--text)" }}>{user?.role}</b>
                  </div>
                ) : (
                  <div style={{ fontSize: 13 }}>Chưa có user</div>
                )}
              </div>

              <button className="btn full" style={{ marginTop: 12 }} onClick={logout}>
                ↩ Logout
              </button>
            </div>
          </div>

          {/* Main */}
          <div style={{ flex: 1 }}>{children}</div>

          {/* Right (optional) */}
          <div style={{ width: 280, position: "sticky", top: 78, alignSelf: "flex-start" }} className="hide-right">
            <div className="card soft side-section">
              <div className="side-title">Gợi ý</div>
              <div className="muted" style={{ fontSize: 13, lineHeight: 1.6 }}>
                Đăng status rủ kèo ăn • Review quán • Tạo cuộc hẹn và chat cùng bạn
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
