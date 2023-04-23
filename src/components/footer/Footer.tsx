import { type ReactElement } from 'react';
import styles from './Footer.module.scss';

const Footer = (): ReactElement => {
  return (
    <div className={styles.footer}>
      <div className={styles.options}>
        <div>Home</div>
        <div>Experience</div>
        <div>Contact</div>
      </div>
      <div className={styles.copy}>
        &copy; 2023 Willber Guillermo Pilares Choccare
      </div>
    </div>
  );
};

export default Footer;
