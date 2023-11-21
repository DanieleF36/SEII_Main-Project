import { Navbar, Container, Row, Col, Nav, Button, Tab, Modal } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import BootstrapSwitchButton from 'bootstrap-switch-button-react';
import './TitleBar.css'

function TitleBar(props) {

    const navigate = useNavigate();

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

        props.setIsAuth(0);
        props.setUser(0);
        navigate('/login');

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
            <Container fluid className="nav-tabs">
                <Row>
                    <Col>
                        <Nav defaultActiveKey="/">
                            <Nav.Item className='act-link'>
                                <Nav.Link href="/" className="thesis-link">
                                    Thesis
                                </Nav.Link>
                            </Nav.Item>
                        </Nav>
                    </Col>
                    {props.isAuth === 0 ? <Col xs="auto" className="ml-auto d-flex align-items-center">
                        <Button onClick={() => navigate('/login')} style={{
                            backgroundColor: '#003674', // Colore normale
                            borderColor: '#003674', // Colore del bordo
                            transition: 'background-color 0.3s, color 0.3s', // Transizione per effetti hover

                        }} onMouseOver={(e) => {
                            e.target.style.backgroundColor = '#0054A6'; // Colore più chiaro durante l'hover
                            e.target.style.borderColor = '#0054A6'
                        }}
                            onMouseOut={(e) => {
                                e.target.style.backgroundColor = '#003674'; // Ripristina il colore originale al termine dell'hover
                            }}><img src="./person-circle.svg"
                                alt="Logo"
                                className="img-responsive"
                                style={{ marginRight: '2px' }}

                            /><strong>Login</strong></Button>


                    </Col> : <Col xs="auto" className="ml-auto d-flex align-items-center">
                        <Button onClick={() => handleShow()} style={{
                            backgroundColor: '#003674', // Colore normale
                            borderColor: '#003674', // Colore del bordo
                            transition: 'background-color 0.3s, color 0.3s', // Transizione per effetti hover

                        }} onMouseOver={(e) => {
                            e.target.style.backgroundColor = '#0054A6'; // Colore più chiaro durante l'hover
                            e.target.style.borderColor = '#0054A6'
                        }}
                            onMouseOut={(e) => {
                                e.target.style.backgroundColor = '#003674'; // Ripristina il colore originale al termine dell'hover
                            }}><img src="./person-circle.svg"
                                alt="Logo"
                                className="img-responsive"
                                style={{ marginRight: '2px' }}

                            />{props.user === 0 ? <><strong>role:</strong> student <strong>ID:</strong> 12345</> : <><strong>role:</strong> professor <strong>ID:</strong> 12345</>}</Button>

                        <Modal show={show} onHide={handleClose}>
                            <Modal.Header closeButton>
                                <Modal.Title>Logout</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>Click the button below to perform the logout</Modal.Body>
                            <Modal.Footer>
                                <Button variant="secondary" onClick={handleClose}>
                                    Close
                                </Button>
                                <Button variant="danger" onClick={()=>{handleClose();handleLogOut();}}>
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