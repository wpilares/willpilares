import { type ReactElement } from 'react';
import styles from './Contact.module.scss';
import SectionTitle from '../../components/sectionTitle/SectionTitle.tsx';
import email from '../../assets/contact/email.svg';
import github from '../../assets/contact/github.svg';
import linkedin from '../../assets/contact/linkedin.svg';

const Contact = (): ReactElement => {
  return (
    <div className={styles.contact}>
      <SectionTitle title="Contact" />
      <div className={styles.contactSection}>
        <div>
          <img src={email} alt="email" />
          <div>Email</div>
          <div>wgpilaresc@gmail.com</div>
        </div>
        <div>
          <img src={github} alt="github" />
          <div>Github</div>
          <div>github.com/wpilares</div>
        </div>
        <div>
          <img src={linkedin} alt="linkedin" />
          <div>Linkedin</div>
          <div>linkedin.com/in/wpilaresc</div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
