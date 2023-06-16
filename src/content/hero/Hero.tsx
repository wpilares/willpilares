import { type ReactElement } from 'react';
import styles from './Hero.module.scss';
import profilePhoto from '../../assets/me.jpg';
import CV from '../../assets/CV_Willber_Pilares.pdf';

const Hero = (): ReactElement => {
  return (
    <div className={styles.hero}>
      <img src={profilePhoto} alt="foto" className={styles.photo} />
      <div className={styles.about}>
        <div className={styles.title}>Full Stack Developer</div>
        <div className={styles.subtitle}>WILLBER PILARES</div>
        <div className={styles.resume}>
          I’m passionate about creating and learning about technology, with high
          capacities in analysis and solutions, a responsible person with
          initiative, creativity and punctuality, I gladly assume the challenges
          and goals that may arise, with ease of teamwork and management of
          interpersonal relationships, with the focus on achieving results.
        </div>
        <div className={styles.buttonSet}>
          <a href={CV} download>
            <button className={styles.button1}>Resume</button>
          </a>
          <a href="/#contact">
            <button className={styles.button2}>Contact</button>
          </a>
        </div>
      </div>
    </div>
  );
};

export default Hero;
