import React, { useState, useEffect } from 'react';
import { Form, Button, Alert, Container, Row, Col, Dropdown, DropdownButton, Navbar, NavLink, Accordion, Badge, Card,Modal } from 'react-bootstrap';
import toast, { Toaster } from 'react-hot-toast';
import API from '../API';
import BootstrapSwitchButton from 'bootstrap-switch-button-react';

function MyProposal() {

    const [dirty, setDirty] = useState(true);
    const [id_professor, setId_professor] = useState(1);
    const [archived, setArchived] = useState(1);
    const [selectedProposal, setSelectedProposal] = useState(null);

    const [proposals, setProposals] = useState([{ id: 0, title: 'AI system research', supervisor: 'Mario Rossi', cosupervisor: ['123456@polito.it', '654321@polito.it'], expDate: '10/1/2024', keywords: 'AI', type: 'Sperimental', groups: 'A32', description: 'AI thesis about...', know: 'Machine learning', level: 'Master', cds: 'LM_31', note: 'thesis for AI', creatDate: '10/1/2023', status: '1' }]);
    const [proposalsArchiv, setProposalsArchiv] = useState([{ id: 1, title: 'Prova', supervisor: 'Luca Neri', cosupervisor: ['123456@polito.it', '654321@polito.it'], expDate: '10/1/2024', keywords: 'AI', type: 'Sperimental', groups: 'A32', description: 'AI thesis about...', know: 'Machine learning', level: 'Master', cds: 'LM_31', note: 'thesis for AI', creatDate: '10/1/2023', status: '0' }]);
    const [showModal, setShowModal] = useState(false);
    const [proposalChanges, setProposalChanges] = useState({
        // Initialize with default values or an empty object

     title: '',
    supervisor: '',
    cosupervisor: '',
    expiration_date: '',
    keywords: '',
    type: '',
    groups: '',
    description: '',
    knowledge: '',
    note: '',
    level: '',
    cds: '',
      });
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

    const handleCloseModal = () => {
        setShowModal(false);
    };


    const handleModify = (proposal) => {
        setSelectedProposal(proposal);
        setShowModal(true);
    };


    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setProposalChanges((prevChanges) => ({
          ...prevChanges,
          [name]: value,
        }));
      };


    const handleResetChange = () => {
        setProposalData({
            title: '',
            supervisor: '',
            cosupervisor: '',
            expiration_date: '',
            keywords: '',
            type: '',
            groups: '',
            description: '',
            knowledge: '',
            note: '',
            level: '',
            cds: '',
        });
    };

    const handleSaveChanges = () => {
        if (selectedProposal) {
            // Validate form fields
            if (proposalChanges.title === '') {
                toast.error('Title field cannot be empty');
            } else if (proposalChanges.keywords === '') {
                toast.error('Keywords field cannot be empty');
            } else if (proposalChanges.type === '') {
                toast.error('Type field cannot be empty');
            } else if (proposalChanges.groups === '') {
                toast.error('Group field cannot be empty');
            } else if (proposalChanges.description === '') {
                toast.error('Description field cannot be empty');
            } else if (proposalChanges.knowledge === '') {
                toast.error('Knowledge field cannot be empty');
            } else if (proposalChanges.expiration_date === '') {
                toast.error('Expiration Date field cannot be empty');
            } else if (proposalChanges.level === '') {
                toast.error('Level field cannot be unset');
            } else if (proposalChanges.cds === '') {
                toast.error('CdS field cannot be empty');
            } else {
                // If all fields are valid, proceed to update the proposal
                const updatedProposals = proposals.map((proposal) =>
                    proposal.id === selectedProposal.id ? { ...proposal, ...proposalChanges } : proposal
                );
    
                // Update the state with the modified proposals
                setProposals(updatedProposals);
    
                // Close the modal
                setShowModal(false);
    
                // Use the API to update the proposal
                API.updateProposal(selectedProposal.id, proposalChanges)
                    .then(() => {
                        // Display success message
                        toast.success('Thesis Proposal successfully updated');
                    })
                    .catch((error) => {
                        // Handle API error
                        toast.error(error);
                    });
            }
        }
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
                                    <Button variant="warning" onClick={() => handleModify(proposal)}>Modify</Button>
                                </Accordion.Body>
                            </Accordion.Item>
                        </Accordion>
                    </Card>
                ))}
            </div>

            <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Proposal</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedProposal && (
                      <Form>
                      <Form.Group className="mb-3" controlId="formTitle">
                        <Form.Label>Title</Form.Label>
                        <Form.Control
                          type="text"
                          id="title"
                          name="title"
                          value={proposalChanges.title || selectedProposal.title}
                          onChange={handleInputChange}
                        />
                      </Form.Group>
      
                      <Form.Group className="mb-3" controlId="formSupervisor">
                        <Form.Label>Supervisor</Form.Label>
                        <Form.Control
                          type="text"
                          id="supervisor"
                          name="supervisor"
                          value={proposalChanges.supervisor || selectedProposal.supervisor}
                          onChange={handleInputChange}
                        />
                      </Form.Group>
      
                      <Form.Group className="mb-3" controlId="formCosupervisor">
                        <Form.Label>Cosupervisor</Form.Label>
                        <Form.Control
                          type="text"
                          id="cosupervisor"
                          name="cosupervisor"
                          value={proposalChanges.cosupervisor || selectedProposal.cosupervisor.join(', ')}
                          onChange={handleInputChange}
                        />
                      </Form.Group>
      
                      <Form.Group className="mb-3" controlId="formExpDate">
                        <Form.Label>Expiration Date</Form.Label>
                        <Form.Control
                          type="text"
                          id="expiration_date"
                          name="expiration_date"
                          value={proposalChanges.expiration_date || selectedProposal.expiration_date}
                          onChange={handleInputChange}
                        />
                      </Form.Group>
      
                      <Form.Group className="mb-3" controlId="formKeywords">
                        <Form.Label>Keywords</Form.Label>
                        <Form.Control
                          type="text"
                          id="keywords"
                          name="keywords"
                          value={proposalChanges.keywords || selectedProposal.keywords}
                          onChange={handleInputChange}
                        />
                      </Form.Group>
      
                      <Form.Group className="mb-3" controlId="formType">
                        <Form.Label>Type</Form.Label>
                        <Form.Control
                          type="text"
                          id="type"
                          name="type"
                          value={proposalChanges.type || selectedProposal.type}
                          onChange={handleInputChange}
                        />
                      </Form.Group>
      
                      <Form.Group className="mb-3" controlId="formGroups">
                        <Form.Label>Groups</Form.Label>
                        <Form.Control
                          type="text"
                          id="groups"
                          name="groups"
                          value={proposalChanges.groups || selectedProposal.groups}
                          onChange={handleInputChange}
                        />
                      </Form.Group>
      
                      <Form.Group className="mb-3" controlId="formDescription">
                        <Form.Label>Description</Form.Label>
                        <Form.Control
                          as="textarea"
                          rows={3}
                          id="description"
                          name="description"
                          value={proposalChanges.description || selectedProposal.description}
                          onChange={handleInputChange}
                        />
                      </Form.Group>
      
                      <Form.Group className="mb-3" controlId="formKnowledge">
                        <Form.Label>Knowledge</Form.Label>
                        <Form.Control
                          type="text"
                          id="knowledge"
                          name="knowledge"
                          value={proposalChanges.knowledge || selectedProposal.knowledge}
                          onChange={handleInputChange}
                        />
                      </Form.Group>
      
                      <Form.Group className="mb-3" controlId="formNote">
                        <Form.Label>Note</Form.Label>
                        <Form.Control
                          as="textarea"
                          rows={3}
                          id="note"
                          name="note"
                          value={proposalChanges.note || selectedProposal.note}
                          onChange={handleInputChange}
                        />
                      </Form.Group>
      
                      <Form.Group className="mb-3" controlId="formLevel">
                        <Form.Label>Level</Form.Label>
                        <Form.Control
                          type="text"
                          id="level"
                          name="level"
                          value={proposalChanges.level || selectedProposal.level}
                          onChange={handleInputChange}
                        />
                      </Form.Group>
      
                      <Form.Group className="mb-3" controlId="formCds">
                        <Form.Label>CdS (Course of Study)</Form.Label>
                        <Form.Control
                          type="text"
                          id="cds"
                          name="cds"
                          value={proposalChanges.cds || selectedProposal.cds}
                          onChange={handleInputChange}
                        />
                      </Form.Group>  
                            
                            {/* Add other form fields for editing */}
                        </Form>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleSaveChanges}>
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Modal>
      
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
                                <Button variant="warning" onClick={() => handleModify(proposal)}>Modify</Button>
                            </Accordion.Body>
                        </Accordion.Item>
                    </Accordion>
                </Card>
            ))}
                
             </div>

             <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Proposal</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedProposal && (
                        
                        <Form>
                <Form.Group className="mb-3" controlId="formTitle">
                  <Form.Label>Title</Form.Label>
                  <Form.Control
                    type="text"
                    id="title"
                    name="title"
                    value={proposalChanges.title || selectedProposal.title}
                    onChange={handleInputChange}
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formSupervisor">
                  <Form.Label>Supervisor</Form.Label>
                  <Form.Control
                    type="text"
                    id="supervisor"
                    name="supervisor"
                    value={proposalChanges.supervisor || selectedProposal.supervisor}
                    onChange={handleInputChange}
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formCosupervisor">
                  <Form.Label>Cosupervisor</Form.Label>
                  <Form.Control
                    type="text"
                    id="cosupervisor"
                    name="cosupervisor"
                    value={proposalChanges.cosupervisor || selectedProposal.cosupervisor.join(', ')}
                    onChange={handleInputChange}
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formExpDate">
                  <Form.Label>Expiration Date</Form.Label>
                  <Form.Control
                    type="text"
                    id="expiration_date"
                    name="expiration_date"
                    value={proposalChanges.expiration_date || selectedProposal.expiration_date}
                    onChange={handleInputChange}
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formKeywords">
                  <Form.Label>Keywords</Form.Label>
                  <Form.Control
                    type="text"
                    id="keywords"
                    name="keywords"
                    value={proposalChanges.keywords || selectedProposal.keywords}
                    onChange={handleInputChange}
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formType">
                  <Form.Label>Type</Form.Label>
                  <Form.Control
                    type="text"
                    id="type"
                    name="type"
                    value={proposalChanges.type || selectedProposal.type}
                    onChange={handleInputChange}
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formGroups">
                  <Form.Label>Groups</Form.Label>
                  <Form.Control
                    type="text"
                    id="groups"
                    name="groups"
                    value={proposalChanges.groups || selectedProposal.groups}
                    onChange={handleInputChange}
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formDescription">
                  <Form.Label>Description</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    id="description"
                    name="description"
                    value={proposalChanges.description || selectedProposal.description}
                    onChange={handleInputChange}
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formKnowledge">
                  <Form.Label>Knowledge</Form.Label>
                  <Form.Control
                    type="text"
                    id="knowledge"
                    name="knowledge"
                    value={proposalChanges.knowledge || selectedProposal.knowledge}
                    onChange={handleInputChange}
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formNote">
                  <Form.Label>Note</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    id="note"
                    name="note"
                    value={proposalChanges.note || selectedProposal.note}
                    onChange={handleInputChange}
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formLevel">
                  <Form.Label>Level</Form.Label>
                  <Form.Control
                    type="text"
                    id="level"
                    name="level"
                    value={proposalChanges.level || selectedProposal.level}
                    onChange={handleInputChange}
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formCds">
                  <Form.Label>CdS (Course of Study)</Form.Label>
                  <Form.Control
                    type="text"
                    id="cds"
                    name="cds"
                    value={proposalChanges.cds || selectedProposal.cds}
                    onChange={handleInputChange}
                  />
                </Form.Group>     
                       

                            {/* Add other form fields for editing */}
                        </Form>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleSaveChanges}>
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}
      
export default MyProposal;