import { type ReactElement } from 'react';
import styles from './Contact.module.scss';
import SectionTitle from '../../components/sectionTitle/SectionTitle.tsx';
import email from '../../assets/contact/email.svg';
import github from '../../assets/contact/github.svg';
import linkedin from '../../assets/contact/linkedin.svg';

const Contact = (): ReactElement => {
  return (
    <div className={styles.contact} id="contact">
      <SectionTitle title="Contact" />
      <div className={styles.contactSection}>
        <div className={styles.itemSection}>
          <img src={email} alt="email" />
          <div className={styles.itemTitle}>Email</div>
          <a
            href="mailto:wgpilaresc@gmail.com"
            style={{ textDecoration: 'none', color: 'inherit' }}>
            <div className={styles.itemLink}>wgpilaresc@gmail.com</div>
          </a>
        </div>
        <div className={styles.itemSection}>
          <img src={github} alt="github" />
          <div className={styles.itemTitle}>GitHub</div>
          <a
            href="https://github.com/wpilares"
            style={{ textDecoration: 'none', color: 'inherit' }}>
            <div className={styles.itemLink}>github.com/wpilares</div>
          </a>
        </div>
        <div className={styles.itemSection}>
          <img src={linkedin} alt="linkedin" />
          <div className={styles.itemTitle}>LinkedIn</div>
          <a
            href="https://linkedin.com/in/wpilaresc"
            style={{ textDecoration: 'none', color: 'inherit' }}>
            <div className={styles.itemLink}>linkedin.com/in/wpilaresc</div>
          </a>
        </div>
      </div>
    </div>
  );
};

export default Contact;
