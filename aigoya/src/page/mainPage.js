import React from 'react';
import styles from '../css/mainPage.module.css';
import MainPopularMenu from '../component/mainPopularMenu'

const mainPage = () => {
  return (
    <div className={styles.mainContainer}>
      <MainPopularMenu/>
    </div>
  );
}

export default mainPage;
