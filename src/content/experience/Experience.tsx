import { type ReactElement } from 'react';
import styles from './Experience.module.scss';
import SectionTitle from '../../components/sectionTitle/SectionTitle.tsx';
import Jobs from '../../components/jobs/Jobs.tsx';
import data from '../../../data.json';

const Experience = (): ReactElement => {
  return (
    <div className={styles.experience}>
      <SectionTitle title="Experience" />
      <Jobs data={data.company_1} />
      <Jobs data={data.company_2} />
    </div>
  );
};

export default Experience;
