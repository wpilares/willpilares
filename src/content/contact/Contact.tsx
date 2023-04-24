import { type ReactElement } from 'react';
import styles from './Contact.module.scss';
import SectionTitle from '../../components/sectionTitle/SectionTitle.tsx';

const Contact = (): ReactElement => {
  return (
    <div>
      <SectionTitle title="Contact" />
      <div className={styles.contactSection}>
        <div>Email</div>
        <div>Github</div>
        <div>Linkedin</div>
      </div>
    </div>
  );
};

export default Contact;
