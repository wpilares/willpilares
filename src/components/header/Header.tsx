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
          <div>Home</div>
          <div>Experience</div>
          <div>Contact</div>
        </div>
      </div>
      {!isMenuOpen && (
        <div className={styles.sideNavLinks}>
          <div>Home</div>
          <div>Experience</div>
          <div>Contact</div>
        </div>
      )}
    </div>
  );
};

export default Header;
