import React, { useState, useEffect } from 'react';
import { Form, Button, Alert, Container, Row, Col, Dropdown, DropdownButton, Navbar, NavLink, Accordion, Badge, Card } from 'react-bootstrap';
import toast, { Toaster } from 'react-hot-toast';
import API from '../API';
import BootstrapSwitchButton from 'bootstrap-switch-button-react';

function MyProposal() {

    const [dirty, setDirty] = useState(true);
    const [id_professor, setId_professor] = useState(1);
    const [archived, setArchived] = useState(1);

    const [proposals, setProposals] = useState([{ id: 0, title: 'AI system research', supervisor: 'Mario Rossi', cosupervisor: ['123456@polito.it', '654321@polito.it'], expDate: '10/1/2024', keywords: 'AI', type: 'Sperimental', groups: 'A32', description: 'AI thesis about...', know: 'Machine learning', level: 'Master', cds: 'LM_31', note: 'thesis for AI', creatDate: '10/1/2023', status: '1' }]);
    const [proposalsArchiv, setProposalsArchiv] = useState([{ id: 1, title: 'Prova', supervisor: 'Luca Neri', cosupervisor: ['123456@polito.it', '654321@polito.it'], expDate: '10/1/2024', keywords: 'AI', type: 'Sperimental', groups: 'A32', description: 'AI thesis about...', know: 'Machine learning', level: 'Master', cds: 'LM_31', note: 'thesis for AI', creatDate: '10/1/2023', status: '0' }]);

    //adding API from backend to set list of prof proposals
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

    const handleSwitch = () => {
        if (archived === 0)
            setArchived(1);
        else
            setArchived(0);

    };



    return (
        archived === 1 ? <>
            <Toaster position="top-center" reverseOrder={false} />
            <BootstrapSwitchButton onChange={() => handleSwitch()} checked={archived === 1} size="sm" onlabel='published' offlabel='archived' width={100} onstyle="success" offstyle="warning" style="border" />
            <div style={{ marginTop: '10px' }}>
                {proposals.map((proposal) => (
                    <Card key={proposal.id} style={{ marginBottom: '10px' }}>
                        <Accordion>
                            <Accordion.Item eventKey={proposal.id}>
                                <Accordion.Header>
                                    <Container fluid>
                                        <Row className="d-md-flex justify-content-center align-items-center">
                                            <Col md='4' sm='4' xs='12'>
                                                <strong>Title:</strong> {proposal.title}
                                            </Col>
                                            <Col md='4' sm='4' xs='12'>
                                                <strong>Expiration date:</strong> {proposal.expDate}
                                            </Col>
                                            <Col md='3' sm='3' xs='12'>
                                                <strong>Status:</strong>{' '}
                                                {proposal.status == 1 ? (
                                                    <Badge pill bg="success">P</Badge>
                                                ) : (
                                                    <Badge pill bg="warning">A</Badge>
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
                                    <strong>Cosupervisor:</strong> {...proposal.cosupervisor.join(", ")}
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
                                    <Button variant="warning"> <img src="./pencil-fill.svg"
                                                alt="info"
                                                className="img-responsive"/></Button>
                                </Accordion.Body>
                            </Accordion.Item>
                        </Accordion>
                    </Card>
                ))}
            </div>

        </> : <>

            <Toaster position="top-center" reverseOrder={false} />
            <BootstrapSwitchButton onChange={() => handleSwitch()} checked={archived === 1} size="sm" onlabel='published' offlabel='archived' width={100} onstyle="success" offstyle="warning" style="border" />
            
            <div style={{ marginTop: '10px' }}>
            {proposalsArchiv.map((proposal) => (
                <Card key={proposal.id} style={{ marginBottom: '10px' }}>
                    <Accordion>
                        <Accordion.Item eventKey={proposal.id}>
                            <Accordion.Header>
                                <Container fluid>
                                    <Row className="d-md-flex justify-content-center align-items-center">
                                        <Col md='4' sm='4' xs='12'>
                                            <strong>Title:</strong> {proposal.title}
                                        </Col>
                                        <Col md='4' sm='4' xs='12'>
                                            <strong>Expiration date:</strong> {proposal.expDate}
                                        </Col>
                                        <Col md='3' sm='3' xs='12'>
                                            <strong>Status:</strong>{' '}
                                            {proposal.status == 1 ? (
                                                <Badge pill bg="success">P</Badge>
                                            ) : (
                                                <Badge pill bg="warning">A</Badge>
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
                                <strong>Cosupervisor:</strong> {...proposal.cosupervisor.join(", ")}
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
                                <Button variant="warning"> <img src="./pencil-fill.svg"
                                                alt="info"
                                                className="img-responsive"/></Button>
                            </Accordion.Body>
                        </Accordion.Item>
                    </Accordion>
                </Card>
            ))}
                
             </div>

        </>
    );

}

export default MyProposal;