import React, { Fragment } from 'react';

import clsx from 'clsx';
import { Link } from 'react-router-dom';

import { IconButton, Box } from '@material-ui/core';

import projectLogo from '../../assets/images/logo.svg';

const HeaderLogo = props => {
  return (
    <Fragment>
      <div className={clsx('app-header-logo header-mobile-class', {})}>
        <Box
          className="header-logo-wrapper"
          title="Carolina React Admin Dashboard with Material-UI Free">
          <Link to="/LandingPage" className="header-logo-wrapper-link">
            <IconButton
              color="primary"
              size="medium"
              className="header-logo-wrapper-btn logo-class">
              <img
                alt="Carolina React Admin Dashboard with Material-UI Free"
                src={projectLogo}
              />
            </IconButton>
          </Link>
        </Box>
      </div>
    </Fragment>
  );
};

export default HeaderLogo;
