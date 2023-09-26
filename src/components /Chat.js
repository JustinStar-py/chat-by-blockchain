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
import FaceIcon from '@mui/icons-material/Face';
import DoneAllIcon from '@mui/icons-material/DoneAll';

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
  const [isLoading, setIsLoading] = useState(false)
  const [txHash, setTxHash] = useState({
    "from":null,
    "to":null,
    "data":null,
    "gas":null
  })

  function Timestamp2Date(timestamp) {
    const date = new Date(timestamp * 1000);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
  
    const formattedTimestamp = `${month}/${day} ${hours}:${minutes}`;
    return formattedTimestamp;
}

  function changeCurrectContact(key) {
    setCurrectContact(addressList[key]);
  }

  function changeSendMessage(event) {
     setSendMessage(event.target.value)
  }

  async function sendMessageFunc() {
    if (!sendMessage || !currectContact) {
      return; // Don't send empty messages or without a valid contact
    }

    try {
      setIsLoading(true)
      const data = await contract.methods.sendMessage(currectContact, sendMessage).encodeABI()

      let transactionObject = {
        from: address,
        to: contractAddress,
        data: data,
        gas:""
      };

      const gasLimit = await web3.eth.estimateGas(transactionObject)  
      transactionObject["gas"] = parseInt(gasLimit);
     
     setTxHash(transactionObject)
    
    } catch (error) {
      console.error('Error sending message:', error);
    }
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
  }, [isConnected, contract, isLoading]);

  useEffect(() => {
    async function sortContactList() {
        const uniqueAddresses = new Set(); // Use a Set to ensure unique addresses
        messages.forEach((val) => {
          uniqueAddresses.add(val["_from"]);
          uniqueAddresses.add(val["_to"]);
        });
        uniqueAddresses.delete(address)
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
              "msg": val._message,
              "time": Timestamp2Date(parseInt(val._time)) 
            });
          } else if (val._from === currectContact && val._to === address) {
            sortMessagesList.push({
              "type": "received",
              "msg": val._message,
              "time": Timestamp2Date(parseInt(val._time))
            });
          }
          setMessagesList(sortMessagesList);
        });
      }
    }
    fetchMessages();
  }, [currectContact, messages]);

  useEffect(() => {
    async function sendTransactionFunc() {
        if (isLoading) {
          await web3.eth.sendTransaction(txHash) 
          .on("receipt", (receipt) => {
              setSendMessage(""); // Clear the input field
              setIsLoading(false)
          });
      } 
  }
    sendTransactionFunc()
  }, [txHash])

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
                            <Chip className="p-3 m-1 rounded" icon={<FaceIcon />} label={`User ${value.slice(0, 5)}...${value.slice(38, 42)}`} color="primary" onClick={() => changeCurrectContact(index)}/>
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
                          <div key={index} className={`message ${val.type === "received" ? "their" : "my"}-message`}>
                            {val.type === "sent" ? (
                              <>
                                <Chip className="ml-3" label={val.msg} color="info" sx={{   height: 'auto', minHeight:50+'px',   '& .MuiChip-label': {     display: 'block',     whiteSpace: 'normal',   }, }}/>
                                <p style={{fontSize:"9px", margin:"1px" ,marginRight:"6px"}}>{val.time}<DoneAllIcon style={{fontSize:"small", margin:"1px 0px 3px 2px"}}/></p>
                              </>
                            ) : (
                              <>
                                <Chip className="ml-3" avatar={<Avatar style={{padding:20+"px"}}>{currectContact.slice(0,4)}</Avatar>} label={val.msg} color="secondary"  sx={{   height: 'auto', minHeight:50+'px',   '& .MuiChip-label': {     display: 'block',     whiteSpace: 'normal',   }, }}/>
                                <p style={{fontSize:"9px", margin:"1px" ,marginLeft:"15px"}}><DoneAllIcon style={{fontSize:"small", margin:"1px 2px 3px 0px"}}/>{val.time}</p>
                              </>
                            )}
                          </div>
                        ))
                      ) : (
                        <>
                          <Skeleton variant="rectangular" sx={{ bgcolor: '#20d2ff36' }} height={160} className="m-1 rounded" />
                          <Skeleton variant="rectangular" sx={{ bgcolor: '#20d2ff36' }} height={100} className="m-1 rounded" />
                          <Skeleton variant="rectangular" sx={{ bgcolor: '#20d2ff36' }} height={40} className="m-1 rounded" />
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
                      value={sendMessage}
                      onChange={changeSendMessage}
                    />
                    <div className="input-group-append">
                      <button className="btn btn-primary" type="button" onClick={sendMessageFunc} disabled={isLoading}>
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
