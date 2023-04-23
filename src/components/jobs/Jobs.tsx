import { type ReactElement } from 'react';
import styles from '../../content/experience/Experience.module.scss';

const Jobs = (): ReactElement => {
  return (
    <div className={styles.jobs}>
      <div className={styles.description}>Resumen</div>
      <div className={styles.stack}>
        <div>Stack</div>
        <ul>
          <li>HTML</li>
          <li>HTML</li>
          <li>HTML</li>
          <li>HTML</li>
          <li>HTML</li>
          <li>HTML</li>
        </ul>
      </div>
    </div>
  );
};

export default Jobs;
