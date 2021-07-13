import React from 'react';
import { NavLink } from 'react-router-dom';

const MainMenuDropdown = ({ currentUser, showMobileMenu }) => {
    return (
        <li className="nav-item dropdown">
            <NavLink
                className="nav-link dropdown-toggle"
                id="navbarDropdownDashboard"
                to="/dashboard"
                disabled={!currentUser}
                activeClassName="active"
                data-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded="false"
            >
                Manage
            </NavLink>
            <div
                className={`dropdown-menu ${showMobileMenu ? 'show' : ''} `}
                aria-labelledby="navbarDropdownDashboard"
            >
                <NavLink className="dropdown-item" to="/my-milestones">
                    Hitos
              </NavLink>
                <NavLink className="dropdown-item" to="/donations">
                    Donaciones
              </NavLink>
                <NavLink className="dropdown-item" to="/delegations">
                    Delegaciones
              </NavLink>
                <NavLink className="dropdown-item" to="/my-dacs">
                    DACs
              </NavLink>
                <NavLink className="dropdown-item" to="/my-campaigns">
                    Campa&ntilde;as
              </NavLink>
            </div>
        </li>

    )
}

export default MainMenuDropdown;
