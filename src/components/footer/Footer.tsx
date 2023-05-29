import { type ReactElement } from 'react';
import styles from './Footer.module.scss';

const Footer = (): ReactElement => {
  return (
    <div className={styles.footer}>
      <div className={styles.options}>
        <a href="/#" style={{ textDecoration: 'none', color: 'inherit' }}>
          <div>Home</div>
        </a>
        <a
          href="/#experience"
          style={{ textDecoration: 'none', color: 'inherit' }}>
          <div>Experience</div>
        </a>
        <a
          href="/#contact"
          style={{ textDecoration: 'none', color: 'inherit' }}>
          <div>Contact</div>
        </a>
      </div>
      <div className={styles.copy}>
        &copy; 2023 Willber Guillermo Pilares Choccare
      </div>
    </div>
  );
};

export default Footer;
