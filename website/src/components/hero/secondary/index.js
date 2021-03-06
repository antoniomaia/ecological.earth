import React from 'react';
import PropTypes from 'prop-types';

import styles from './styles.module.scss';

const Secondary = ({ headline }) => {
  return (
    <div className={styles.hero}>
      <div className={styles.heroinside}>
        <h1>{headline}</h1>
      </div>
    </div>
  );
};

Secondary.propTypes = {
  headline: PropTypes.string.isRequired,
};

export default Secondary;
