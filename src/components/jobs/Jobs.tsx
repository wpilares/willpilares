import { type ReactElement } from 'react';
import styles from './Jobs.module.scss';

interface CompanyData {
  data: {
    company: string;
    image: string;
    descriptions: string[];
    stack: string[];
  };
}

const Jobs = (props: CompanyData): ReactElement => {
  return (
    <div className={styles.jobs}>
      <div className={styles.description}>
        <div className={styles.jobTitle}>
          <img src={props.data.image} alt={props.data.company} />
          <div className={styles.title}>{props.data.company}</div>
        </div>
        {props.data.descriptions.map((item, index) => (
          <div key={index} className={styles.jobResume}>
            {item}
          </div>
        ))}
      </div>
      <div className={styles.stack}>
        <div className={styles.stackTitle}>
          <div className={styles.title}>Stack</div>
        </div>
        <ul className={styles.stackList}>
          {props.data.stack.map((item, index) => (
            <li key={index} className={styles.jobResume}>
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Jobs;
