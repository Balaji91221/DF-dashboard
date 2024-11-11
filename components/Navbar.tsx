'use client';

import Link from 'next/link';
import { FaHome, FaUsers, FaChartLine, FaQuestionCircle } from 'react-icons/fa';

export const Navbar = () => {
  return (
    <nav className="bg-gray-900 text-white flex justify-between items-center p-4">
      <h1 className="text-2xl font-bold">MAuthN</h1>
      <ul className="flex space-x-6">
        <li>
          <Link href="/" className="hover:text-gray-400">
            <FaHome className="inline-block mr-2" />
            Dashboard
          </Link>
        </li>
        <li>
          <Link href="/users" className="hover:text-gray-400">
            <FaUsers className="inline-block mr-2" />
            Users
          </Link>
        </li>
        <li>
          <Link href="/analytics" className="hover:text-gray-400">
            <FaChartLine className="inline-block mr-2" />
            Analytics
          </Link>
        </li>
        <li>
          <Link href="/help" className="hover:text-gray-400">
            <FaQuestionCircle className="inline-block mr-2" />
            Help
          </Link>
        </li>
      </ul>
    </nav>
  );
};
