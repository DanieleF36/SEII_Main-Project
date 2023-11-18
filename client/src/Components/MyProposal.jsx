import React, { useState, useEffect } from 'react';
import { Form, Button, Alert, Container, Row, Col, Dropdown, DropdownButton, Navbar, NavLink, Accordion, Badge, Card } from 'react-bootstrap';
import toast, { Toaster } from 'react-hot-toast';
import API from '../API';

function MyProposal() {

    const [dirty, setDirty] = useState(true);
    const [id_professor, setId_professor] = useState(1);

    const [proposals, setProposals] = useState([{id:0, title: 'AI system research', supervisor: 'Mario Rossi', expDate: '10/1/2024', keywords: 'AI', type:'Sperimental', groups:'A32', description: 'AI thesis about...', know:'Machine learning', level:'Master', cds: 'LM_31', creatDate:'10/1/2023', status: '1'}]);
    //adding API from backend to set list of applications

    /*
    useEffect(() => {

        API.listProposal(id_professor)
            .then((proposals) => {
                setApplications(proposals);
                setDirty(false);
            })
            .catch((err) => { toast.error(err.error); });

    }, [dirty]);
    */



    return (
        <div className="flex-column rounded" style={{ backgroundColor: '#fff' }} >
            <Toaster position="top-center" reverseOrder={false} />
            <div>
            {proposals.map((proposal) => (
                                <Card key={proposal.id} style={{ marginBottom: '10px' }}>
                                    <Accordion>
                                        <Accordion.Item eventKey={proposal.id}>
                                            <Accordion.Header>
                                                <Container fluid>
                                                    <Row className="d-md-flex justify-content-center align-items-center">
                                                        <Col md='3' sm='3' xs='12'>
                                                            <strong>Title:</strong> {proposal.title}
                                                        </Col>
                                                        <Col md='3' sm='3' xs='12'>
                                                            <strong>Supervisor:</strong> {proposal.supervisor}
                                                        </Col>
                                                        <Col md='3' sm='3' xs='12'>
                                                            <strong>Expiration date:</strong> {proposal.expDate}
                                                        </Col>
                                                        <Col md='2' sm='2' xs='12'>
                                                            <strong>Status:</strong>{' '}
                                                            {proposal.status == 1 ? (
                                                                <Badge pill bg="success">P</Badge>
                                                            ) : (
                                                                <Badge pill bg="danger">A</Badge>
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
                                                <strong>Keywords:</strong> {proposal.keywords}
                                                <br />
                                                <strong>Type:</strong> {proposal.type}
                                                <br />
                                                <strong>Groups:</strong> {proposal.groups}
                                                <br />
                                                <strong>Description:</strong> {proposal.description}
                                                <br />
                                                <strong>Knowledge:</strong> {proposal.know}
                                                <br />
                                                <strong>Note:</strong> {proposal.note}
                                                <br />
                                                <strong>Level:</strong> {proposal.level === 1 ? 'Master' : 'Bachelor'}
                                                <br />
                                                <strong>CdS:</strong> {proposal.cds}
                                                <br />
                                                <strong>Creation Date:</strong> {proposal.creatDate}
                                                <br />
                                                <br />
                                                <Button variant="warning"> Modify</Button>
                                            </Accordion.Body>
                                        </Accordion.Item>
                                    </Accordion>
                                </Card>
                            ))}
            </div>
        </div>);

}

export default MyProposal;