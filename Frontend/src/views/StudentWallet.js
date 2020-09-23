import React from "react";
import { Container, Row, Col, Button } from "shards-react";
import Pagination from '@material-ui/lab/Pagination';

import SmallCardPayment from "../components/common/SmallCardPayment";
import CustomDataTable from "../components/common/CustomDataTable";
import AddNewCard from "../components/common/AddNewCard";
import LoadingModal from "../components/common/LoadingModal";
import ReactNotification from 'react-notifications-component';
import 'react-notifications-component/dist/theme.css';
import { store } from 'react-notifications-component';
import { getwallets } from '../api/api';
import { Badge } from "shards-react";

export default class StudentWallet extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      totalCnt: 0,
      ModalOpen: false,
      paymentCard: [
        {
          title: "Mastercard ending in 2715",
          image: require("../images/Mastercard-logo.png"),
          expireDate: "8/23",
          isPrimary: true
        },
        {
          title: "Visa ending in 9372",
          image: require("../images/VisaCard-logo.png"),
          expireDate: "02/21",
          isPrimary: false
        }
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
      ],
      tHistory: [
        {
          id: 1,
          lId: "3526AGTD364",
          lDate: "08/09/20",
          sName: "Leo Septimus",
          conferenceTime: 85,
          amount: 75,
          status: 0,
        },
        {
          id: 2,
          lId: "843EAGSR392",
          lDate: "08/08/20",
          sName: "Dulce Dorwart",
          conferenceTime: 122,
          amount: 114,
          status: 1,
        },
        {
          id: 3,
          lId: "0493RSYSR748",
          lDate: "08/07/20",
          sName: "Zain Rosser",
          conferenceTime: 64,
          amount: 71,
          status: 2,
        },
        {
          id: 4,
          lId: "843EAGSR392",
          lDate: "08/08/20",
          sName: "Tiana Westervelt",
          conferenceTime: 122,
          amount: 114,
          status: 1,
        },
        {
          id: 5,
          lId: "843EAGSR392",
          lDate: "08/08/20",
          sName: "Charlie Baptista",
          conferenceTime: 122,
          amount: 103,
          status: 1,
        },
        {
          id: 6,
          lId: "843EAGSR392",
          lDate: "08/08/20",
          sName: "Rayna Carder",
          conferenceTime: 41,
          amount: 31,
          status: 1,
        },
        {
          id: 7,
          lId: "843EAGSR392",
          lDate: "08/08/20",
          sName: "Rayna Carder",
          conferenceTime: 41,
          amount: 31,
          status: 1,
        },
        {
          id: 8,
          lId: "843EAGSR392",
          lDate: "08/08/20",
          sName: "Rayna Carder",
          conferenceTime: 41,
          amount: 31,
          status: 1,
        },
        {
          id: 9,
          lId: "843EAGSR392",
          lDate: "08/08/20",
          sName: "Rayna Carder",
          conferenceTime: 41,
          amount: 31,
          status: 1,
        },
        {
          id: 10,
          lId: "843EAGSR392",
          lDate: "08/08/20",
          sName: "Rayna Carder",
          conferenceTime: 41,
          amount: 31,
          status: 1,
        },
        {
          id: 11,
          lId: "843EAGSR392",
          lDate: "08/08/20",
          sName: "Rayna Carder",
          conferenceTime: 41,
          amount: 31,
          status: 1,
        },
        {
          id: 12,
          lId: "843EAGSR392",
          lDate: "08/08/20",
          sName: "Rayna Carder",
          conferenceTime: 41,
          amount: 31,
          status: 1,
        }
      ]
    }
  }

  componentWillMount() {
    this.getHistory(1);
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

  addNewCard() {

  }

  onChangePagination(e, value) {
    this.getHistory(value);
  }

  removeSession() {
    localStorage.clear();
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

  render() {
    const {paymentCard, tHistory, columns, ModalOpen, loading, totalCnt} = this.state;
    return (
      <>
        {loading && <LoadingModal open={true} />}
        <ReactNotification />
        <AddNewCard 
          open={ModalOpen} 
          toggle={() => this.toggle_add()} 
          toggle_success={(text) => this.showSuccess(text)}>
          toggle_fail={(text) => this.showFail(text)}
          toggle_warning={(text) => this.showWarning(text)}
        </AddNewCard>
        <Container fluid className="main-content-container px-4 main-content-container-class">
          <Row noGutters className="page-header py-4">
            <Col className="page-title">
              <h3>Wallet</h3>
            </Col>
            <Button className="btn-add-payment" onClick={() => this.toggle_add()}>Add new card</Button>
          </Row>

          <Row>
            <div className="card-container">
            {paymentCard.map((card, idx) => (
                <SmallCardPayment
                  key={idx}
                  title={card.title}
                  expireDate={card.expireDate}
                  image={card.image}
                  isPrimary={card.isPrimary}
                />
            ))}
            </div>
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
}