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
        <div>
          <img src={email} alt="email" />
          <div>Email</div>
          <a
            href="mailto:wgpilaresc@gmail.com"
            style={{ textDecoration: 'none' }}>
            <div>wgpilaresc@gmail.com</div>
          </a>
        </div>
        <div>
          <img src={github} alt="github" />
          <div>Github</div>
          <a
            href="https://github.com/wpilares"
            style={{ textDecoration: 'none' }}>
            <div>github.com/wpilares</div>
          </a>
        </div>
        <div>
          <img src={linkedin} alt="linkedin" />
          <div>Linkedin</div>
          <a
            href="https://linkedin.com/in/wpilaresc"
            style={{ textDecoration: 'none' }}>
            <div>linkedin.com/in/wpilaresc</div>
          </a>
        </div>
      </div>
    </div>
  );
};

export default Contact;
