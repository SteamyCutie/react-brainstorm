import React from "react";
import { Container, Row, Col } from "shards-react";
import Pagination from '@material-ui/lab/Pagination';

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
      totalCnt: 0,
      loading: false,
      mentors: [],
      columns: [
        {
          name: 'Mentor',
          selector: 'mentorName',
          sortable: true,
          style: {
            fontSize: "16px"
          },
          cell: row => 
          <div>
            <img style={{height: '36px'}} src={row.avatar} className="subscription-mentor-avatar" alt="User avatar" />
              {/* <a href="#!" onClick={() => this.handleSub(row.id)} style={{color: 'black'}}>{row.mentorName}</a> */}
              <span>{row.mentorName}</span>
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
          sortable: true,
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
          cell: row => 
            <div className={row.sub_id.indexOf(parseInt(localStorage.getItem('user_id'))) === -1 ? "subscription-edit-resubscribe" : "subscription-edit-unsubscribe" }>
              {row.sub_id.indexOf(parseInt(localStorage.getItem('user_id'))) === -1 ? <a href="#!" onClick={() => this.handleSub(row.id)} style={{color: '#999999'}}>Subscripbe</a> : <a href="#!" onClick={() => this.handleUnsub(row.id)}>Unsubscribe</a>}
            </div>,
        }
      ]
    };
  }

  componentWillMount() {
   this.getMentors(1);
  }

  handleSub(id) {
    const { history } = this.props;
    history.push('/subscribe-specific/' + id);
  }

  handleUnsub(id) {
    const { history } = this.props;
    history.push('/unsubscription-specific/' + id);
  }

  getMentors = async(pageNo) => {
    let param = {
      email: localStorage.getItem('email'),
      page: pageNo,
      rowsPerPage: 10
    }
    try {
      this.setState({loading: true});
      const result = await getallmentors(param);
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
          subscribe: false,
          sub_id: []
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
          arr.sub_id = result.data.data[i].sub_id;

          data_arr.push(arr);
          arr = {};
        }
        this.setState({
          loading: false,
          mentors: data_arr,
          totalCnt: result.data.totalRows % 10 === 0 ? result.data.totalRows / 10 : parseInt(result.data.totalRows / 10) + 1
        });

      } else if (result.data.result === "warning") {
          this.showWarning(result.data.message);
      } else {
        if (result.data.message === "Token is Expired") {
          this.removeSession();
          window.location.href = "/";
        } else {
          this.showFail(result.data.message);
        }
      }
      this.setState({loading: false});
    } catch(err) {
      this.setState({loading: false});
      this.showFail("Something Went wrong");
    };
  }

  onChangePagination(e, value) {
    this.getMentors(value);
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

  showWarning(text) {
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
    });
  }

  removeSession() {
    localStorage.clear();
  }

  render() {
    const {loading, mentors, columns, totalCnt} = this.state;
    return (
      <>
        {loading && <LoadingModal open={true} />}
        <ReactNotification />
        <Container fluid className="main-content-container px-4 main-content-container-class">
          <Row className="wallet-data-table-class py-4">
            <Col lg="12" md="12" sm="12">
              <SubscriptionTable data={mentors} header={columns}/>
            </Col>
          </Row>
          {mentors.length > 0 && <Row className="pagination-center">
            <Pagination count={totalCnt} onChange={(e, v) => this.onChangePagination(e, v)} color="primary" />
          </Row>}
        </Container>
      </>
    )
  }
};

