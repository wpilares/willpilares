import { type ReactElement } from 'react';
import styles from './Experience.module.scss';
import SectionTitle from '../../components/sectionTitle/SectionTitle.tsx';
import Jobs from '../../components/jobs/Jobs.tsx';

const Experience = (): ReactElement => {
  return (
    <div className={styles.experience}>
      <SectionTitle title="Experience" />
      <Jobs />
    </div>
  );
};

export default Experience;
