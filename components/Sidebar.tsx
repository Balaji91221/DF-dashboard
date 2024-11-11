'use client';

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { FaHome, FaUsers, FaChartLine, FaQuestionCircle, FaBars, FaTimes } from 'react-icons/fa'

interface SidebarProps {
  className?: string
}

const Sidebar: React.FC<SidebarProps> = ({ className }) => {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  const toggleSidebar = () => {
    setIsOpen(!isOpen)
  }

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsOpen(true)
      } else {
        setIsOpen(false)
      }
    }

    window.addEventListener('resize', handleResize)
    handleResize()

    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const navItems = [
    { href: '/', icon: FaHome, label: 'Dashboard' },
    { href: '/users', icon: FaUsers, label: 'Users' },
    { href: '/analytics', icon: FaChartLine, label: 'Analytics' },
    { href: '/help', icon: FaQuestionCircle, label: 'Help' },
  ]

  return (
    <>
      <button
        className="fixed top-4 left-4 z-50 rounded-full p-2 bg-gray-800 text-white transition-colors duration-200 
                   hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-600 md:hidden"
        onClick={toggleSidebar}
        aria-label={isOpen ? 'Close menu' : 'Open menu'}
      >
        {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
      </button>

      <nav
        className={`fixed top-0 left-0 h-screen bg-[#0f172a] shadow-xl 
                    transform transition-transform duration-300 ease-in-out z-40 
                    ${isOpen ? 'translate-x-0' : '-translate-x-full'} 
                    md:relative md:translate-x-0 md:shadow-none ${className}`}
      >
        <div className="p-6">
          <h1 className="text-3xl font-bold text-[#93c5fd]">
            MAuthN
          </h1>
        </div>

        <ul className="space-y-2 px-4">
          {navItems.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={`flex items-center rounded-lg p-3 text-sm font-medium transition-all duration-200
                            ${
                              pathname === item.href
                                ? 'bg-gray-800 text-white'
                                : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                            }`}
                onClick={() => setIsOpen(false)}
              >
                <item.icon className="mr-3 h-5 w-5" />
                <span>{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>

        <div className="absolute bottom-0 left-0 right-0 p-4">
          <div className="text-center text-sm text-gray-400">
            &copy; 2024 MAuthN
          </div>
        </div>
      </nav>

      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={() => setIsOpen(false)}
        ></div>
      )}
    </>
  )
}

export default Sidebar