import React from "react";
import { Container, Row, Col } from "shards-react";
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
      columns: [
        {
          name: 'Mentor',
          selector: 'mentorName',
          sortable: false,
          style: {
            fontSize: "16px",
          },
          cell: row => 
          <div>
            <img style={{height: '36px'}} src={row.avatar} className="subscription-mentor-avatar" alt="User avatar" />
              <a href="#!" onClick={() => this.handleClick(row.id)}>{row.mentorName}</a>
          </div>,
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
          cell: row => <div className={row.edit === true ? "subscription-edit-unsubscribe" : "subscription-edit-resubscribe" }>{row.edit === true ? <a href="#!">Unsubscribe</a> : <a href="#!">Resubscribe</a>}</div>,
        }
      ]
    };
  }

  componentWillMount() {
   this.getMentors();
  }

  handleClick(id) {
    const { history } = this.props;
    history.push('/subscribe-specific/' + id);
  }

  getMentors = async() => {
    try {
      this.setState({loading: true});
      const result = await getallmentors({email: localStorage.getItem('email')});
      if (result.data.result === "success") {
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
          if (result.data.data[i].avatar === undefined || result.data.data[i].avatar === "" || result.data.data[i].avatar == null)
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

      } else {
        this.showFail(result.data.message);
        if (result.data.message === "Token is Expired") {
          this.removeSession();
          window.location.href = "/";
        }
      }
      this.setState({loading: false});
    } catch(err) {
      this.setState({loading: false});
      this.showFail("Something Went wrong");
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

  showFail(text) {
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

  removeSession() {
    localStorage.removeItem('email');
    localStorage.removeItem('token');
    localStorage.removeItem('user-type');
    localStorage.removeItem('ws');
  }

  render() {
    return (
      <>
        {this.state.loading && <LoadingModal open={true} />}
        <ReactNotification />
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

