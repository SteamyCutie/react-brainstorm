import React from "react";
import { Container, Row, Col } from "shards-react";
import LoadingModal from "../components/common/LoadingModal";
import ReactNotification from 'react-notifications-component';
import 'react-notifications-component/dist/theme.css';
import { store } from 'react-notifications-component';
import WalletHeader from "../components/common/WalletHeader";
import SmallCard from "../components/common/SmallCard";
import CustomDataTable from "../components/common/CustomDataTable";
import { Badge } from "shards-react";
import { getwallets } from '../api/api';

export default class MentorWallet extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
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
    this.getWallets();
  }

  getWallets = async() => {
    try {
      this.setState({loading: true});
      const result = await getwallets({email: localStorage.getItem('email')});
      if (result.data.result === "success") {
        this.setState({tHistory: result.data.data});
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
          <Row noGutters className="page-header py-4">
            <WalletHeader title="Wallet" className="text-sm-left mb-3" flag={true}/>
          </Row>

          <Row>
            {this.state.smallCards.map((card, idx) => (
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
              <CustomDataTable title="Transaction history" data={this.state.tHistory} header={this.state.columns}/>
            </Col>
          </Row>
        </Container>
      </>
    )
  }
};

