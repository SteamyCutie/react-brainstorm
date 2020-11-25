import React from "react";
import { Container, Row, Col, Button } from "shards-react";
import Pagination from '@material-ui/lab/Pagination';
import LoadingModal from "../components/common/LoadingModal";
import { ToastsStore } from 'react-toasts';
import SmallCard from "../components/common/SmallCard";
import SmallBankPayment from "../components/common/SmallBankPayment";
import CustomDataTable from "../components/common/CustomDataTable";
import { Badge } from "shards-react";
import { signout, getuseridformentor, gettransactionhistorybymentor } from '../api/api';
import { REACT_APP_STRIPE_CLIENT_ID, REACT_APP_STRIPE_EXPRESS, REACT_APP_STRIPE_SCOPE } from '../common/config'

export default class MentorWallet extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // ModalOpen: false,
      loading: false,
      bank_status: false,
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

  toggle_add = async () => {
    let param = {
      user_id: localStorage.getItem('user_id')
    }

    try {
      const result = await getuseridformentor(param);
      if (result.data.result === "success") {
        window.open(REACT_APP_STRIPE_EXPRESS + REACT_APP_STRIPE_CLIENT_ID + REACT_APP_STRIPE_SCOPE,'_blank');
      } else if (result.data.result === "warning") {
      } else { }
    } catch (err) {
    };
  }

  getHistory = async (pageNo) => {
    let param = {
      user_id: localStorage.getItem('user_id'),
      page: pageNo,
      rowsPerPage: 10
    }
    try {
      this.setState({ loading: true });
      const result = await gettransactionhistorybymentor(param);
      if (result.data.result === "success") {        
        this.setState({
          loading: false,
          bank_status: result.data.bank_status === null || result.data.bank_status === ""? false: true,
          smallCards: result.data.balance,
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
    const { loading, tHistory, columns, smallCards, totalCnt, bank_status } = this.state;
    return (
      <div style={{marginTop: "40px"}}>
        {loading && <LoadingModal open={true} />}
        {/* <AddNewBank 
          open={ModalOpen} 
          toggle={() => this.toggle_add()} 
          toggle_success={(text) => this.showSuccess(text)}
          toggle_fail={(text) => ToastsStore.error(text)}
          toggle_warning={(text) => ToastsStore.warning(text)}>
        </AddNewBank> */}
        <Container fluid className="main-content-container px-4 main-content-container-class">
          <Row noGutters className="page-header py-4">
            {/* <WalletHeader title="Wallet" className="text-sm-left mb-3" flag={true} click_add={() => this.toggle_add()}/> */}
            {/* <WalletHeader title="Wallet" className="text-sm-left mb-3" flag={true}/> */}
            <Button className="btn-add-payment-mentor" onClick={() => this.toggle_add()}>Add payment method</Button>
          </Row>
          {bank_status && <SmallBankPayment />}
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
              <CustomDataTable title="Transaction history" data={tHistory} header={columns} />
            </Col>
          </Row>
          {tHistory.length > 0 && <Row className="pagination-center">
            <Pagination count={totalCnt} onChange={(e, v) => this.onChangePagination(e, v)} color="primary" />
          </Row>}
        </Container>
      </div>
    )
  }
};

