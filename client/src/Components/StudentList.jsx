import React, { useState, useEffect } from 'react';
import { Form, Button, Alert, Container, Row, Col, Dropdown, DropdownButton, Navbar, NavLink, Accordion, Badge, Card } from 'react-bootstrap';
import toast, { Toaster } from 'react-hot-toast';
import API from '../API';

function StudentList(props) {
    
    const [dirty, setDirty] = useState(true);
    //const [id_student, setId_student] = useState(1);
   
    const [list, setList] = useState([/*{id_application:1, 
                                        groups: 'Smart Cities',
                                        title: 'AI develop',
                                        type: 'Development',
                                        supervisor_name: 'Luca',
                                        supervisor_surname: 'Azzurro',
                                        description: "Designing adn implementing smart city solution",
                                        knowledge: "Iot, Urban Design",
                                        expiration_date: "2024-08-15",
                                        cds: 'CDS005',
                                        note: 'Addressing urban',
                                        level: 1,
                                        keywords: 'IoT, Urban Planning',
                                        application_data: '2023-11-16',
                                        path_cv: 'cv.pdf', 
    status: '3'}*/]);

    //adding API from backend to set list of applications of the student
    useEffect(() => {

        API.browserApplicationStudent(props.user.id)
            .then((list) => {
                setList(list);
                setDirty(false);
            })
            .catch((err) => { toast.error(err.error); });

    }, [dirty]);

    /* in futuro se uno studente può modificare la sua canditatura
    function modifyApp(id_student,id_application){
        API.modifyApplication(id_student, id_application)
            .then((res) => {
                setDirty(true);
                if (res == 1) {
                    toast.success('Application successfully accepted')
                } else if (res == 2) {
                    toast.success('Application successfully rejected')
                }
            })
            .catch((err) => { toast.error(err.error); });
    }*/

    const handleGetCV = (id) => {
     //API.getCV(id)

    }


    return (
        <div className="flex-column rounded" style={{ backgroundColor: '#fff' }} >
            <Toaster position="top-center" reverseOrder={false} />
            <div>
                {list.map((application) => (
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
                                                <strong>Supervisor:</strong> {application.supervisor_name + ' ' + application.supervisor_surname}
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
                                                    )
                                                }
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
                                    <strong className="mb-2 text-danger">Thesis Info:</strong> 
                                    <br />
                                    <strong>Keywords:</strong> {application.keywords}
                                    <br />
                                    <strong>Type:</strong> {application.type}
                                    <br />
                                    <strong>Groups:</strong> {application.groups}
                                    <br />
                                    <strong>Description:</strong> {application.description}
                                    <br />
                                    <strong>Knowledge:</strong> {application.knowledge}
                                    <br />
                                    <strong>Note:</strong> {application.note}
                                    <br />
                                    <strong>Level:</strong> {application.level}
                                    <br />
                                    <strong>Expiration Date:</strong> {application.expiration_date}                                    
                                    <br />
                                    <strong>CdS:</strong> {application.cds}
                                    <br />
                                    <br />
                                    <strong className="mb-2 text-danger">Application Info:</strong> 
                                    <br />
                                    <strong>Application Date:</strong> {application.application_data}
                                    <br />
                                    <strong>Student Cv: </strong><br /><Button variant='danger' style={{marginTop:'2px'}} onClick={()=>handleGetCV(application.id_application)}><img src="./file-earmark-pdf-fill.svg"
                                    alt="Logo"
                                    className="mr-2" style={{marginBottom:'4px'}}></img></Button>
                                    <br />
                                    <br />
                                    <br />
                                    
                                </Accordion.Body>
                            </Accordion.Item>
                        </Accordion>
                    </Card>
                ))}
            </div>
        </div>);

}

export default StudentList;

//
/*
{application.status == '0' ? <Button onClick={() => modifyApp(id_student,application.id_application)} variant='warning'>Modify</Button> : ''}
 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
{application.status == '0' ? <Button onClick={() => modifyApp(id_student,application.id_application)} variant='danger'>Cancel</Button> : ''}
*/