import React from "react";
import { Container, Row, Col, Button, Card, CardBody, CardHeader, FormSelect } from "shards-react";
import SmallCardForum from "../components/common/SmallCardForum";
import CreateLiveForum from "../components/common/CreateLiveForum";
import { getforums } from "../api/api";

export default class ScheduleLiveForum extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      forumInfos: [],
      ModalOpen: false,
    };
  }

  componentWillMount() {
    this.getForums();  
  }

  toggle_createliveforum() {
    this.setState({
      ModalOpen: !this.state.ModalOpen
    });
  }

  toggle_modal() {
    this.setState({
      ModalOpen: !this.state.ModalOpen,
    });
  }

  getForums = async() => {
    try {
      const result = await getforums({email: localStorage.getItem('email')});
      if (result.data.result == "success") {
        this.setState({forumInfos: result.data.data});
      } else {
        alert(result.data.message);
      }
    } catch(err) {
      alert(err);
    };
  }

  render() {
    const { ModalOpen } = this.state;
    return (
      <div>
        <CreateLiveForum open={ModalOpen} toggle={() => this.toggle_createliveforum()} toggle_modal={() => this.toggle_modal()}></CreateLiveForum>
        <Container fluid className="main-content-container px-4 pb-4 main-content-container-class page-basic-margin">
          <Card small className="schedule-forum-card">
            <CardHeader className="live-forum-header">
              <h5 className="live-forum-header-title no-margin">Schedule live forum</h5>
              <Button className="live-forum-header-button" onClick={() => this.toggle_createliveforum()}>Create live forum</Button>
            </CardHeader>
            <CardBody>
              <Row>
                {this.state.forumInfos.map((item, idx) => 
                  <Col xl="4" lg="4" sm="6">
                    <SmallCardForum key={idx} item={item} />
                  </Col>
                )}
              </Row>
            </CardBody>
          </Card>    
        </Container>
      </div>
    )
  }
};