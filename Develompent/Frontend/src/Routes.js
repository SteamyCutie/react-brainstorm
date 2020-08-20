import React, { lazy, Suspense } from 'react';
import { Switch, Route, Redirect, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';

import { ThemeProvider } from '@material-ui/styles';

import MuiTheme from './theme';

// Layout Blueprints

import { LeftSidebar, PresentationLayout } from './layout-blueprints';

// Example Pages

import Buttons from './pages/Buttons';
import Dropdowns from './pages/Dropdowns';
import NavigationMenus from './pages/NavigationMenus';
import ProgressBars from './pages/ProgressBars';
import Pagination from './pages/Pagination';
import Scrollable from './pages/Scrollable';
import Badges from './pages/Badges';
import Icons from './pages/Icons';
import UtilitiesHelpers from './pages/UtilitiesHelpers';
import RegularTables1 from './pages/RegularTables1';
import RegularTables4 from './pages/RegularTables4';
import FormsControls from './pages/FormsControls';

const DashboardDefault = lazy(() => import('./pages/DashboardDefault'));
const Cards3 = lazy(() => import('./pages/Cards3'));
const LandingPage = lazy(() => import('./pages/LandingPage'));
const Accordions = lazy(() => import('./pages/Accordions'));
const Modals = lazy(() => import('./pages/Modals'));
const Notifications = lazy(() => import('./pages/Notifications'));
const Popovers = lazy(() => import('./pages/Popovers'));
const Tabs = lazy(() => import('./pages/Tabs'));
const ApexCharts = lazy(() => import('./pages/ApexCharts'));
const Maps = lazy(() => import('./pages/Maps'));
const ListGroups = lazy(() => import('./pages/ListGroups'));

const Routes = () => {
  const location = useLocation();

  const pageVariants = {
    initial: {
      opacity: 0,
      scale: 0.99
    },
    in: {
      opacity: 1,
      scale: 1
    },
    out: {
      opacity: 0,
      scale: 1.01
    }
  };

  const pageTransition = {
    type: 'tween',
    ease: 'anticipate',
    duration: 0.4
  };

  return (
    <ThemeProvider theme={MuiTheme}>
      <AnimatePresence>
        <Suspense
          fallback={
            <div className="d-flex align-items-center vh-100 justify-content-center text-center font-weight-bold font-size-lg py-3">
              <div className="w-50 mx-auto">
                Please wait while we load the live preview examples
              </div>
            </div>
          }>
          <Switch>
            <Redirect exact from="/" to="/LandingPage" />
            <Route path={['/LandingPage']}>
              <PresentationLayout>
                <Switch location={location} key={location.pathname}>
                  <motion.div
                    initial="initial"
                    animate="in"
                    exit="out"
                    variants={pageVariants}
                    transition={pageTransition}>
                    <Route path="/LandingPage" component={LandingPage} />
                  </motion.div>
                </Switch>
              </PresentationLayout>
            </Route>

            <Route
              path={[
                '/upcomingSessions',
                '/profile',
                '/setAvailability',
                '/wallet',
                '/mySharePage',
                '/scheduleLiveForum',
                '/payment',
                '/trending',
                '/subscriptions',
                '/library',
                '/history',
                '/recommended'
              ]}>
              <LeftSidebar>
                <Switch location={location} key={location.pathname}>
                  <motion.div
                    initial="initial"
                    animate="in"
                    exit="out"
                    variants={pageVariants}
                    transition={pageTransition}>
                    <Route
                      path="/upcomingSessions"
                      component={DashboardDefault}
                    />
                    <Route path="/profile" component={Buttons} />
                    <Route path="/setAvailability" component={Dropdowns} />
                    <Route
                      path="/wallet"
                      component={NavigationMenus}
                    />
                    <Route path="/mySharePage" component={ProgressBars} />
                    <Route path="/scheduleLiveForum" component={Pagination} />
                    <Route path="/payment" component={Scrollable} />
                    <Route path="/trending" component={Badges} />
                    <Route path="/subscriptions" component={Icons} />
                    <Route
                      path="/library"
                      component={UtilitiesHelpers}
                    />
                    <Route path="/history" component={Cards3} />
                    <Route path="/recommended" component={Maps} />
                  </motion.div>
                </Switch>
              </LeftSidebar>
            </Route>
          </Switch>
        </Suspense>
      </AnimatePresence>
    </ThemeProvider>
  );
};

export default Routes;
