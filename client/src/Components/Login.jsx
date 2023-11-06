import { Form, Button, Alert, Container, Row, Col } from 'react-bootstrap';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import validator from 'validator';
import CustomNavbar from './CustomNavbar'
import './Login.css';
import API from '../API';

function Login(props) {
  const [username, setUsername] = useState('administrator@email.com');
  const [password, setPassword] = useState('Polito23');
  const [errorMessage, setErrorMessage] = useState('');

  const navigate = useNavigate();

  const doLogIn = (credentials) => {
    API.logIn(credentials)
      .then(user => {
        setErrorMessage('');
        props.loginSuccessful(user);
        navigate(`/`);
      })
      .catch(err => {
        console.log(user);
        setErrorMessage('Wrong username or password');
      })
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    setErrorMessage('');
    const credentials = { username, password };
    let valid = true;
    if (username === '' || password === '' || !validator.isEmail(username))
      valid = false;


    if (valid) {
      doLogIn(credentials);
    } else {
      if (username === '' || password === '')
        setErrorMessage('Email/Password must be filled');
      else
        setErrorMessage('Email must be in a valid format');
    }
  };

  return (
    <div className='background-image-container'>
      <CustomNavbar ticket={props.ticket} selservice={props.selservice} loggedIn={props.loggedIn} user={props.user}/>
      <Container>
        <Row>
          <Col xs={3}></Col>
          <Col xs={6}>
            <h2 style={{ color: 'black' , marginTop: '20px'}}>Login</h2>
            <Form onSubmit={handleSubmit}>
              {errorMessage ? <Alert variant='danger' dismissible onClick={() => setErrorMessage('')}>{errorMessage}</Alert> : ''}
              <Form.Group controlId='username'>
                <Form.Label>Email</Form.Label>
                <Form.Control type='text' value={username} onChange={ev => setUsername(ev.target.value)} />
              </Form.Group>
              <Form.Group controlId='password'>
                <Form.Label>Password</Form.Label>
                <Form.Control type='password' value={password} onChange={ev => setPassword(ev.target.value)} />
              </Form.Group>
              <Button className='my-2' type='submit'>Login</Button>
              <Button className='my-2 mx-2' variant='danger' onClick={() => navigate('/')}>Cancel</Button>
            </Form>
          </Col>
          <Col xs={3}></Col>
        </Row>
      </Container>
    </div>
  )
}

export { Login };