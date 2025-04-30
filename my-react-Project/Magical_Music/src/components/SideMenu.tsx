"use client"

import { useState } from "react"
import { Link, useLocation } from "react-router-dom"
import { Home, FolderIcon as FolderMusic, FileText, Scissors, Share2, Search, Settings, Mic } from "lucide-react"
import "../styles/sidemenu.css"

const SideMenu = () => {
  const location = useLocation()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const menuItems = [
    { id: "/dashboard", label: "Home", icon: <Home size={20} /> },
    { id: "/dashboard/folder", label: "Song Folder", icon: <FolderMusic size={20} /> },
    { id: "/dashboard/transcribe", label: "Transcribe", icon: <FileText size={20} /> },
    { id: "/dashboard/cut", label: "Cut Song", icon: <Scissors size={20} /> },
    { id: "/dashboard/share", label: "Share Song", icon: <Share2 size={20} /> },
    { id: "/dashboard/search", label: "Search Songs", icon: <Search size={20} /> },
    { id: "/dashboard/settings", label: "Settings", icon: <Settings size={20} /> },
  ]

  const isActive = (path: string) => {
    try {
      if (path === "/dashboard" && location.pathname === "/dashboard") {
        return true
      }
      return location.pathname.startsWith(path)
    } catch (error) {
      console.error("Error in isActive function:", error)
      return false
    }
  }

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen)
  }

  return (
    <>
      <div className="mobile-menu-toggle" onClick={toggleMobileMenu}>
        <div className={`hamburger ${mobileMenuOpen ? "open" : ""}`}>
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>

      <div className={`side-menu ${mobileMenuOpen ? "mobile-open" : ""}`}>
        <div className="menu-items">
          {menuItems.map((item) => (
            <Link
              key={item.id}
              to={item.id}
              className={`menu-item ${isActive(item.id) ? "active" : ""}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              <div className="menu-icon">{item.icon}</div>
              <span className="menu-label">{item.label}</span>
              {isActive(item.id) && <div className="active-indicator" />}
            </Link>
          ))}
        </div>

        <div className="menu-footer">
          <div className="ai-assistant">
            <div className="ai-icon">
              <Mic size={20} />
            </div>
            <span>AI Assistant</span>
          </div>
        </div>
      </div>
    </>
  )
}

export default SideMenu
