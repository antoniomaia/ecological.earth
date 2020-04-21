import React, { useRef, useState, useMemo , useEffect} from 'react';
import PropTypes from 'prop-types';

import { carbonEmissionMealTypePerYear, MEALS } from '../../../co2e/food/meals';
import {
  carbonEmissionTransportTypeWithDistance,
  carbonEmissionFlightType,
} from '../../../co2e/transport';
import { INITIAL_STATE } from '../../../pages/calculator';
import { TRANSPORT } from '../../../co2e/transport';
import { carbonEmissionsElectricity } from '../../../co2e/energy/electricity';
import { carbonEmissionsPurchase } from '../../../co2e/purchase';
import { animateValue } from '../../../utils';
import Firebase from "firebase";
import config from "../../../config";
import IsLike from './is-like';
import GlobalAverage from './global-average';
import { countries } from '../../../constants/countries';

import styles from './styles.module.scss';

const Result = React.memo(({ answers, setAnswers }) => {
  if (!Firebase.apps.length) {
    Firebase.initializeApp(config);
  }
  const [animation, setAnimation] = useState(true);
  const resultEl = useRef(null);

  const carbonEmissions = useMemo(
    () =>
      carbonEmissionMealTypePerYear(
        answers.dietPreference || MEALS.MEDIUM_MEAT
      ) +
      carbonEmissionTransportTypeWithDistance(
        answers.travelMethod || TRANSPORT.CAR,
        answers.travelDistancePerYear || 0
      ) +
      carbonEmissionFlightType(
        TRANSPORT.SHORT_HAUL_FLIGHT,
        (answers.travelDomesticFlightsPerYear || 0) * 2
      ) +
      carbonEmissionFlightType(
        TRANSPORT.LONG_HAUL_FLIGHT,
        (answers.travelInternationalFlightsPerYear || 0) * 2
      ) +
      carbonEmissionsElectricity(answers.electricityKwhPerMonth) * 12 +
      carbonEmissionsPurchase(answers.purchaseAmountPerMonth) * 12,
    [answers]
  );

  const carbonEmissionsResult = parseFloat(carbonEmissions.toFixed(1));

  

  function saveValuesOnDb(value){
    const key = localStorage.getItem("key");
    if(!key){
      const key2 = Firebase.database().ref().push({value}).key;
      console.log("Data Saved!")
      localStorage.setItem("key",key2);
    }
  } 

  const footprintResult = useMemo(
    () => {
      return (
        <>
          {carbonEmissionsResult > 0 && (
            <p className={styles.result}>
              <span className={styles.number} ref={resultEl}>
                {animation
                  ? animateValue(resultEl, 1, carbonEmissionsResult, 50, () =>
                      setAnimation(false)
                    )
                  : carbonEmissionsResult}
                {}
              </span>
              <span>tons / year</span>
            </p>
          )}
          {carbonEmissionsResult <= 0 && (
            <>
              <br />
              <h2>Try again</h2>
            </>
          )}
        </>
      );
    },
    [carbonEmissionsResult]
  );
  useEffect(
    () => {
      saveValuesOnDb({
        // TODO: Must change to name only if export o CSV
        country: countries.find(c => c.countryCode === answers.country),
        carbonEmissionMeal:answers.dietPreference,
        travelMethod:answers.travelMethod,
        travelDistancePerYear:answers.travelDistancePerYear,
        travelDomesticFlightsPerYear:answers.travelDomesticFlightsPerYear,
        travelInternationalFlightsPerYear:answers.travelInternationalFlightsPerYear,
        electricityKwhPerMonth:answers.electricityKwhPerMonth,
        purchaseAmountPerMonth:answers.purchaseAmountPerMonth,
        carbonEmissionsResult:carbonEmissionsResult})
    },
    []
  );
  return (
    <section>
      <article className={styles.results_container}>
        <h3>Your carbon footprint is</h3>
        {footprintResult}
        <button
          onClick={() => {
            localStorage.clear();
            setAnswers(INITIAL_STATE);
          }}
          className={styles.reset}
        >
          reset
        </button>
      </article>
      <IsLike
        animation={animation}
        carbonEmissionsResult={carbonEmissionsResult}
      />
      <GlobalAverage
        result={carbonEmissionsResult}
        countryCode={answers.country}
      />
    </section>
  );
});

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
