import React from "react";
import "bootstrap/dist/css/bootstrap.min.css"; // Import Bootstrap CSS
import "../components-css/Chat.css"
import { Container, Row, Col, ListGroup, Card } from "react-bootstrap";

const Chat = (props) => {
  return (
    <chat>
      <div className="Chat">
        <Container className="mt-5">
          <Row>
            <Col sm={4}>
              <Card className="dark-card">
                <Card.Header className="dark-bg">List of Names</Card.Header>
                <Card.Body>
                  <ListGroup>
                    <ListGroup.Item>User 1</ListGroup.Item>
                    <ListGroup.Item>User 2</ListGroup.Item>
                    {/* Add more names as needed */}
                  </ListGroup>
                </Card.Body>
              </Card>
            </Col>

            <Col sm={8}>
              <Card className="dark-card">
                <Card.Header className="dark-bg">Chat Page</Card.Header>
                <Card.Body>
                  <div className="chat-message">
                    <strong>User 1:</strong> <p>Hello there!</p>
                  </div>
                  <div className="chat-message me">
                    <p>Hi! How can I help you?</p><strong> : User 2</strong> 
                  </div>
                  {/* Add more chat messages as needed */}
                </Card.Body>
                <Card.Footer>
                  {/* Input field for typing messages can be placed here */}
                  <div className="input-group">
                    <input
                      type="text"
                      className="form-control dark-bg"
                      placeholder="Type your message..."
                    />
                    <div className="input-group-append">
                      <button className="btn btn-primary" type="button">
                        Send
                      </button>
                    </div>
                  </div>
                </Card.Footer>
              </Card>
            </Col>
          </Row>
        </Container>
     </div>
  </chat>
  );
};


export default Chat;