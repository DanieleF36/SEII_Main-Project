import React, { useState, useEffect } from 'react';
import { Button , Container, Row, Col, Accordion, Badge, Card } from 'react-bootstrap';
import toast, { Toaster } from 'react-hot-toast';
import PropTypes from 'prop-types';
import API from '../API';

function HandleRequest(props) {
    
    const [dirty, setDirty] = useState(true);
   
    const [list, setList] = useState([{"id":"","id_stud":"", "id_teacher":""}]);
    
    /*useEffect(() => {

        API.listRequest(props.user.role)
            .then((list) => {
                setList(list);
                setDirty(false);
            })
            .catch((err)=>{toast.error(err.message)})

    }, [dirty]);*/


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
                                                <strong>Title:</strong> {request.id}
                                            </Col>
                                            <Col md='4' sm='4' xs='12'>
                                                <strong>Student:</strong> {request.id_stud}
                                            </Col>                                  
                                            <Col md='3' sm='3' xs='12'>
                                                <strong>Supervisor:</strong> {request.id_teacher}
                                            </Col>
                                            <Col md='1' sm='1' xs='12'>
                                                <img src="./info-circle.svg"
                                                    alt="info"
                                                    className="img-responsive" />

                                            </Col>
                                        </Row>
                                    </Container>
                                </Accordion.Header>
                            </Accordion.Item>
                        </Accordion>
                    </Card>
                ))}
            </div>
        </div>);


}
HandleRequest.propTypes = {
    user: PropTypes.object.isRequired,
};


export default HandleRequest;