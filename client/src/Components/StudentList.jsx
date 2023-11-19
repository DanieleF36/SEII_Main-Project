import React, { useState, useEffect } from 'react';
import { Form, Button, Alert, Container, Row, Col, Dropdown, DropdownButton, Navbar, NavLink, Accordion, Badge, Card } from 'react-bootstrap';
import toast, { Toaster } from 'react-hot-toast';
import API from '../API';

function StudentList() {

    const [dirty, setDirty] = useState(true);
    const [id_student, setId_student] = useState(1);
    const [prof, setProf] = useState([{"id": 1, "name": "Luca", "surname": "Azzurro"}]);

    const [list, setList] = useState([]);

    //adding API from backend to set list of applications

    useEffect(() => {

        API.listApplication(id_student)
            .then((list) => {
                setList(list);
                setDirty(false);
            })
            .catch((err) => { toast.error(err.error); });

    }, [dirty]);

    function modifyApp(id_student,id_application){
        /*API.modifyApplication(id_student, id_application)
            .then((res) => {
                setDirty(true);
                if (res == 1) {
                    toast.success('Application successfully accepted')
                } else if (res == 2) {
                    toast.success('Application successfully rejected')
                }
            })
            .catch((err) => { toast.error(err.error); });*/

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
                                                <strong>Supervisor:</strong> {prof[0].name + ' ' + prof[0].surname}
                                            </Col>                                  
                                            <Col md='3' sm='3' xs='12'>
                                                <strong>Status:</strong>{' '}
                                                {application.status == '0' ? (
                                                    <Badge pill bg="warning">P</Badge>
                                                ) : (
                                                    application.status == '1' ? (
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
                                    <strong className="p-3 mb-2 text-danger">Thesis Info:</strong> 
                                    <br />
                                    <strong>Keywords:</strong> 
                                    <br />
                                    <strong>Type:</strong> 
                                    <br />
                                    <strong>Groups:</strong> 
                                    <br />
                                    <strong>Description:</strong> 
                                    <br />
                                    <strong>Knowledge:</strong> 
                                    <br />
                                    <strong>Note:</strong> 
                                    <br />
                                    <strong>Level:</strong> 
                                    <br />
                                    <strong>Expiration Date:</strong> {application.data}                                    
                                    <br />
                                    <strong>CdS:</strong> 
                                    <br />
                                    <br />
                                    <strong className="p-3 mb-2 text-danger">Application Info:</strong> 
                                    <br />
                                    <strong>Application Date:</strong> {application.data}
                                    <br />
                                    <strong>Path Cv: </strong>  <a>CV.pdf</a>
                                    <br />
                                    <br />
                                    <br />
                                    {application.status == '0' ? <Button onClick={() => modifyApp(id_student,application.id_application)} variant='warning'>Modify</Button> : ''}
                                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                    {application.status == '0' ? <Button onClick={() => modifyApp(id_student,application.id_application)} variant='danger'>Cancel</Button> : ''}
                                </Accordion.Body>
                            </Accordion.Item>
                        </Accordion>
                    </Card>
                ))}
            </div>
        </div>);

}

export default StudentList;