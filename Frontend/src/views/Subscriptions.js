import React from "react";
import PropTypes from "prop-types";
import { Container, Row, Col } from "shards-react";

import { Link } from "react-router-dom";

import SubscriptionTable from "./../components/common/SubscriptionTable";
import LoadingModal from "../components/common/LoadingModal";
import ReactNotification from 'react-notifications-component';
import 'react-notifications-component/dist/theme.css';
import { store } from 'react-notifications-component';

import { getallmentors } from '../api/api';

export default class Subscriptions extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      mentors: [
        
      ],
      subscriptionList: [
        // {
        //   id: 1,
        //   avatar: require("../images/avatar1.jpg"),
        //   mentorName: "Kianna Press",
        //   pageName: "Algebra 101",
        //   planFee: 49.99,
        //   status: true,
        //   edit: true,
        //   subscribe: true
        // },
        // {
        //   id: 2,
        //   avatar: require("../images/avatar2.jpg"),
        //   mentorName: "Cristofer Septimus",
        //   pageName: "Video editing",
        //   planFee: 29.50,
        //   status: true,
        //   edit: true,
        //   subscribe: true
        // },
        // {
        //   id: 3,
        //   avatar: require("../images/avatar3.jpg"),
        //   mentorName: "Martin Geidt",
        //   pageName: "Finance",
        //   planFee: "29.50",
        //   status: true,
        //   edit: true,
        //   subscribe: true
        // },
        // {
        //   id: 4,
        //   avatar: require("../images/avatar4.jpg"),
        //   mentorName: "Kaiya Torff",
        //   pageName: "Programming",
        //   planFee: 32.40,
        //   status: false,
        //   edit: false,
        //   subscribe: false
        // }
      ],
      columns: [
        {
          name: 'Mentor',
          selector: 'mentorName',
          sortable: false,
          style: {
            fontSize: "16px",
          },
          cell: row => <div><img src={row.avatar} className="subscription-mentor-avatar" alt="User avatar" /><Link to={row.subscribe ? "/subscription-specific" : "/unsubscribe-specific"} class="scription-to-specific">{row.mentorName}</Link></div>,
        },
        {
          name: 'Subscription page name',
          selector: 'pageName',
          sortable: false,
          style: {
            fontSize: "16px",
          },
        },
        {
          name: 'Subscription plan fee',
          selector: 'planFee',
          sortable: false,
          style: {
            fontSize: "16px",
          },
          format: row => `$${row.planFee}`,
        },
        {
          name: 'Status',
          selector: 'status',
          sortable: false,
          style: {
            fontSize: "16px",
          },
          cell: row => <div>{row.status === true ? "Active" : "Inactive"}</div>,
        },
        {
          name: 'Edit',
          selector: 'edit',
          sortable: false,
          center: true,
          cell: row => <div className={row.edit === true ? "subscription-edit-unsubscribe" : "subscription-edit-resubscribe" }>{row.edit === true ? "Unsubscribe" : "Resubscribe"}</div>,
        }
      ]
    };
  }

  componentWillMount() {
   this.getMentors();
  }

  getMentors = async() => {
    try {
      this.setState({loading: true});
      const result = await getallmentors({email: localStorage.getItem('email')});
      if (result.data.result == "success") {
        var data_arr = [];
        var arr = {
          id: '',
          avatar: '',
          mentorName: '',
          pageName: '',
          planFee: 0,
          status: false,
          edit: false,
          subscribe: false
        };
        for (var i = 0; i < result.data.data.length; i ++) {
          arr.id = result.data.data[i].id;
          if (result.data.data[i].avatar == undefined || result.data.data[i].avatar == "" || result.data.data[i].avatar == null)
            arr.avatar = require("../images/avatar.jpg");
          else 
            arr.avatar = result.data.data[i].avatar;
          arr.mentorName = result.data.data[i].name;
          arr.pageName = result.data.data[i].sub_page_name;
          arr.planFee = result.data.data[i].sub_plan_fee;
          arr.status = result.data.data[i].status;

          data_arr.push(arr);
          arr = {};
        }
        this.setState({
          loading: false,
          mentors: data_arr
        });

        console.log(this.state.mentors);
      } else {
      }
      this.setState({loading: false});
    } catch(err) {
      this.setState({loading: false});
      this.showFail("Edit Profile Fail");
    };
  }

  showSuccess(text) {
    store.addNotification({
      title: "Success",
      message: text,
      type: "success",
      insert: "top",
      container: "top-right",
      dismiss: {
        duration: 500,
        onScreen: false,
        waitForAnimation: false,
        showIcon: false,
        pauseOnHover: false
      },
    });
  }

  showFail() {
    store.addNotification({
      title: "Fail",
      message: "Action Fail!",
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
  render() {
    return (
      <>
        {this.state.loading && <LoadingModal open={true} />}
        <Container fluid className="main-content-container px-4 main-content-container-class">
          <Row className="wallet-data-table-class py-4">
            <Col lg="12" md="12" sm="12">
              <SubscriptionTable data={this.state.mentors} header={this.state.columns}/>
            </Col>
          </Row>
        </Container>
      </>
    )
  }
};

