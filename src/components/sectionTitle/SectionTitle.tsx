import React, { type ReactElement } from 'react';
import styles from './SectionTitle.module.scss';

interface TitleProps {
  title: string;
}

const SectionTitle: React.FC<TitleProps> = ({ title }): ReactElement => {
  return <div className={styles.title}>{title}</div>;
};

export default SectionTitle;
