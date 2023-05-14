import { type ReactElement, useState } from 'react';
import styles from './Header.module.scss';
import menu from '../../assets/menu.svg';
import close from '../../assets/close.svg';

const Header = (): ReactElement => {
  const [isMenuOpen, setIsMenuOpen] = useState(true);

  const handleMenuClick = (): void => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className={styles.nav}>
      <div className={styles.header}>
        <img
          src={isMenuOpen ? menu : close}
          alt={isMenuOpen ? 'menu' : 'close'}
          height={50}
          width={50}
          className={styles.menu}
          onClick={handleMenuClick}
        />
        <div className={styles.navbarBrand}>
          <div className={styles.logo}>W</div>
          <span className={styles.firstTitle}>W</span>
          <span className={styles.secondTitle}>Pilares</span>
        </div>
        <div className={styles.navbarLinks}>
          <a href="#" style={{ textDecoration: 'none' }}>
            <div>Home</div>
          </a>
          <a href="/#experience" style={{ textDecoration: 'none' }}>
            <div>Experience</div>
          </a>
          <a href="/#contact" style={{ textDecoration: 'none' }}>
            <div>Contact</div>
          </a>
        </div>
      </div>
      {!isMenuOpen && (
        <div className={styles.sideNavLinks}>
          <a href="#" style={{ textDecoration: 'none' }}>
            <div>Home</div>
          </a>
          <a href="/#experience" style={{ textDecoration: 'none' }}>
            <div>Experience</div>
          </a>
          <a href="/#contact" style={{ textDecoration: 'none' }}>
            <div>Contact</div>
          </a>
        </div>
      )}
    </div>
  );
};

export default Header;
