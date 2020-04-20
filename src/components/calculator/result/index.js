import React, { useRef, useState } from 'react';
import PropTypes from 'prop-types';

import { carbonEmissionMealTypePerYear } from '../../../co2e/food/meals';
import {
  carbonEmissionTransportTypeWithDistance,
  carbonEmissionFlightType,
} from '../../../co2e/transport';
import { INITIAL_STATE } from '../../../pages/calculator';
import { TRANSPORT } from '../../../co2e/transport';
import { carbonEmissionsElectricity } from '../../../co2e/energy/electricity';
import { carbonEmissionsPurchase } from '../../../co2e/purchase';
import { animateValue } from '../../../utils';

import styles from './styles.module.scss';

import IsLike from './is-like';

const Result = ({ answers, setAnswers }) => {
  let [show, setShow] = useState({ 0: false, 1: false, 2: false });
  const [animation, setAnimation] = useState(true);
  const resultEl = useRef(null);
  const carbonEmissions =
    carbonEmissionMealTypePerYear(answers.dietPreference) +
    carbonEmissionTransportTypeWithDistance(
      answers.travelMethod,
      answers.travelDistancePerYear
    ) +
    carbonEmissionFlightType(
      TRANSPORT.SHORT_HAUL_FLIGHT,
      parseInt(answers.travelDomesticFlightsPerYear, 10) * 2
    ) +
    carbonEmissionFlightType(
      TRANSPORT.LONG_HAUL_FLIGHT,
      parseInt(answers.travelInternationalFlightsPerYear, 10) * 2
    ) +
    carbonEmissionsElectricity(answers.electricityKwhPerMonth) * 12 +
    carbonEmissionsPurchase(answers.purchaseAmountPerMonth) * 12;

  const carbonEmissionsResult = parseFloat(carbonEmissions.toFixed(1));

  return (
    <section>
      <article className={styles.results_container}>
        <h3>Your carbon footprint is</h3>
        <p className={styles.result}>
          <span className={styles.number} ref={resultEl}>
            {animation
              ? animateValue(resultEl, 1, carbonEmissionsResult, 50, () =>
                  setAnimation(false)
                )
              : carbonEmissionsResult}
          </span>
          <span>tons / year</span>
        </p>
        <button
          onClick={() => {
            setAnswers(INITIAL_STATE);
          }}
          className={styles.reset}
        >
          <small>(reset)</small>
        </button>
      </article>
      <IsLike
        animation={animation}
        carbonEmissionsResult={carbonEmissionsResult}
      />
    </section>
  );
};

Result.propTypes = {
  answers: PropTypes.shape({
    activeQuestionIndex: PropTypes.number,
    country: PropTypes.string,
    travelDistancePerYear: PropTypes.number,
    travelMethod: PropTypes.string,
    travelDomesticFlightsPerYear: PropTypes.number,
    travelInternationalFlightsPerYear: PropTypes.number,
    dietPreference: PropTypes.string,
    electricityKwhPerMonth: PropTypes.number,
    purchaseAmountPerMonth: PropTypes.number,
  }),
};

Result.defaultProps = {
  answers: PropTypes.shape({
    activeQuestionIndex: 6,
    country: 'af',
    travelDistancePerYear: 15000,
    travelMethod: 'car',
    travelDomesticFlightsPerYear: 6,
    travelInternationalFlightsPerYear: 2,
    dietPreference: 'lowMeat',
    electricityKwhPerMonth: 0,
    purchaseAmountPerMonth: 0,
  }),
};

export default Result;
