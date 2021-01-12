import React from "react";
import { Container, Row, Col } from "shards-react";
import Pagination from '@material-ui/lab/Pagination';
import AssociationTable from "../components/common/AssociationTable";
import LoadingModal from "../components/common/LoadingModal";
import { ToastsStore } from 'react-toasts';
import { 
  signout, 
  accociateAccept,
  associateDecline,
  associateUnassociate,
  associateReassociate,
  associateWithdraw,
  getAssociatedUsers 
} from '../api/api';

import EmptyAvatar from "../images/avatar.jpg"

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
              {(row.avatar === undefined || row.avatar === "" || row.avatar == null) 
                ? <img style={{ height: '36px' }} src={EmptyAvatar} className="subscription-mentor-avatar" alt="User avatar" />
                : <img style={{ height: '36px' }} src={row.avatar} className="subscription-mentor-avatar" alt="User avatar" />
              }
              <span>{row.name}</span>
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
                <div className="association-button" onClick={() => this.handleWithdraw(row.id)}>
                  Withdraw
                </div>
              }
              {row.status == 1 &&
                <div className="association-button" onClick={() => this.handleUnassociate(row.id)}>
                  Unassociate
                </div>
              }
              {row.status == 2 &&
                <div className="association-button" onClick={() => this.handleReassociate(row.id)}>
                  Reassociate
                </div>
              }
              {row.status == 3 &&
                <div className="association-button" onClick={() => this.handleReassociate(row.id)}>
                  Reassociate
                </div>
              }
              {row.status == 4 &&
                <>
                  <div className="association-button" onClick={() => this.handleAccept(row.id)}>
                    Accept
                  </div>
                  <div className="association-button" onClick={() => this.handleDecline(row.id)}>
                    Decline
                  </div>
                </>
              } 
            </div>
        }
      ]
    };
  }

  componentWillMount() {
    this.getMentors(1);
  }

  handleAccept = async (id) => {
    let param ={
      request_id: id,
      response_id: localStorage.getItem('user_id')
    };

    try {
      this.setState({ loading: true });
      const result = await accociateAccept(param);
      if (result.data.result === "success") {
        this.getMentors();
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
    let param ={
      request_id: id,
      response_id: localStorage.getItem('user_id')
    };

    try {
      this.setState({ loading: true });
      const result = await associateDecline(param);
      if (result.data.result === "success") {
        this.getMentors();
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
    let param ={
      request_id: localStorage.getItem('user_id'),
      response_id: id
    };

    try {
      this.setState({ loading: true });
      const result = await associateUnassociate(param);
      if (result.data.result === "success") {
        this.getMentors();
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
    let param ={
      request_id: localStorage.getItem('user_id'),
      response_id: id
    };

    try {
      this.setState({ loading: true });
      const result = await associateReassociate(param);
      if (result.data.result === "success") {
        this.getMentors();
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
    let param ={
      request_id: localStorage.getItem('user_id'),
      response_id: id
    };

    try {
      this.setState({ loading: true });
      const result = await associateWithdraw(param);
      if (result.data.result === "success") {
        this.getMentors();
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
      const result = await getAssociatedUsers(param);
      if (result.data.result === "success") {
        this.setState({
          loading: false,
          mentors: result.data.data.data,
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
              <AssociationTable data={mentors} header={columns} />
            </Col>
          </Row>
          {mentors.length > 0 && 
            <Row className="pagination-center">
              <Pagination count={totalCnt} onChange={(e, v) => this.onChangePagination(e, v)} color="primary" />
            </Row>
          }
        </Container>
      </>
    )
  }
};