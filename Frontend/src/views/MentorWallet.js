import React from "react";
import { Container, Row, Col, Button } from "shards-react";
import Pagination from '@material-ui/lab/Pagination';
import LoadingModal from "../components/common/LoadingModal";
import ReactNotification from 'react-notifications-component';
import 'react-notifications-component/dist/theme.css';
import { store } from 'react-notifications-component';
import WalletHeader from "../components/common/WalletHeader";
import SmallCard from "../components/common/SmallCard";
import AddNewBank from "../components/common/AddNewBank";
import CustomDataTable from "../components/common/CustomDataTable";
import { Badge } from "shards-react";
import { getwallets, signout } from '../api/api';

export default class MentorWallet extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      ModalOpen: false,
      loading: false,
      totalCnt: 0,
      smallCards: [
        {
          value: "$0",
          label: "Available Balance",
        },
        {
          value: "$0",
          label: "Pending Balance",
        },
        {
          value: "$0",
          label: "Life time Earnings",
        }
      ],
      tHistory: [
      ],
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
          name: 'Student name',
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
      ]
    };
  }

  componentWillMount() {
    this.getHistory(1);
  }

  componentDidMount() {
  }

  toggle_add() {
    this.setState({
      ModalOpen: !this.state.ModalOpen
    });
  }

  getHistory = async(pageNo) => {
    let param = {
      email: localStorage.getItem('email'),
      page: pageNo,
      rowsPerPage: 10
    }
    try {
      this.setState({loading: true});
      const result = await getwallets(param);
      if (result.data.result === "success") {
        this.setState({
          loading: false,
          tHistory: result.data.data,
          totalCnt: result.data.totalRows % 10 === 0 ? result.data.totalRows / 10 : parseInt(result.data.totalRows / 10) + 1
        });
      } else if (result.data.result === "warning") {
        this.showWarning(result.data.message);
      } else {
        if (result.data.message === "Token is Expired") {
          this.showFail(result.data.message);
          this.signout();
        } else if (result.data.message === "Token is Invalid") {
          this.showFail(result.data.message);
          this.signout();
        } else if (result.data.message === "Authorization Token not found") {
          this.showFail(result.data.message);
          this.signout();
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

  signout = async() => {
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
    } catch(error) {
      this.removeSession();
    }
  }

  removeSession() {
    localStorage.clear();
    window.location.href = "/";
  }

  render() {
    const {loading, tHistory, columns, smallCards, totalCnt, ModalOpen} = this.state;
    return (
      <>
        {loading && <LoadingModal open={true} />}
        <ReactNotification />
        <AddNewBank 
          open={ModalOpen} 
          toggle={() => this.toggle_add()} 
          toggle_success={(text) => this.showSuccess(text)}
          toggle_fail={(text) => this.showFail(text)}
          toggle_warning={(text) => this.showWarning(text)}>
        </AddNewBank>
        <Container fluid className="main-content-container px-4 main-content-container-class">
          <Row noGutters className="page-header py-4">
            {/* <WalletHeader title="Wallet" className="text-sm-left mb-3" flag={true} click_add={() => this.toggle_add()}/> */}
            {/* <WalletHeader title="Wallet" className="text-sm-left mb-3" flag={true}/> */}
            <Button className="btn-add-payment-mentor" onClick={() => this.toggle_add()}>Add payment method</Button>
          </Row>

          <Row>
            {smallCards.map((card, idx) => (
              <Col className="col-lg mb-4" key={idx} lg="3" md="4" sm="4">
                <SmallCard
                  id={idx}
                  label={card.label}
                  value={card.value}
                />
              </Col>
            ))}
          </Row>

          <Row className="wallet-data-table-class">
            <Col lg="12" md="12" sm="12">
              <CustomDataTable title="Transaction history" data={tHistory} header={columns}/>
            </Col>
          </Row>
          {tHistory.length > 0 && <Row className="pagination-center">
            <Pagination count={totalCnt} onChange={(e, v) => this.onChangePagination(e, v)} color="primary" />
          </Row>}
        </Container>
      </>
    )
  }
};

