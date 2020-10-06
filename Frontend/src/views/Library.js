import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import SwipeableViews from 'react-swipeable-views';
import { useTheme } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import { Container, Row, Col, Card, CardBody } from "shards-react";
import ReactNotification from 'react-notifications-component';
import 'react-notifications-component/dist/theme.css';
import { store } from 'react-notifications-component';
import LoadingModal from "../components/common/LoadingModal";
import { getlibrary, signout } from '../api/api';
import LibrarySavedContent from "../components/common/LibrarySavedContent"
// import SmallCard3 from "../components/common/SmallCard3"

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `full-width-tab-${index}`,
    'aria-controls': `full-width-tabpanel-${index}`,
  };
}

// const useStyles = makeStyles((theme) => ({
//   root: {
//     backgroundColor: theme.palette.background.paper,
//     width: 500,
//   },
// }));

export default function Library() {
  const theme = useTheme();
  const [value, setValue] = React.useState(0);
  const [library, setLibrary] = React.useState([]);
  const [loading, setLoading] = React.useState(false);

  useEffect(() => {
    let param = {
      student_id: localStorage.getItem('user_id')
    }
    async function fetchData() {
      try {
        setLoading(true);
        const result = await getlibrary(param);
        if (result.data.result === "success") {
          setLibrary(result.data.data);
        } else if (result.data.result === "warning") {
          showWarning(result.data.message);
        } else {
          if (result.data.message === "Token is Expired") {
            showFail(result.data.message);
            signout();
          } else if (result.data.message === "Token is Invalid") {
            showFail(result.data.message);
            signout();
          } else if (result.data.message === "Authorization Token not found") {
            showFail(result.data.message);
            signout();
          } else {
            showFail(result.data.message);
          }
        } 
        setLoading(false);
      } catch(err) {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleChangeIndex = (index) => {
    setValue(index);
  };

  const signout = async() => {
    const param = {
      email: localStorage.getItem('email')
    }

    try {
      const result = await signout(param);
      if (result.data.result === "success") {
        removeSession();
      } else if (result.data.result === "warning") {
        removeSession();
      } else {
        if (result.data.message === "Token is Expired") {
          removeSession();
        } else if (result.data.message === "Token is Invalid") {
          removeSession();
        } else if (result.data.message === "Authorization Token not found") {
          removeSession();
        } else {
          removeSession();
        }
      }
    } catch(error) {
      removeSession();
    }
  }

  const showFail = (text) => {
    store.addNotification({
      title: "Fail",
      message: text,
      type: "danger",
      insert: "top",
      container: "top-right",
      dismiss: {
        duration: 500,
        onScreen: false,
        waitForAnimation: false,
        showIcon: false,
        pauseOnHover: false
      }
    });
  }

  const showWarning = (text) => {
    store.addNotification({
      title: "Warning",
      message: text,
      type: "warning",
      insert: "top",
      container: "top-right",
      dismiss: {
        duration: 500,
        onScreen: false,
        waitForAnimation: false,
        showIcon: false,
        pauseOnHover: false
      }
    })
  }

  const removeSession = () => {
    localStorage.clear();
    window.location.href = "/";
  }

  return (
    <>
      {loading && <LoadingModal open={true} />}
      <ReactNotification />
      <Container fluid className="main-content-container px-4 pb-4 main-content-container-class page-basic-margin">
        <Row noGutters className="page-header py-4">
          <Col xs="12" sm="12" className="page-title">
            <h3>Library</h3>
          </Col>
        </Row>
        <Card small className="library-card">
          <CardBody className="no-padding">
            <AppBar position="static" color="default" className="library-tab">
              <Tabs
                value={value}
                onChange={handleChange}
                indicatorColor="primary"
                textColor="primary"
                // centered
              >
                <Tab label="Saved content" {...a11yProps(0)} />
                <Tab label="Upcoming events" {...a11yProps(1)} />
              </Tabs>
            </AppBar>
            <SwipeableViews
              axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
              index={value}
              onChangeIndex={handleChangeIndex}
            >
              <TabPanel value={value} index={0} dir={theme.direction}>
                <Row>
                  {library.map((item, idx) =>
                    <Col xl="4" lg="4" sm="6">
                      <LibrarySavedContent item={item} />
                    </Col>
                  )}
                </Row>
              </TabPanel>
              <TabPanel value={value} index={1} dir={theme.direction}>
                {/* <Row> */}
                  {/* <Col xl="4" lg="4" sm="6">
                    <SmallCard3 />
                  </Col>
                  <Col xl="4" lg="4" sm="6">
                    <SmallCard3 />
                  </Col>
                  <Col xl="4" lg="4" sm="6">
                    <SmallCard3 />
                  </Col>
                  <Col xl="4" lg="4" sm="6">
                    <SmallCard3 />
                  </Col>
                  <Col xl="4" lg="4" sm="6">
                    <SmallCard3 />
                  </Col>
                  <Col xl="4" lg="4" sm="6">
                    <SmallCard3 />
                  </Col>
                  <Col xl="4" lg="4" sm="6">
                    <SmallCard3 />
                  </Col> */}
                {/* </Row> */}
              </TabPanel>
            </SwipeableViews>
          </CardBody>
        </Card>
      </Container>
    </>
  );
}
