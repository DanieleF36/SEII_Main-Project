import { Navbar, Container, Row, Col, Nav, Button, Tab, Modal } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useEffect } from 'react';
import BootstrapSwitchButton from 'bootstrap-switch-button-react';
import './TitleBar.css'
import API from '../API';
import { redirect } from "react-router-dom";

function TitleBar(props) {

    useEffect(() => {
        
    }, [props.isAuth]);

    const navigate = useNavigate();

    const logIn = () => {
        API.login();
      };

    const titleBarStyle = {
        backgroundColor: '#003576',
    };

    const logoStyle = {
        marginLeft: 0, // Remove left margin
    };

    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const handleLogOut = () => {
        API.logout().then(()=>{
            setTimeout(()=>{props.setIsAuth(0);
                props.setUser('');}, 5000);
        })
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
            <Container fluid className="nav-tabs"  style={props.isAuth === 0?{backgroundColor:'#fff'}:{backgroundColor:'#FF7C11'}}>
                <Row>
                    {props.isAuth===0 ?<Col>
                        <Nav>
                            <Nav.Item>
                                <Nav.Link disabled style={{color:'#ffff'}}>
                                   |
                                </Nav.Link>
                            </Nav.Item>
                        </Nav>
                    </Col>:<Col>
                        <Nav defaultActiveKey="/home">
                            <Nav.Item className='act-link'>
                                <Nav.Link active href="/home" className="thesis-link">
                                    Thesis
                                </Nav.Link>
                            </Nav.Item>
                        </Nav>
                    </Col>}
                    {props.isAuth === 0 ? <Col xs="auto" className="ml-auto d-flex align-items-center">
                        <Button className='btn-col' onClick={() => logIn()}><img src="./person-circle.svg"
                            alt="Logo"
                            className="img-responsive"
                            style={{ marginRight: '2px' }}

                        /><strong>Login</strong></Button>


                    </Col> : <Col xs="auto" className="ml-auto d-flex align-items-center">
                        <Button className='btn-col' onClick={() => handleShow()}><img src="./person-circle.svg"
                            alt="Logo"
                            className="img-responsive"
                            style={{ marginRight: '2px' }}

                        />{<><strong>role:</strong> {props.user.role} <strong>ID:</strong> {props.user.id}</>}</Button>

                        <Modal show={show} onHide={handleClose}>
                            <Modal.Header closeButton>
                                <Modal.Title><img src="./box-arrow-left.svg"
                                    alt="Logo"
                                    className="img-responsive"></img></Modal.Title>
                            </Modal.Header>
                            <Modal.Body>Click the button below to perform the <strong>logout</strong></Modal.Body>
                            <Modal.Footer>
                                <Button variant="secondary" onClick={handleClose}>
                                    Close
                                </Button>
                                <Button variant="danger" onClick={() => { handleClose(); handleLogOut(); }}>
                                    Logout
                                </Button>
                            </Modal.Footer>
                        </Modal>


                    </Col>
                    }
                </Row>
            </Container>
        </>
    );
}
export { TitleBar };