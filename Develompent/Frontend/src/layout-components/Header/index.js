import React, { Fragment } from 'react';

import clsx from 'clsx';
import { Link } from 'react-router-dom';

import {
  Hidden,
  IconButton,
  AppBar,
  Box,
  Button,
  Tooltip,
  TextField,
  InputAdornment,
  Fab
} from '@material-ui/core';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { connect } from 'react-redux';

import { setSidebarToggleMobile } from '../../reducers/ThemeOptions';
import projectLogo from '../../assets/images/logo.svg';

import HeaderLogo from '../../layout-components/HeaderLogo';
import HeaderUserbox from '../../layout-components/HeaderUserbox';

import MenuOpenRoundedIcon from '@material-ui/icons/MenuOpenRounded';
import MenuRoundedIcon from '@material-ui/icons/MenuRounded';
import { CopyToClipboard } from 'react-copy-to-clipboard';

const Header = props => {
  const toggleSidebarMobile = () => {
    setSidebarToggleMobile(!sidebarToggleMobile);
  };
  const {
    headerShadow,
    headerFixed,
    sidebarToggleMobile,
    setSidebarToggleMobile
  } = props;

  return (
    <Fragment>
      <AppBar
        color="secondary"
        className={clsx('app-header header-class', {})}
        position={headerFixed ? 'fixed' : 'absolute'}
        elevation={headerShadow ? 11 : 3}>
        {!props.isCollapsedLayout && <HeaderLogo />}
        <Box className="app-header-toolbar">
          <Hidden lgUp>
            <Box
              className="app-logo-wrapper"
              title="Carolina React Admin Dashboard with Material-UI Free">
              <Link to="/LandingPage" className="app-logo-link">
                <IconButton
                  color="primary"
                  size="medium"
                  className="app-logo-btn logo-class">
                  <img
                    alt="Carolina React Admin Dashboard with Material-UI Free"
                    src={projectLogo}
                  />
                </IconButton>
              </Link>
            </Box>
          </Hidden>
          <Hidden mdDown>
            <Box className="d-flex align-items-center hearder-search-class">
              <TextField
                variant="outlined"
                value=""
                fullWidth
                InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                          <CopyToClipboard text="">
                              <Fab size="small" color="primary"><FontAwesomeIcon icon={['fas', 'search']} /></Fab>
                          </CopyToClipboard>
                      </InputAdornment>
                    ),
                }}
              />
            </Box>
          </Hidden>
          <Box className="d-flex align-items-center user-header-class">
            <Hidden mdDown>
              <Button className="m-2" color="secondary">Became a mentor</Button>
              <Button className="m-2" color="secondary">Find a mentor</Button>
              <Button className="m-2" color="secondary">Sign Up</Button>
              <Button variant="outlined" color="primary" className="m-2">
                Sign In
              </Button>
            </Hidden>
            <HeaderUserbox />
            <Box className="toggle-sidebar-btn-mobile">
              <Tooltip title="Toggle Sidebar" placement="right">
                <IconButton
                  color="inherit"
                  onClick={toggleSidebarMobile}
                  size="medium">
                  {sidebarToggleMobile ? (
                    <MenuOpenRoundedIcon />
                  ) : (
                    <MenuRoundedIcon />
                  )}
                </IconButton>
              </Tooltip>
            </Box>
          </Box>
        </Box>
      </AppBar>
    </Fragment>
  );
};

const mapStateToProps = state => ({
  headerShadow: state.ThemeOptions.headerShadow,
  headerFixed: state.ThemeOptions.headerFixed,
  sidebarToggleMobile: state.ThemeOptions.sidebarToggleMobile
});

const mapDispatchToProps = dispatch => ({
  setSidebarToggleMobile: enable => dispatch(setSidebarToggleMobile(enable))
});

export default connect(mapStateToProps, mapDispatchToProps)(Header);
