import React, { useState, useEffect } from 'react';
import { Form, Button, Alert, Container, Row, Col, Dropdown, DropdownButton, Navbar, Nav, Accordion, Badge, Card } from 'react-bootstrap';
import toast, { Toaster } from 'react-hot-toast';

function ApplicationList() {
    
    const [applications, setApplications] = useState([{id_application:0, 
                                                        id_thesis: '1',
                                                        title: 'AI system research',
                                                        id_student: 's12345',
                                                        name: 'Luca',
                                                        surname: 'Bianchi',
                                                        cds: 'A2891',
                                                        data: '12/10/2024',
                                                        path_cv: 'cv.pdf', 
                                                        status: '1'},
                                                    {id_application:1,
                                                        id_thesis: '1', 
                                                        title: 'AI system research',
                                                        id_student: 's25767',
                                                        name: 'Aldo',
                                                        surname: 'Moro',
                                                        cds: 'A2891',
                                                        data: '11/10/2024',
                                                        path_cv: 'cv.pdf', 
                                                        status: '2'},
                                                    {id_application:2, 
                                                        id_thesis: '2',
                                                        title: 'AI develop',
                                                        id_student: 's25734',
                                                        name: 'Aldo',
                                                        surname: 'Moro',
                                                        cds: 'A2891',
                                                        data: '11/10/2024',
                                                        path_cv: 'cv.pdf', 
                                                        status: '0'}]);
    
    //adding API from backend to set list of applications
    
    /*useEffect(() => {
      
      API.listApplication()
        .then((applications) => {
        setApplications(applications);
      })
      .catch(toast.error(res.error));
  
    }, []);*/

    //adding API from backend to post accept application
    /*const acceptPropByProf = (id) => {
        
        API.accRefApplication(id)
        .then(toast.success('Application successfully accepted'))
        .catch(toast.error(res.error));

    };*/

    const acceptPropByProf = (id) => {
        
        toast.success('Application ' + id + ' successfully accepted');

    };
    const rejectPropByProf = (id) => {
        
        toast.error('Application ' + id + ' rejected');

    };
    


        return (
            <div className="flex-column rounded" style={{ backgroundColor: '#fff' }} >
            <div>
            {applications.map((application) => (
                <Card key={application.id_application} style={{ marginBottom: '10px' }}>
                    <Toaster position="top-center" reverseOrder={false}/>
                    <Accordion>
                        <Accordion.Item eventKey={application.id_application}>
                            <Accordion.Header>
                                <Container fluid>
                                <Row className="d-md-flex justify-content-center align-items-center">
                                    <Col md='3' sm='3' xs='12'>
                                        <strong>Title:</strong> {application.title} {application.id_thesis}
                                    </Col>
                                    <Col md='3' sm='3' xs='12'>
                                        <strong>Student:</strong> {application.id_student}
                                    </Col>
                                    <Col md='5' sm='5' xs='12'>
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
                                    <Col md='1' sm='1' xs='12'>
                                        <img src="./info-circle.svg"
                                            alt="info"
                                            className="img-responsive" />

                                    </Col>
                                </Row>
                                </Container>
                            </Accordion.Header>
                            <Accordion.Body>
                                <strong>IdStudent:</strong> {application.id_student}
                                <br />
                                <strong>Name:</strong> {application.name}
                                <br />
                                <strong>Surname:</strong> {application.surname}
                                <br />
                                <strong>CdS:</strong> {application.cds}
                                <br />
                                <strong>Application Date:</strong> {application.data}
                                <br />
                                <strong>Link Cv: </strong> {application.path_cv}
                                <br />
                                <br />
                                <br />
                                {application.status === '0' ? <Button onClick={() => acceptPropByProf(application.id_application)} variant='primary'>Accept</Button> : ''}
                                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                {application.status === '0' ? <Button onClick={() => rejectPropByProf(application.id_application)} variant='danger'>Reject</Button> : ''}
                            </Accordion.Body>
                        </Accordion.Item>
                    </Accordion>
                </Card>
            ))}
        </div>
        </div>);

}

export default ApplicationList;