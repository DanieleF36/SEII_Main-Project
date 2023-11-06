import { Form, Button, Alert, Container, Row, Col } from 'react-bootstrap';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CustomNavbar from './CustomNavbar'
import './Logout.css';

function Logout(props) {


  const navigate = useNavigate();

  return (
    <div className='background-image-container'>
      <CustomNavbar ticket={props.ticket} selservice={props.selservice} loggedIn={props.loggedIn} user={props.user}/>
      <Container>
        <Row style={{marginTop:'20px'}}>
          <Col xs={5}></Col>
          <Col className="d-flex align-items-center justify-content-center" xs={2}>
              <Button variant='danger' className='my-2' onClick={()=>{props.doLogOut(); navigate('/');}}>Logout</Button>
          </Col>
          <Col xs={5}></Col>
        </Row>
      </Container>
    </div>
  )
}

export { Logout };