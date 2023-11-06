import { Navbar, Container, Row, Col, Nav, Button, Tab } from 'react-bootstrap';
import BootstrapSwitchButton from 'bootstrap-switch-button-react';
import './TitleBar.css'

function TitleBar(props) {

    const titleBarStyle = {
        backgroundColor: '#003576',
    };

    const logoStyle = {
        marginLeft: 0, // Remove left margin
    };

    const handleSwitch = () => {
        if(props.user===0)
           props.setUser(1);
        else
         props.setUser(0);
    };

    return (
        <>
            <Navbar style={titleBarStyle}>
                <Container fluid>
                    <Navbar.Brand href="http://www.polito.it" style={logoStyle}>
                        <img
                            src="https://didattica.polito.it/img/logo_poli/logo_poli_bianco_260.png"
                            alt="Logo"
                            className="img-responsive"
                        />
                    </Navbar.Brand>
                </Container>
            </Navbar>
            <Container fluid className="nav-tabs">
                <Row>
                    <Col>
                        <Nav variant="tabs" defaultActiveKey="/">
                            <Nav.Item>
                                <Nav.Link href="/" className="thesis-link">
                                    Thesis
                                </Nav.Link>
                            </Nav.Item>
                        </Nav>
                    </Col>
                    <Col xs="auto" className="ml-auto d-flex align-items-center">
                        <BootstrapSwitchButton onChange={()=>handleSwitch()} checked={true} size="sm" onlabel='student' offlabel='professor' width={100} onstyle="success" offstyle="danger" style="border" />
                    </Col>
                </Row>
            </Container>
        </>
    );
}
export { TitleBar };