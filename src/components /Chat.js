import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../components-css/Chat.css";
import { Container, Row, Col, ListGroup, Card } from "react-bootstrap";
import Header from "./Header";
import Web3 from "web3";
import contractAbi from "../json/messagerFactoryABI.json";
import { useAccount } from "wagmi";
import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";

const contractAddress = "0x2051ebC07BDbf1f9bCF41576084f0B3c8B4c9F57";

function Chat() {
  const { address, connector, isConnected } = useAccount();
  const [web3, setWeb3] = useState(null);
  const [messages, setMessages] = useState([]);
  const [contract, setContract] = useState(null);
  const [addressList, setAddressList] = useState([]);
  const [addressListStatus, setAddressListStatus] = useState(false);

  useEffect(() => {
    async function initWeb3() {
      if (window.ethereum) {
        const web3Instance = new Web3(window.ethereum);
        try {
          setWeb3(web3Instance);

          const contractInstance = new web3Instance.eth.Contract(
            contractAbi,
            contractAddress
          );
          setContract(contractInstance);
        } catch (error) {
          console.error(error);
        }
      } else {
        console.error("Web3 not detected. Please install a wallet like MetaMask.");
      }
    }

    initWeb3();
  }, []);

  useEffect(() => {
    async function fetchMessages() {
      if (contract && isConnected) {
        const result = await contract.methods.getMessagesForAddress(address).call();
        setMessages(result);
      }
    }
    fetchMessages();
  }, [isConnected, contract, address]);

  useEffect(() => {
    async function sortContactList() {
        const uniqueAddresses = new Set(); // Use a Set to ensure unique addresses
        messages.forEach((val) => {
          uniqueAddresses.add(val["_from"]);
          uniqueAddresses.add(val["_to"]);
        });
        setAddressList(Array.from(uniqueAddresses)); // Convert Set back to an array
        setAddressListStatus(true);
    }
    sortContactList();
  }, [messages]);

  return (
    <>
      <div className="Chat">
        <Header page="app" />
        <Container className="mt-5">
          <Row>
            <Col sm={4}>
              <Card className="dark-card">
                <Card.Header className="dark-bg">List of Names</Card.Header>
                <Card.Body id="contactList">      
                { addressListStatus ? (
                      addressList.length > 0 ? (
                        <ListGroup>
                          {addressList.map((value, index) => (
                            <ListGroup.Item
                              key={index}
                              className="mb-1 bg-light"
                            >{`User ${value.slice(0, 5)}...${value.slice(38, 42)}`}</ListGroup.Item>
                          ))}
                        </ListGroup>
                      ) : (
                        // If addressList is empty, show a button for creating a chat
                        <div>
                          <p>No chats available. Create a new chat:</p>
                          <button className="btn btn-primary">Create Chat</button>
                        </div>
                      )
                    ) : (
                      <>
                         <Skeleton sx={{ bgcolor: 'grey.900' }} variant="rectangular" animation="wave" height={60} className="m-1 rounded" />
                         <Skeleton sx={{ bgcolor: 'grey.900' }} variant="rectangular" animation="wave" height={60} className="m-1 rounded" />
                         <Skeleton sx={{ bgcolor: 'grey.900' }} variant="rectangular" animation="wave" height={20} className="m-1 rounded" />
                     </>
                    )
                  }
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
                  {/* Input field for typing messages */}
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
    </>
  );
}

export default Chat;
