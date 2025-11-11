// Layout.jsx
import React from 'react';
import './Layout.css';
import { Outlet } from "react-router-dom";

const Layout = () => {
  return (
    <div className="app-container">
      {/* Navbar */}
      <nav className="navbar">
        <div className="navbar-content">
          <div className="logo-container">
            <div className="logo">
              {/* Lebanese Cedar SVG */}
              <svg className="cedar-logo" viewBox="0 0 100 120" xmlns="http://www.w3.org/2000/svg">
                <path 
                  className="cedar-tree" 
                  d="M50,10 L60,25 L65,23 L70,35 L78,30 L75,45 L85,42 L75,55 L90,55 L75,65 L88,70 L70,75 L82,85 L60,83 L65,95 L50,90 L35,95 L40,83 L18,85 L30,75 L12,70 L25,65 L10,55 L25,55 L15,42 L25,45 L22,30 L30,35 L35,23 L40,25 Z" 
                />
                <rect className="cedar-trunk" x="45" y="90" width="10" height="20" />
              </svg>
            </div>
            <div className="title-container">
              <div className="main-title">مخابرات الجيش اللّبناني</div>
              <div className="sub-title">نظام تصاريح دخول المركبات إلى مجمّع الحدث - الجامعة اللبنانية</div>
            </div>
          </div>
          <div className="navbar-links">
          
            <a href="/RequestsTable">طلبات التصريح</a>
             <a href="/GuestRequestsTable">طلبات تصريح الزّوّار</a>
            <a href="/VehiclesEntryExitLog">سجل دخول وخروج المركبات</a>
            <a href="/AddAcademicYear">تعديل العام الدراسي</a>
           
          </div>
        </div>
      </nav>
      
      {/* Main Content Placeholder */}
      <main className="main-content">
 <Outlet />
      </main>
      
      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-links">
            <a href="#">من نحن</a>
            <a href="#">اتصل بنا</a>
            <a href="#">الشروط والأحكام</a>
            <a href="#">المساعدة</a>
          </div>
          <div className="copyright">
            جميع الحقوق محفوظة © ٢٠٢٥ مخابرات الجيش اللبناني
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;