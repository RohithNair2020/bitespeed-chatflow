import styles from './navbar.styles.module.css';
function Navbar() {
    return <div className={styles.navbarContainer}>
        <img className={styles.branding} src="bitespeed.logo.png" alt="bitespeed-branding" />
    </div>;
}

export default Navbar;
