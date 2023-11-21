import { Form, Button, Alert, Container, Row, Col, Navbar, Card } from 'react-bootstrap';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import validator from 'validator';
import toast, { Toaster } from 'react-hot-toast';
import './TitleBar.css';
import './Homepage.css';
import './Login.css'
import API from '../API';

function Login(props) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const titleBarStyle = {
    backgroundColor: '#003576',
  };

  const logoStyle = {
    marginLeft: 0, // Remove left margin
  };

  const navigate = useNavigate();

  const doLogIn = (credentials) => {
    //API.logIn(credentials).then().catch();
    console.log(credentials);
    if(credentials.username === 's@polito.it'){
      
      props.setUser(0);
      props.setIsAuth(1);
      toast.dismiss();
      navigate('/');
    }
       
    else{
      props.setUser(1);
      props.setIsAuth(1);
      toast.dismiss();
      navigate('/');

    }
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    const credentials = { username, password };
    let valid = true;
    if (username === '' || password === '' || !validator.isEmail(username))
      valid = false;


    if (valid) {
      doLogIn(credentials);
    } else {
      if (username === '' || password === '')
        toast.error('Credential fields cannot be empty')
      else
        toast.error('Email is not in a valid format')
    }
  };

  return (
    <>
      <Navbar style={titleBarStyle}>
        <Container fluid>
          <Navbar.Brand href="http://www.polito.it" style={logoStyle}>
            <img
              src="./logo_poli_bianco_260.png"
              alt="Logo"
              className="img-responsive"
            />
          </Navbar.Brand>
        </Container>
      </Navbar>
      <Container fluid style={{backgroundColor:'#FF7C11'}}>
        <div
      style={{
        height: '45px', // Altezza desiderata
        width: '100%', // Larghezza del 100%
        backgroundColor: '#FF7C11', // Colore di sfondo (puoi cambiarlo)
        // Aggiungi altri stili desiderati
      }}
    >
    </div>
      </Container>
      <Toaster
                position="top-center"
                reverseOrder={false}
            />
      <Container fluid>
        <Row className="justify-content-center mt-4">
          <Col xs={12} sm={8} md={6} lg={3}>
            <img
              src="./logo_polito.jpg"
              alt="Logo"
              className="img-responsive"
            />
            <Card style={{ backgroundColor: '#FAFAFA', maxWidth: '350px', minHeight: '350px', marginBottom:'50px' }}>
              <Card.Body style={{marginTop: '60px'}}>
                <Form onSubmit={handleSubmit}>
                  <Form.Group controlId="username" className="myForm">
                    <Form.Control type="text" value={username} onChange={(ev) => setUsername(ev.target.value)} placeholder="Username"/>
                  </Form.Group>
                  <Form.Group controlId="password" className="myForm" style={{ marginBottom: '20px' }}>
                    <Form.Control type="password" value={password} onChange={(ev) => setPassword(ev.target.value)} placeholder="Password"/>
                  </Form.Group>
                  <Form.Group className="text-center">
                    <Button className="my-2" type="submit" style={{
                      backgroundColor: '#003674', // Colore normale
                      borderColor: '#003674', // Colore del bordo
                      transition: 'background-color 0.3s, color 0.3s', // Transizione per effetti hover
                      
                    }}onMouseOver={(e) => {
                      e.target.style.backgroundColor = '#0054A6'; // Colore più chiaro durante l'hover
                      e.target.style.borderColor = '#0054A6'
                    }}
                    onMouseOut={(e) => {
                      e.target.style.backgroundColor = '#003674'; // Ripristina il colore originale al termine dell'hover
                    }}>
                      Login con username e password
                    </Button>
                    <Button variant="danger" onClick={() => navigate('/')} style={{
                      backgroundColor: '#FF7C11', // Colore normale
                      borderColor: '#FF7C11', // Colore del bordo
                      transition: 'background-color 0.3s, color 0.3s', // Transizione per effetti hover
                      
                    }}onMouseOver={(e) => {
                      e.target.style.backgroundColor = '#FFA54E'; // Colore più chiaro durante l'hover
                      e.target.style.borderColor = '#FFA54E'
                    }}
                    onMouseOut={(e) => {
                      e.target.style.backgroundColor = '#FF7C11'; // Ripristina il colore originale al termine dell'hover
                    }}>
                      Cancel
                    </Button>
                  </Form.Group>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  )
}

export { Login };