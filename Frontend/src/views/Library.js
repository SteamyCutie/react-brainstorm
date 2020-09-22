import React from 'react';
import PropTypes from 'prop-types';
import SwipeableViews from 'react-swipeable-views';
import { useTheme } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import { Container, Row, Col, Card, CardBody } from "shards-react";
// import LibrarySavedContent from "../components/common/LibrarySavedContent"
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

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleChangeIndex = (index) => {
    setValue(index);
  };

  return (
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
              {/* <Row> */}
                {/* <Col xl="4" lg="4" sm="6">
                  <LibrarySavedContent />
                </Col>
                <Col xl="4" lg="4" sm="6">
                  <LibrarySavedContent />
                </Col>
                <Col xl="4" lg="4" sm="6">
                  <LibrarySavedContent />
                </Col>
                <Col xl="4" lg="4" sm="6">
                  <LibrarySavedContent />
                </Col>
                <Col xl="4" lg="4" sm="6">
                  <LibrarySavedContent />
                </Col>
                <Col xl="4" lg="4" sm="6">
                  <LibrarySavedContent />
                </Col>
                <Col xl="4" lg="4" sm="6">
                  <LibrarySavedContent />
                </Col>
                <Col xl="4" lg="4" sm="6">
                  <LibrarySavedContent />
                </Col> */}
              {/* </Row> */}
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
  );
}
