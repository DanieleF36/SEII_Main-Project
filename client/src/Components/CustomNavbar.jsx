import React from 'react';
import { Navbar, Nav} from 'react-bootstrap';
import './CustomNavbar.css';
import { useNavigate } from 'react-router-dom';

const CustomNavbar = (props) => {
  const navigate = useNavigate();
  return (
    <Navbar className="full-width-navbar custom-navbar">
      <Navbar.Brand className="custom-brand">
        <img
          src="/logo.svg"
          width="30"
          height="30"
          className="d-inline-block align-top"
          alt="Logo"
        />
        <span className="title">OQM</span>
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="navbar-nav" />
      <Nav.Link className='custom-link' onClick={()=>navigate('/')}>Home</Nav.Link>
      <Nav.Link className='custom-link' onClick={props.ticket?()=>navigate(`/${props.selservice}/ticket`):()=>navigate('/')}>Ticket</Nav.Link>
      <Nav.Link className='custom-link'>Display</Nav.Link> 
      <Navbar.Collapse id="navbar-nav" className="justify-content-end">
      <Nav>
          {props.loggedIn ? props.user.role === 'admin' ?
            <Nav.Link className="lock-icon" onClick={() => navigate('/logout')}>{
              <img
                src="/person-fill-gear.svg"
                width="28"
                height="28"
                className="d-inline-block align-top"
                alt="anonymous"
              />}
            </Nav.Link>
            :
            <Nav.Link className="lock-icon" onClick={() => navigate('/logout')}>{
              <img
                src="/person-fill-check.svg"
                width="28"
                height="28"
                className="d-inline-block align-top"
                alt="anonymous"
              />}
            </Nav.Link>
            :
            <Nav.Link className="lock-icon" onClick={() => navigate('/login')}>{
              <img
                src="/person-fill-x.svg"
                width="28"
                height="28"
                className="d-inline-block align-top"
                alt="anonymous"
              />}
            </Nav.Link>
          }
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default CustomNavbar;