import React, { useState, useEffect } from 'react';
import { Button, Container, Row, Col, Accordion, Badge, Card, Table } from 'react-bootstrap';
import toast, { Toaster } from 'react-hot-toast';
import PropTypes from 'prop-types';
import API from '../API';

function ApplicationList(props) {

    const [dirty, setDirty] = useState(true);
    const [applications, setApplications] = useState([]);


    useEffect(() => {

        API.listApplication(props.user.id)
            .then((applications) => {
                applications.map((e) => { e.student_carreer = [{ id: 0, title: 'DataScience', grade: '28' }, { id: 1, title: 'Reti di Calcolatori', grade: '30' }] })
                setApplications(applications);
                setDirty(false);
            })
            .catch((err) => { toast.error(err.error); });

    }, [dirty]);
    const acceptPropByProf = (status, id_app) => {

        API.acceptApplication(status,id_app)
            .then((res) => {
                setDirty(true);
                if (res == 1) {
                    toast.success('Application successfully accepted')
                } else if (res == 2) {
                    toast.success('Application successfully rejected')
                }
            })
            .catch((err) => { toast.error(err.error); });
    };

    const handleGetCV = (cv, id) => {

        console.log({ path_cv: cv, student_id: id });

    }





    return (
        <div className="flex-column rounded" style={{ backgroundColor: '#fff' }} >
            <Toaster position="top-center" reverseOrder={false} />
            <div>
                {applications.map((application) => (
                    <Card key={application.id_application} style={{ marginBottom: '10px' }}>
                        <Accordion>
                            <Accordion.Item eventKey={application.id_application}>
                                <Accordion.Header>
                                    <Container fluid>
                                        <Row className="d-md-flex justify-content-center align-items-center">
                                            <Col md='4' sm='4' xs='12'>
                                                <strong>Title:</strong> {application.title}
                                            </Col>
                                            <Col md='4' sm='4' xs='12'>
                                                <strong>Student:</strong> {application.name + ' ' + application.surname}
                                            </Col>
                                            <Col md='3' sm='3' xs='12'>
                                                <strong>Status:</strong>{' '}
                                                {application.status == '0' ? (
                                                    <Badge pill bg="warning">P</Badge>
                                                ) : (
                                                    application.status == '1' ? (
                                                        <Badge pill bg="success">A</Badge>
                                                    ) : (
                                                        application.status == '2' ? (
                                                            <Badge pill bg="danger">R</Badge>
                                                        ) :
                                                            <Badge pill bg="secondary">C</Badge>
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
                                    <strong>Application Date:</strong> {application.data}
                                    <br />
                                    <strong>Student Carrer:</strong>
                                    <Table striped bordered hover style={{marginTop:'10px'}}>
                                    <thead>
                                        <tr>
                                            <th>Course</th>
                                            <th>Grade</th>
                                        </tr>
                                    </thead>
                                    <tbody>{application.student_carreer.map((e) => { return (<tr><td>{e.title}</td><td>{e.grade}</td></tr>) })}</tbody></Table>
                                    <strong>Student Cv: </strong> <br /><Button variant='danger' style={{ marginTop: '2px' }} onClick={() => handleGetCV(application.path_cv, application.id_student)}><img src="./file-earmark-pdf-fill.svg"
                                        alt="Logo"
                                        className="mr-2" style={{ marginBottom: '4px' }}></img></Button>
                                    <br />
                                    <br />
                                    <br />
                                    {application.status == '0' ? <Button onClick={() => acceptPropByProf(1, application.id_application)} variant='primary'>Accept</Button> : ''}
                                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                    {application.status == '0' ? <Button onClick={() => acceptPropByProf(2, application.id_application)} variant='danger'>Reject</Button> : ''}
                                </Accordion.Body>
                            </Accordion.Item>
                        </Accordion>
                    </Card>
                ))}
            </div>
        </div>);

}

ApplicationList.propTypes = {
    user: PropTypes.object.isRequired,
};

export default ApplicationList;