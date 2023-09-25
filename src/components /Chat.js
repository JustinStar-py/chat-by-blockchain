import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../components-css/Chat.css";
import { Container, Row, Col, ListGroup, Card } from "react-bootstrap";
import Header from "./Header";
import Web3 from "web3";
import contractAbi from "../json/messagerFactoryABI.json";
import { useAccount } from "wagmi";
import Skeleton from "@mui/material/Skeleton";
import SendIcon from '@mui/icons-material/Send';
import Avatar from '@mui/material/Avatar';
import Chip from '@mui/material/Chip';
import Icon from '@mui/material/Icon';


const contractAddress = "0x2051ebC07BDbf1f9bCF41576084f0B3c8B4c9F57";

function Chat() {
  const { address, connector, isConnected } = useAccount();
  const [web3, setWeb3] = useState(null);
  const [messages, setMessages] = useState([]);
  const [contract, setContract] = useState(null);
  const [addressList, setAddressList] = useState([]);
  const [addressListStatus, setAddressListStatus] = useState(false);
  const [currectContact, setCurrectContact] = useState(null)
  const [messagesList, setMessagesList] = useState([])
  const [sendMessage, setSendMessage] = useState(null)


  function changeCurrectContact(key) {
    setCurrectContact(addressList[key]);
  }

  function changeSendMessage(event) {
     setSendMessage(event.target.value)
  }

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
  
  useEffect(() => {
    async function fetchMessages() {
      if (contract && isConnected) {
        const sortMessagesList = [];
        messages.forEach((val) => {
          if (val._from === address && val._to === currectContact) {
            sortMessagesList.push({
              "type": "sent",
              "msg": val._message
            });
          } else if (val._from === currectContact && val._to === address) {
            sortMessagesList.push({
              "type": "received",
              "msg": val._message
            });
          }
          setMessagesList(sortMessagesList);
        });
      }
    }
    fetchMessages();
  }, [currectContact]);

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
                            <ListGroup.Item key={index} className="mb-1 bg-light" onClick={() => changeCurrectContact(index)}>
                                 {`User ${value.slice(0, 5)}...${value.slice(38, 42)}`}
                            </ListGroup.Item>
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
              <Card className="dark-card" style={{ height: 590 + "px" }}>
                <Card.Header>Chat Page</Card.Header>
                <Card.Body>
                <div class="chat-box">
                    {messagesList.length > 0 ? (
                        messagesList.map((val, index) => (
                          <div key={index} className={`${val.type === "received" ? "their" : "my"}-message`}>
                            {val.type === "sent" ? (
                              <>
                                <Chip className="ml-3" label={val.msg} color="info" sx={{   height: 'auto', minHeight:40+'px',   '& .MuiChip-label': {     display: 'block',     whiteSpace: 'normal',   }, }}/>
                              </>
                            ) : (
                              <>
                                <Chip className="ml-3" avatar={<Avatar className="p-3">{currectContact.slice(0,4)}</Avatar>} label={val.msg} color="secondary"  sx={{   height: 'auto', minHeight:40+'px',   '& .MuiChip-label': {     display: 'block',     whiteSpace: 'normal',   }, }}/>
                              </>
                            )}
                          </div>
                        ))
                      ) : (
                        <>
                          <Skeleton variant="rectangular" sx={{ bgcolor: '#3786acb3' }} height={160} className="m-1 rounded" />
                          <Skeleton variant="rectangular" sx={{ bgcolor: '#3786acb3' }} height={100} className="m-1 rounded" />
                          <Skeleton variant="rectangular" sx={{ bgcolor: '#3786acb3' }} height={40} className="m-1 rounded" />
                        </>
                      )}
                  </div>
                </Card.Body>
                <Card.Footer>
                  <div className="input-group">
                    <input
                      type="text"
                      className="form-control dark-bg"
                      placeholder="Type your message..."
                      onChange={changeSendMessage}
                    />
                    <div className="input-group-append">
                      <button className="btn btn-primary" type="button">
                        <SendIcon/>
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
