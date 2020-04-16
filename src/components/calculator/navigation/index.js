import React from 'react';

import styles from './styles.module.scss';

const Navigation = ({ currentStep, handlePrevious, handleNext }) => {
  return (
    <>
      {currentStep > 0 && (
        <button onClick={handlePrevious} className={styles.previous}>
          Previous
        </button>
      )}
      <button onClick={handleNext} className={styles.next}>
        {currentStep > 0 ? 'Next' : 'Start'}
      </button>
    </>
  );
};

export default Navigation;
