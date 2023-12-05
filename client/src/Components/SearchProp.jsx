import { Form, Button, Container, Row, Col, Accordion, Badge, Card, Modal } from 'react-bootstrap';


function SeacrhProp(props){




           return  ( <div>
                            {props.proposals.map((proposal) => (
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
                                                            {proposal.status === 1 ? (
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
                                                {proposal.status === 1 ? <>
                                                    <Button variant="primary" onClick={() => { props.handleShow(); props.setApplication({ ...props.application, id_thesis: proposal.id }); }}>
                                                        Apply
                                                    </Button>

                                                    <Modal show={props.show} onHide={props.handleClose}>
                                                        <Modal.Header closeButton>
                                                            <Modal.Title>Apply for proposal</Modal.Title>
                                                        </Modal.Header>
                                                        <Modal.Body>
                                                            <Form.Group controlId="formFile" className="mb-3">
                                                                <Form.Label><strong>Upload your CV</strong></Form.Label>
                                                                <Form.Control
                                                                    type="file"
                                                                    name="cv"
                                                                    onChange={props.handleApplyChange}
                                                                />
                                                            </Form.Group>
                                                        </Modal.Body>
                                                        <Modal.Footer>
                                                            <Button variant="secondary" onClick={props.handleClose}>
                                                                Close
                                                            </Button>
                                                            <Button variant="primary" onClick={() => { props.handleClose(); props.handleApplyProp(); }}>
                                                                Apply
                                                            </Button>
                                                        </Modal.Footer>
                                                    </Modal>
                                                </> : ''}
                                            </Accordion.Body>
                                        </Accordion.Item>
                                    </Accordion>
                                </Card>
                            ))}
                        </div>
           )
}

export default SeacrhProp;