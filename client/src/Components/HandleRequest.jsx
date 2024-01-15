import React, { useState, useEffect } from 'react';
import { Button , Container, Row, Col, Accordion, Badge, Card } from 'react-bootstrap';
import toast, { Toaster } from 'react-hot-toast';
import PropTypes from 'prop-types';
import API from '../API';

function HandleRequest(props) {
    
    const [dirty, setDirty] = useState(true);
   
    const [list, setList] = useState([/*{"id":1,"id_stud":1,"student_name":"Gianni", "student_surname": "Altobelli","id_prof":1,"prof_name":"Luca", "prof_surname": "Azzurro", "cosupervisor":['marco.collo@mail.com', 'marco.colli@mail.com'], 'description': 'Description sample...', 'status':0}*/]);
    
    useEffect(() => {
        if(props.user.role == "secretary"){
        API.getRequestAll(props.user.role)
            .then((list) => {
                setList(list);
                console.log(list)
                setDirty(false);
            })
            .catch((err)=>{toast.error(err.message)})
        }
    }, [dirty]);

const handleRequestResponse = (student_id, status, request_id, teacher_id) => {
        
        //setList([{"id":1,"id_stud":1,"student_name":"Gianni", "student_surname": "Altobelli","id_prof":1,"prof_name":"Luca", "prof_surname": "Azzurro", "cosupervisor":['marco.collo@mail.com', 'marco.colli@mail.com'], 'description': 'Description sample...', 'status':status}])
        
        API.thesisRequestHandling(student_id, status, request_id, teacher_id)
            .then((res) => {
                setDirty(true);
                if (res == 1) {
                    toast.success('Request successfully accepted')
                } else if (res == 2) {
                    toast.success('Request successfully rejected')
                }
            })
            .catch((err) => { toast.error(err.message); });
    
};

    return (
        <div className="flex-column rounded" style={{ backgroundColor: '#fff' }} >
            <Toaster position="top-center" reverseOrder={false} />
            <div>
                {list.map((request) => (
                    <Card key={request.id} style={{ marginBottom: '10px' }}>
                        <Accordion>
                            <Accordion.Item eventKey={request.id}>
                                <Accordion.Header>
                                    <Container fluid>
                                        <Row className="d-md-flex justify-content-center align-items-center">
                                            <Col md='4' sm='4' xs='12'>
                                                <strong>Student:</strong> {request.studentName +" "+ request.studentSurname}
                                            </Col>                                  
                                            <Col md='4' sm='4' xs='12'>
                                                <strong>Supervisor:</strong> {request.name +" "+ request.surname}
                                            </Col>
                                            <Col md='3' sm='3' xs='12'>
                                                <strong>Status:</strong>{' '}
                                                {request.statusS == '0' ? (
                                                    <Badge pill bg="warning">PEN</Badge>
                                                ) : (
                                                    request.statusS == '1' ? (
                                                        <Badge pill bg="success">ACC</Badge>
                                                    ) :
                                                         (
                                                            <Badge pill bg="danger">REJ</Badge>
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
                                <strong className="mb-2 text-danger">Request Info:</strong> 
                                    <br />
                                    <strong>Cosupervisors:</strong>
                                    <br />
                                    <strong>Description:</strong> {request.description}
                                    <br />
                                    <br />
                                    <br />
                                    {request.statusS == '0' ? <Button  onClick={()=>{handleRequestResponse(request.studentId, 1, request.id, request.supervisorId)}} variant='success'>Accept</Button> : ''}
                                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                    {request.statusS == '0' ? <Button onClick={()=>{handleRequestResponse(request.studentId, 2, request.id, request.supervisorId)}}variant='danger'>Reject</Button> : ''}
                                </Accordion.Body>
                            </Accordion.Item>
                        </Accordion>
                    </Card>
                ))}
            </div>
        </div>);


}
HandleRequest.propTypes = {
    user : PropTypes.oneOfType([PropTypes.string,
        PropTypes.object]).isRequired
};


export default HandleRequest;