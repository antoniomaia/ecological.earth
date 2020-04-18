import React from 'react';
import { Link } from 'react-router-dom';

import Logo from '../logo';
import Social from '../social';
import SocialMedia from './social-media';

import styles from './styles.module.scss';

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <Logo />

      <div class="main-footer">
        <div class="block-footer social-links">
          <Social />
        </div>

        <div class="block-footer page-links">
          <ul className={styles.links}>
            <li>
              <Link to={'/about'}>About Us</Link>
            </li>
            <li>
              <Link to={'/terms-conditions'}>Terms & Conditions</Link>
            </li>
            <li>
              <Link to={'/privacy-policy'}>Privacy Policy</Link>
            </li>
            <li>early access</li>
            <li>feedback</li>
          </ul>
        </div>
      </div>
      <SocialMedia />

      <p className={styles.copyright}>
        <small>Ecological.Earth © 2020 All Rights Reserved.</small>
      </p>
    </footer>
  );
};

export default Footer;
