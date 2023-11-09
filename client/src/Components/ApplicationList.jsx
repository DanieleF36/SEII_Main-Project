import React, { useState, useEffect } from 'react';
import { Form, Button, Alert, Container, Row, Col, Dropdown, DropdownButton, Navbar, Nav, Accordion, Badge, Card } from 'react-bootstrap';

function ApplicationList() {
    
    const [applications, setApplications] = useState([{id:0, 
                                                        title: 'AI system research',
                                                        idStud: 's12345',
                                                        name: 'Luca',
                                                        surname: 'Bianchi',
                                                        cds: 'A2891',
                                                        applicationDate: '12/10/2024',
                                                        linkCv: 'cv.pdf', 
                                                        status: '1'},
                                                    {id:1, 
                                                        title: 'AI system research',
                                                        idStud: 's25767',
                                                        name: 'Aldo',
                                                        surname: 'Moro',
                                                        cds: 'A2891',
                                                        applicationDate: '11/10/2024',
                                                        linkCv: 'cv.pdf', 
                                                        status: '2'},
                                                    {id:2, 
                                                        title: 'AI develop',
                                                        idStud: 's25734',
                                                        name: 'Aldo',
                                                        surname: 'Moro',
                                                        cds: 'A2891',
                                                        applicationDate: '11/10/2024',
                                                        linkCv: 'cv.pdf', 
                                                        status: '0'}]);
    
    

    const handlePropByProf = (e) => {
        //API apply proposal ( e is the selected proposal)
    };


        return (
            <div className="flex-column rounded" style={{ backgroundColor: '#fff' }} >
            <div>
            {applications.map((application) => (
                <Card key={application.id} style={{ marginBottom: '10px' }}>
                    <Accordion>
                        <Accordion.Item eventKey={application.id}>
                            <Accordion.Header>
                                <Container fluid>
                                <Row className="d-md-flex justify-content-center align-items-center">
                                    <Col xs='3'>
                                        <strong>Title:</strong> {application.title}
                                    </Col>
                                    <Col xs='3'>
                                        <strong>Student:</strong> {application.idStud}
                                    </Col>
                                    <Col xs='5'>
                                        <strong>Status:</strong>{' '}
                                        {application.status === '0' ? (
                                            <Badge pill bg="warning">P</Badge>
                                        ) : (
                                            application.status === '1' ? (
                                                <Badge pill bg="success">A</Badge>
                                            ) : (
                                                <Badge pill bg="danger">R</Badge>
                                            )
                                        )}
                                    </Col>
                                    <Col xs='1'>
                                        <img src="./info-circle.svg"
                                            alt="info"
                                            className="img-responsive" />

                                    </Col>
                                </Row>
                                </Container>
                            </Accordion.Header>
                            <Accordion.Body>
                                <strong>IdStudent:</strong> {application.idStud}
                                <br />
                                <strong>Name:</strong> {application.name}
                                <br />
                                <strong>Surname:</strong> {application.surname}
                                <br />
                                <strong>CdS:</strong> {application.cds}
                                <br />
                                <strong>Application Date:</strong> {application.applicationDate}
                                <br />
                                <strong>Link Cv: </strong> {application.linkCv}
                                <br />
                                <br />
                                <br />
                                {application.status === '0' ? <Button onClick={() => handlePropByProf(application.status)} variant='primary'>Accept</Button> : ''}
                                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                {application.status === '0' ? <Button onClick={() => handlePropByProf(application.status)} variant='danger'>Reject</Button> : ''}
                            </Accordion.Body>
                        </Accordion.Item>
                    </Accordion>
                </Card>
            ))}
        </div>
        </div>);

}

export default ApplicationList;