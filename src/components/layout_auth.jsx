// components/layout_auth.jsx
import React from "react";

export default function Layout({ children }) {
  return (
    <>
      <div className="container-xxl">
        <div className="authentication-wrapper authentication-basic container-p-y">
          <div className="authentication-inner">{children}</div>
        </div>
      </div>
    </>
  );
}
