import { Form, Button, Alert, Container, Row, Col, Dropdown, DropdownButton, Navbar, Nav } from 'react-bootstrap';
import { useState } from 'react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { TitleBar } from './TitleBar';
import './Homepage.css';
import API from '../API';




function Homepage(props) {

    const [add, setAdd] = useState(false);
    const [listA, setListA] = useState(false);



    return (
        props.user === 0 ? <div id="background-div" style={{ backgroundColor: '#FAFAFA' }}>
            <TitleBar user={props.user} setUser={props.setUser} />
            <Container fluid style={{ marginTop: '20px' }}>
                <Row>
                    <Col xs={3}>

                        <Navbar style={{ backgroundColor: '#fff' }} className="flex-column rounded">
                            <Nav className="flex-column">
                                <Nav.Link active={true}> Proposals List</Nav.Link>
                            </Nav>
                        </Navbar>

                    </Col>
                    <Col xs={9}>
                        <div className="flex-column rounded" style={{ backgroundColor: '#fff' }} >
                            <h2>(Proposal List)</h2>
                        </div>

                    </Col>


                </Row>

            </Container>
        </div> : add === true ? <div id="background-div" style={{ backgroundColor: '#FAFAFA' }}>
            <TitleBar user={props.user} setUser={props.setUser} />
            <Container fluid style={{ marginTop: '20px' }}>
                <Row>
                    <Col xs={3}>

                        <Navbar style={{ backgroundColor: '#fff' }} className="flex-column rounded">
                            <Nav className="flex-column">
                                <Nav.Link active={add} onClick={() => { setAdd(true); setListA(false); }}> Add Proposal</Nav.Link>
                                <Nav.Link active={listA} onClick={() => { setAdd(false); setListA(true); }}>Applications List</Nav.Link>
                            </Nav>
                        </Navbar>

                    </Col>
                    <Col xs={9}>
                        <div className="flex-column rounded" style={{ backgroundColor: '#fff' }} >
                            <h2>(Add Proposal Form)</h2>
                        </div>

                    </Col>


                </Row>

            </Container>
        </div> : <div id="background-div" style={{ backgroundColor: '#FAFAFA' }}>
            <TitleBar user={props.user} setUser={props.setUser} />
            <Container fluid style={{ marginTop: '20px' }}>
                <Row>
                    <Col xs={3}>

                        <Navbar style={{ backgroundColor: '#fff' }} className="flex-column rounded">
                            <Nav className="flex-column">
                                <Nav.Link active={add} onClick={() => { setAdd(true); setListA(false); }}> Add Proposal</Nav.Link>
                                <Nav.Link active={listA} onClick={() => { setAdd(false); setListA(true); }}>Applications List</Nav.Link>
                            </Nav>
                        </Navbar>

                    </Col>
                    <Col xs={9}>
                        <div className="flex-column rounded" style={{ backgroundColor: '#fff' }} >
                            <h2>(Applications List)</h2>
                        </div>

                    </Col>


                </Row>

            </Container>
        </div>


    )
}

export { Homepage };