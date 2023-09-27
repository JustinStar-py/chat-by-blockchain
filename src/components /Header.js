import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Navbar, Nav, Container } from "react-bootstrap";

const Header = (props) => {
  return (
    <header>
     <Navbar bg="white" expand="lg" color="#fff">
      <Container>
        <Navbar.Brand href="#home">
          <img
            src="https://logodix.com/logo/1075535.png" // Replace with your cute logo image
            width="30"
            height="30"
            className="d-inline-block align-top"
            alt="Logo"
          />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav"/>
        <Navbar.Collapse id="basic-navbar-nav">
          { props.page === "home" ?
           <>
            <Nav className="ml-auto" id="home-navbar">
              <Nav.Link href="/">Home</Nav.Link>
              <Nav.Link href="/Github">Github</Nav.Link>
              <Nav.Link href="/">Support</Nav.Link>
              <Nav.Link href="/Chat">Open App</Nav.Link>
            </Nav>
          </>
        :  
          <>
          <Nav id="chat-navbar">
            <Nav.Link href="/">Home</Nav.Link>
          </Nav>
        </>
      }
        </Navbar.Collapse>
      </Container>
    </Navbar>
  </header>
  );
};


export default Header;