import React from "react";
import { Container, Row, Col, Button } from "shards-react";
import Pagination from '@material-ui/lab/Pagination';

import SmallCardPayment from "../components/common/SmallCardPayment";
import CustomDataTable from "../components/common/CustomDataTable";
import AddNewCard from "../components/common/AddNewCard";
import LoadingModal from "../components/common/LoadingModal";
import { ToastsStore } from 'react-toasts';
import { getusercards, payforsession, signout, setprimarycard, gettransactionhistorybystudent, deletestudentcard } from '../api/api';
import { Badge } from "shards-react";

export default class StudentWallet extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      totalCnt: 0,
      ModalOpen: false,
      paymentCard: [],
      columns: [
        {
          name: 'Lesson ID',
          selector: 'lId',
          sortable: false,
          style: {
            fontSize: "16px",
          },
        },
        {
          name: 'Date',
          selector: 'lDate',
          sortable: false,
          style: {
            fontSize: "16px",
          },
        },
        {
          name: 'Mentor name',
          selector: 'sName',
          sortable: true,
          style: {
            fontSize: "16px",
          },
        },
        {
          name: 'Conference time',
          selector: 'conferenceTime',
          sortable: false,
          style: {
            fontSize: "16px",
          },
          format: row => `${Math.floor(row.conferenceTime / 60) > 9 ? Math.floor(row.conferenceTime / 60) : Math.floor(row.conferenceTime / 60) === 0 ? 0 : "0" + Math.floor(row.conferenceTime / 60)}h ${(row.conferenceTime % 60) > 9 ? (row.conferenceTime % 60) : (row.conferenceTime % 60) === 0 ? 0 : "0" + (row.conferenceTime % 60)}min`,
        },
        {
          name: 'Amount',
          selector: 'amount',
          sortable: false,
          style: {
            fontSize: "16px",
          },
          format: row => `$${row.amount}`,
        },
        {
          name: 'Status',
          selector: 'status',
          sortable: false,
          right: false,
          cell: row => <Badge className={row.status === 0 ? "badge-pending-class" : row.status === 1 ? "badge-confirmed-class" : "badge-failed-class"}>{row.status === 0 ? "Pending" : row.status === 1 ? "Confirmed" : "Failed"}</Badge>,
        }
      ],
      tHistory: []
    }
  }

  componentWillMount() {
    this.getHistory(1);
    this.getUserCards();
  }

  toggle_add() {
    this.setState({
      ModalOpen: !this.state.ModalOpen
    });
  }

  getHistory = async (pageNo) => {
    let param = {
      user_id: localStorage.getItem('user_id'),
      page: pageNo,
      rowsPerPage: 10
    }
    try {
      this.setState({ loading: true });
      const result = await gettransactionhistorybystudent(param);
      if (result.data.result === "success") {
        this.setState({
          loading: false,
          tHistory: result.data.data,
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

  getUserCards = async () => {
    let param = {
      user_id: localStorage.getItem('user_id')
    }
    try {
      this.setState({ loading: true });
      const result = await getusercards(param);
      if (result.data.result === "success") {
        let param = {
          card_type: 1,
          is_primary: 1,
          card_name: '',
          expired_date: '',
          image: '',
          id: ''
        }

        let params = [];
        for (var i = 0; i < result.data.data.length; i++) {
          param.card_type = result.data.data[i].card_type;
          param.card_name = result.data.data[i].card_name;
          param.is_primary = result.data.data[i].is_primary;
          param.expired_date = result.data.data[i].expired_date;
          param.id = result.data.data[i].id;
          if (param.card_type === 4) {
            param.image = require("../images/VisaCard-logo.png");
          } else if (param.card_type === 5) {
            param.image = require("../images/Mastercard-logo.png");
          } else if (param.card_type === 3) {
            param.image = require("../images/Travelcard-logo.jpg");
          } else if (param.card_type === 6) {
            param.image = require("../images/Discovercard-logo.jpg");
          }
          params.push(param);
          param = {};
        }
        this.setState({
          loading: false,
          paymentCard: params
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

  setAsDefault = async (id) => {
    let param = {
      user_id: localStorage.getItem("user_id"),
      payment_id: id
    }

    try {
      this.setState({ loading: true });
      const result = await setprimarycard(param);
      if (result.data.result === "success") {
        this.getUserCards();
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

  deleteStudentCard = async (id) => {
    let param = {
      user_id: localStorage.getItem("user_id"),
      payment_id: id
    }

    try {
      this.setState({ loading: true });
      const result = await deletestudentcard(param);
      if (result.data.result === "success") {
        this.getUserCards();
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
    this.getHistory(value);
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
    //this.props.history.push('/');
  }
  
  showSuccess(text) {
    this.setState({
      ModalOpen: !this.state.ModalOpen
    });
    ToastsStore.success(text);
  }

  showFail(text) {
    ToastsStore.error(text);
  }

  showWarning(text) {
    ToastsStore.warning(text);
  }

  render() {
    const { paymentCard, tHistory, columns, ModalOpen, loading, totalCnt } = this.state;
    return (
      <>
        {loading && <LoadingModal open={true} />}
        <AddNewCard
          open={ModalOpen}
          toggle={() => this.toggle_add()}
          toggle_success={(text) => this.showSuccess(text)}
          toggle_fail={(text) => this.showFail(text)}
          toggle_warning={(text) => this.showWarning(text)}>
        </AddNewCard>
        <Container fluid className="main-content-container px-4 main-content-container-class">
          <Row noGutters className="page-header py-4">
            <Col className="page-title">
              <h3>Wallet</h3>
            </Col>
            <Button className="btn-add-payment" onClick={() => this.toggle_add()}>Add new card</Button>            
          </Row>
          <Row>
            {/* <div className="card-container"> */}
              {paymentCard.map((card, idx) => (
                <Col md="4" sm="12" lg="4" xl="3">
                <SmallCardPayment
                  key={idx}
                  title={card.card_name}
                  expireDate={card.expired_date}
                  type={card.card_type}
                  isPrimary={card.is_primary}
                  id={card.id}
                  setAsDefault={(id) => this.setAsDefault(id)}
                  deleteStudentCard={(id) => this.deleteStudentCard(id)}
                />
                </Col>
              ))}
            {/* </div> */}
          </Row>
          <Row className="wallet-data-table-class">
            <Col lg="12" md="12" sm="12">
              <CustomDataTable title="Transaction history" data={tHistory} header={columns} />
            </Col>
          </Row>
          {tHistory.length > 0 && <Row className="pagination-center">
            <Pagination count={totalCnt} onChange={(e, v) => this.onChangePagination(e, v)} color="primary" />
          </Row>}
        </Container>
      </>
    )
  }
}