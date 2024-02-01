import { Login } from "@microsoft/mgt-react";
import { NavLink } from "react-router-dom";
import styles from "./navbar.module.css";

export default function Navbar() {
  return (
    <header className={styles.header}>
      <NavLink to="/">ADAM Tool</NavLink>
      <nav className={styles.nav}>
        <ul>
          <li>
            <NavLink to="/groupLookup">Group Lookup</NavLink>
          </li>
          <li>
            <a href="#">Clone Assignments</a>
          </li>
          <li>
            <Login loginView="avatar" />
          </li>
        </ul>
      </nav>
    </header>
  );
}
