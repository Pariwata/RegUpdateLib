import React from 'react';
import { NavLink } from 'react-router-dom';
import { pages } from '../config/pageConfig';

export const NavBar: React.FC = () => {
  return (
    <nav className="nav-bar">
      <div className="nav-content">
        {pages.map((page) => (
          <NavLink
            key={page.path}
            to={page.path}
            className={({ isActive }) =>
              `nav-link ${isActive ? 'active' : ''}`
            }
          >
            {page.icon}
            {page.title}
          </NavLink>
        ))}
      </div>
    </nav>
  );
};
