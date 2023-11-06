import { Form, Button, Alert, Container, Row, Col, Dropdown, DropdownButton } from 'react-bootstrap';
import { useState } from 'react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CustomNavbar from './CustomNavbar'
import API from '../API';




function Homepage(props) {


  return (
    props.user===0 ?<div style={{backgroundColor:'#fff'}}>
      <Container className="d-flex align-items-center justify-content-center" style={{ marginTop: '50px' }}>
        <div>
          <h1>Welcome Thesis Manager - (Student View)</h1>
        </div>
      </Container>
    </div>
      : <div style={{backgroundColor:'#fff'}}>
      <Container className="d-flex align-items-center justify-content-center" style={{ marginTop: '50px' }}>
        <div>
          <h1>Welcome Thesis Manager - (Professor View)</h1>
        </div>
      </Container>
    </div>

  )
}

export { Homepage };