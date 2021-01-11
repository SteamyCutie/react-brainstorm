import React from "react";
import { Container, Row, Col } from "shards-react";
import Pagination from '@material-ui/lab/Pagination';

import AssociationTable from "../components/common/AssociationTable";
import LoadingModal from "../components/common/LoadingModal";
import { ToastsStore } from 'react-toasts';
import { 
  getallmentors, 
  signout, 
  accociateAccept,
  associateDecline,
  associateUnassociate,
  associateReassociate,
  associateWithdraw 
} from '../api/api';

const mentorData = [
  {
    user_id: 0,
    avatar: "https://brainshares.s3-us-west-2.amazonaws.com/avatar.jpg",
    mentorName: "Dmytro Holovach",
    status: 4
  },
  {
    user_id: 1,
    avatar: "https://brainshares.s3-us-west-2.amazonaws.com/avatar.jpg",
    mentorName: "Arturs Brokans",
    status: 1
  },
  {
    user_id: 2,
    avatar: "https://brainshares.s3-us-west-2.amazonaws.com/avatar.jpg",
    mentorName: "Eriks Guisev",
    status: 2
  },
  {
    user_id: 3,
    avatar: "https://brainshares.s3-us-west-2.amazonaws.com/avatar.jpg",
    mentorName: "Saint Walker",
    status: 3
  },
  {
    user_id: 4,
    avatar: "https://brainshares.s3-us-west-2.amazonaws.com/avatar.jpg",
    mentorName: "Guy Walker",
    status: 2
  },
  {
    user_id: 5,
    avatar: "https://brainshares.s3-us-west-2.amazonaws.com/avatar.jpg",
    mentorName: "Shyan Walker",
    status: 1
  },
  {
    user_id: 6,
    avatar: "https://brainshares.s3-us-west-2.amazonaws.com/avatar.jpg",
    mentorName: "Shenea Walker",
    status: 0
  }
]

export default class Association extends React.Component {
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
              <img style={{ height: '36px' }} src={row.avatar} className="subscription-mentor-avatar" alt="User avatar" />
              {/* <a href="javascript:void(0)" onClick={() => this.handleSub(row.id)} style={{color: 'black'}}>{row.mentorName}</a> */}
              <span>{row.mentorName}</span>
            </div>,
        },
        {
          name: 'Status',
          selector: 'status',
          sortable: true,
          style: {
            fontSize: "16px",
          },
          cell: row => 
            <div>
              {row.status === 0 && "Pending"}
              {row.status === 1 && "Connected"}
              {row.status === 2 && "Declined"}
              {row.status === 3 && "Cancelled"}
              {row.status === 4 && "Admiting"}
            </div>,
        },
        {
          name: 'Edit',
          selector: 'edit',
          sortable: false,
          center: true,
          cell: row =>
            <div style={{display: "flex"}}>
              {row.status == 0 &&
                <>
                {/* <div className={row.sub_id.indexOf(parseInt(localStorage.getItem('user_id'))) === -1 ? "subscription-edit-resubscribe" : "subscription-edit-unsubscribe"}> */}
                  <div className="association-button" onClick={() => this.handleWithdraw(row.user_id)}>
                    {/* {row.sub_id.indexOf(parseInt(localStorage.getItem('user_id'))) === -1 ? <a href="javascript:void(0)" onClick={() => this.handleSub(row.id)} style={{ color: '#999999' }}>Subscripbe</a> : <a href="javascript:void(0)" onClick={() => this.handleUnsub(row.id)}>Unsubscribe</a>} */}
                    {/* <a href="javascript:void(0)" style={{ color: '#04b5fa' }}>Withdraw</a> */}
                    Withdraw
                  </div>
                </>
              }
              {row.status == 1 &&
                <>
                {/* <div className={row.sub_id.indexOf(parseInt(localStorage.getItem('user_id'))) === -1 ? "subscription-edit-resubscribe" : "subscription-edit-unsubscribe"}> */}
                  <div className="association-button" onClick={() => this.handleUnassociate(row.user_id)}>
                    {/* {row.sub_id.indexOf(parseInt(localStorage.getItem('user_id'))) === -1 ? <a href="javascript:void(0)" onClick={() => this.handleSub(row.id)} style={{ color: '#999999' }}>Subscripbe</a> : <a href="javascript:void(0)" onClick={() => this.handleUnsub(row.id)}>Unsubscribe</a>} */}
                    {/* <a href="javascript:void(0)" style={{ color: '#04b5fa' }}>Unassociate</a> */}
                    Unassociate
                  </div>
                </>
              }
              {row.status == 2 &&
                <>
                  {/* <div className={row.sub_id.indexOf(parseInt(localStorage.getItem('user_id'))) === -1 ? "subscription-edit-resubscribe" : "subscription-edit-unsubscribe"}> */}
                  <div className="association-button" onClick={() => this.handleReassociate(row.user_id)}>
                    {/* {row.sub_id.indexOf(parseInt(localStorage.getItem('user_id'))) === -1 ? <a href="javascript:void(0)" onClick={() => this.handleSub(row.id)} style={{ color: '#999999' }}>Subscripbe</a> : <a href="javascript:void(0)" onClick={() => this.handleUnsub(row.id)}>Unsubscribe</a>} */}
                    {/* <a href="javascript:void(0)" style={{ color: '#04b5fa' }}>Reassociate</a> */}
                    Reassociate
                  </div>
                </>
              }
              {row.status == 3 &&
                <>
                  {/* <div className={row.sub_id.indexOf(parseInt(localStorage.getItem('user_id'))) === -1 ? "subscription-edit-resubscribe" : "subscription-edit-unsubscribe"}> */}
                  <div className="association-button" onClick={() => this.handleReassociate(row.user_id)}>
                    {/* {row.sub_id.indexOf(parseInt(localStorage.getItem('user_id'))) === -1 ? <a href="javascript:void(0)" onClick={() => this.handleSub(row.id)} style={{ color: '#999999' }}>Subscripbe</a> : <a href="javascript:void(0)" onClick={() => this.handleUnsub(row.id)}>Unsubscribe</a>} */}
                    {/* <a href="javascript:void(0)" style={{ color: '#04b5fa' }}>Reassociate</a> */}
                    Reassociate
                  </div>
                </>
              }
              {row.status == 4 &&
                <>
                  {/* <div className={row.sub_id.indexOf(parseInt(localStorage.getItem('user_id'))) === -1 ? "subscription-edit-resubscribe" : "subscription-edit-unsubscribe"}> */}
                  <div className="association-button" onClick={() => this.handleAccept(row.user_id)}>
                    {/* {row.sub_id.indexOf(parseInt(localStorage.getItem('user_id'))) === -1 ? <a href="javascript:void(0)" onClick={() => this.handleSub(row.id)} style={{ color: '#999999' }}>Subscripbe</a> : <a href="javascript:void(0)" onClick={() => this.handleUnsub(row.id)}>Unsubscribe</a>} */}
                    {/* <a href="javascript:void(0)" style={{ color: '#04b5fa' }}>Accept</a> */}
                    Accept
                  </div>
                  {/* <div className={row.sub_id.indexOf(parseInt(localStorage.getItem('user_id'))) === -1 ? "subscription-edit-resubscribe" : "subscription-edit-unsubscribe"}> */}
                  <div className="association-button" onClick={() => this.handleDecline(row.user_id)}>
                    {/* {row.sub_id.indexOf(parseInt(localStorage.getItem('user_id'))) === -1 ? <a href="javascript:void(0)" onClick={() => this.handleSub(row.id)} style={{ color: '#999999' }}>Subscripbe</a> : <a href="javascript:void(0)" onClick={() => this.handleUnsub(row.id)}>Unsubscribe</a>} */}
                    {/* <a href="javascript:void(0)" style={{ color: '#04b5fa' }}>Decline</a> */}
                    Decline
                  </div>
                </>
              } 
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

  handleAccept = async (id) => {
    console.log("Accept", id);
    let param ={
      request_id: localStorage.getItem('user_id'),
      response_id: id
    };

    try {
      this.setState({ loading: true });
      const result = await accociateAccept(param);
      if (result.data.result === "success") {
        // this.getAssociationStatus(id);
      } else if (result.data.result === "warning") {
        ToastsStore.warning(result.data.message);
      } else {
        if (result.data.message === "Token is Expired") {
          ToastsStore.error(result.data.message);
          this.signout();
        } else if (result.data.message === "Token is Invalid") {
          ToastsStore.error(result.data.message);
          this.signout();
        } else if (result.data.message === "Authorization Token not found") {
          ToastsStore.error(result.data.message);
          this.signout();
        } else {
          ToastsStore.error(result.data.message);
        }
      }
      this.setState({ loading: false });
    } catch (err) {
      this.setState({ loading: false });
      ToastsStore.error("Something Went wrong");
    };
  }

  handleDecline = async (id) => {
    console.log("Decline", id);
    let param ={
      request_id: localStorage.getItem('user_id'),
      response_id: id
    };

    try {
      this.setState({ loading: true });
      const result = await associateDecline(param);
      if (result.data.result === "success") {
        // this.getAssociationStatus(id);
      } else if (result.data.result === "warning") {
        ToastsStore.warning(result.data.message);
      } else {
        if (result.data.message === "Token is Expired") {
          ToastsStore.error(result.data.message);
          this.signout();
        } else if (result.data.message === "Token is Invalid") {
          ToastsStore.error(result.data.message);
          this.signout();
        } else if (result.data.message === "Authorization Token not found") {
          ToastsStore.error(result.data.message);
          this.signout();
        } else {
          ToastsStore.error(result.data.message);
        }
      }
      this.setState({ loading: false });
    } catch (err) {
      this.setState({ loading: false });
      ToastsStore.error("Something Went wrong");
    };
  }

  handleUnassociate = async (id) => {
    console.log("Unassociate", id);
    let param ={
      request_id: localStorage.getItem('user_id'),
      response_id: id
    };

    try {
      this.setState({ loading: true });
      const result = await associateUnassociate(param);
      if (result.data.result === "success") {
        // this.getAssociationStatus(id);
      } else if (result.data.result === "warning") {
        ToastsStore.warning(result.data.message);
      } else {
        if (result.data.message === "Token is Expired") {
          ToastsStore.error(result.data.message);
          this.signout();
        } else if (result.data.message === "Token is Invalid") {
          ToastsStore.error(result.data.message);
          this.signout();
        } else if (result.data.message === "Authorization Token not found") {
          ToastsStore.error(result.data.message);
          this.signout();
        } else {
          ToastsStore.error(result.data.message);
        }
      }
      this.setState({ loading: false });
    } catch (err) {
      this.setState({ loading: false });
      ToastsStore.error("Something Went wrong");
    };
  }

  handleReassociate = async (id) => {
    console.log("Reassociate", id);
    let param ={
      request_id: localStorage.getItem('user_id'),
      response_id: id
    };

    try {
      this.setState({ loading: true });
      const result = await associateReassociate(param);
      if (result.data.result === "success") {
        // this.getAssociationStatus(id);
      } else if (result.data.result === "warning") {
        ToastsStore.warning(result.data.message);
      } else {
        if (result.data.message === "Token is Expired") {
          ToastsStore.error(result.data.message);
          this.signout();
        } else if (result.data.message === "Token is Invalid") {
          ToastsStore.error(result.data.message);
          this.signout();
        } else if (result.data.message === "Authorization Token not found") {
          ToastsStore.error(result.data.message);
          this.signout();
        } else {
          ToastsStore.error(result.data.message);
        }
      }
      this.setState({ loading: false });
    } catch (err) {
      this.setState({ loading: false });
      ToastsStore.error("Something Went wrong");
    };
  }

  handleWithdraw = async (id) => {
    console.log("Withdraw", id);
    let param ={
      request_id: localStorage.getItem('user_id'),
      response_id: id
    };

    try {
      this.setState({ loading: true });
      const result = await associateWithdraw(param);
      if (result.data.result === "success") {
        // this.getAssociationStatus(id);
      } else if (result.data.result === "warning") {
        ToastsStore.warning(result.data.message);
      } else {
        if (result.data.message === "Token is Expired") {
          ToastsStore.error(result.data.message);
          this.signout();
        } else if (result.data.message === "Token is Invalid") {
          ToastsStore.error(result.data.message);
          this.signout();
        } else if (result.data.message === "Authorization Token not found") {
          ToastsStore.error(result.data.message);
          this.signout();
        } else {
          ToastsStore.error(result.data.message);
        }
      }
      this.setState({ loading: false });
    } catch (err) {
      this.setState({ loading: false });
      ToastsStore.error("Something Went wrong");
    };
  }

  getMentors = async (pageNo) => {
    let param = {
      email: localStorage.getItem('email'),
      page: pageNo,
      rowsPerPage: 10
    }
    try {
      this.setState({ loading: true });
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
        for (var i = 0; i < result.data.data.length; i++) {
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
        ToastsStore.warning(result.data.message);
      } else {
        if (result.data.message === "Token is Expired") {
          ToastsStore.error(result.data.message);
          this.signout();
        } else if (result.data.message === "Token is Invalid") {
          ToastsStore.error(result.data.message);
          this.signout();
        } else if (result.data.message === "Authorization Token not found") {
          ToastsStore.error(result.data.message);
          this.signout();
        } else {
          ToastsStore.error(result.data.message);
        }
      }
      this.setState({ loading: false });
    } catch (err) {
      this.setState({ loading: false });
      ToastsStore.error("Something Went wrong");
    };
  }

  onChangePagination(e, value) {
    this.getMentors(value);
  }

  signout = async () => {
    const param = {
      email: localStorage.getItem('email')
    }

    try {
      const result = await signout(param);
      if (result.data.result === "success") {
        this.removeSession();
      } else if (result.data.result === "warning") {
        this.removeSession();
      } else {
        if (result.data.message === "Token is Expired") {
          this.removeSession();
        } else if (result.data.message === "Token is Invalid") {
          this.removeSession();
        } else if (result.data.message === "Authorization Token not found") {
          this.removeSession();
        } else {
          this.removeSession();
        }
      }
    } catch (error) {
      this.removeSession();
    }
  }

  removeSession() {
    localStorage.clear();
    this.props.history.push('/');
  }

  render() {
    const { loading, mentors, columns, totalCnt } = this.state;
    return (
      <>
        {loading && <LoadingModal open={true} />}
        <Container fluid className="main-content-container px-4 main-content-container-class tool-box-margin">
          <Row className="wallet-data-table-class py-4">
            <Col lg="12" md="12" sm="12">
              <AssociationTable data={mentorData} header={columns} />
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

