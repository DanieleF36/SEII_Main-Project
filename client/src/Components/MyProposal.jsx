import React, { useState, useEffect } from 'react';
import { Form, Button, Alert, Container, Row, Col, Dropdown, DropdownButton, Navbar, NavLink, Accordion, Badge, Card, Modal } from 'react-bootstrap';
import toast, { Toaster } from 'react-hot-toast';
import API from '../API';
import BootstrapSwitchButton from 'bootstrap-switch-button-react';

function MyProposal() {

  //const [dirty, setDirty] = useState(true);
  // const [id_professor, setId_professor] = useState(1);
  const [archived, setArchived] = useState(1);
  const [selectedProposal, setSelectedProposal] = useState(null);
  const [proposals, setProposals] = useState([{ id: 0, title: 'AI system research', supervisor: 'Mario Rossi', cosupervisor: ['123456@polito.it', '654321@polito.it'], expDate: '10/1/2024', keywords: 'AI', type: 'Sperimental', groups: 'A32', description: 'AI thesis about...', know: 'Machine learning', level: 'Master', cds: 'LM_31', note: 'thesis for AI', creatDate: '10/1/2023', status: '1' }]);
  const [proposalsArchiv, setProposalsArchiv] = useState([{ id: 1, title: 'Prova', supervisor: 'Luca Neri', cosupervisor: ['123456@polito.it', '654321@polito.it'], expDate: '10/1/2024', keywords: 'AI', type: 'Sperimental', groups: 'A32', description: 'AI thesis about...', know: 'Machine learning', level: 'Master', cds: 'LM_31', note: 'thesis for AI', creatDate: '10/1/2023', status: '0' }]);
  const [showModal, setShowModal] = useState(false);
  const [proposalData, setProposalData] = useState({
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

  const handleModify = (proposal) => {
    setSelectedProposal(proposal);
    setShowModal(true);

  };

  const handleSwitch = () => {
    if (archived === 0)
      setArchived(1);
    else
      setArchived(0);

  };

  const handleCloseModal = () => {
    setShowModal(false);
    handleResetChange(); // Reset the form fields
  };
  
  const [cosup_email, setCoSup_email] = useState(['marco.colli@mail.com', 'francine.ombala@mail.com']);
  const [filt_cosup, setFilt_cosup] = useState([]);

  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    setFilt_cosup(cosup_email.filter((item) =>
      item.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    //proposals.map(e=>console.log(e));
  }, [searchTerm]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProposalData((prevProposalData) => ({
      ...prevProposalData,
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

  const handleCheckboxChange = (selectedLevel) => {
    setProposalData({ ...proposalData, level: selectedLevel });
  };

  const handleList = (e) => {
    let name = e.target.name;
    let cosup_arr = e.target.value.split(",");
    let co = cosup_arr.map(e => e.trim());
    setProposalData({ ...proposalData, [name]: co });
  };

  const handleCoSup = (e) => {
    if (proposalData.cosupervisor === '') {
      let co = [];
      co.push(e);
      setProposalData({ ...proposalData, cosupervisor: co });
      setSearchTerm('');
    }
    else {
      let co = proposalData.cosupervisor;
      if (co.includes(e)) {
        toast.error('CoSupervisor already inserted');
        setSearchTerm('');
      }
      else {
        co.push(e);
        setProposalData({ ...proposalData, cosupervisor: co });
        setSearchTerm('');
      }
    }

  };

  const handleDeleteCoSup = () => {
    const updatedCoSupervisors = [...proposalData.cosupervisor];

    if (updatedCoSupervisors.length > 0) {
      // Remove the last co-supervisor
      updatedCoSupervisors.pop();
      setProposalData({ ...proposalData, cosupervisor: updatedCoSupervisors });
    } else {
      toast.error('No co-supervisors to delete');
    }
  };

  const handleSaveChanges = () => {
    if (selectedProposal) {
      if (proposalData.title === '') {
        toast.error('Title field cannot be empty');
      } else if (proposalData.keywords === '') {
        toast.error('Keywords field cannot be empty');
      } else if (proposalData.type === '') {
        toast.error('Type field cannot be empty');
      } else if (proposalData.groups === '') {
        toast.error('Group field cannot be empty');
      } else if (proposalData.description === '') {
        toast.error('Description field cannot be empty');
      } else if (proposalData.knowledge === '') {
        toast.error('Knowledge field cannot be empty');
      } else if (proposalData.expiration_date === '') {
        toast.error('Expiration Date field cannot be empty');
      } else if (proposalData.level === '') {
        toast.error('Level field cannot be unset');
      } else if (proposalData.cds === '') {
        toast.error('CdS field cannot be empty');
      } else {
        setShowModal(false);
        const updatedProposals = proposals.map((proposal) =>
          proposal.id === selectedProposal.id ? { ...proposal, ...proposalData } : proposal
        );

        // Aggiornamento dello stato con le proposte aggiornate
    setProposals(updatedProposals);

       
        API.updateProposal(selectedProposal.id, proposalData)
          .then(() => {
            toast.success('Thesis Proposal successfully updated');
          })
          .catch((error) => {
            toast.error(error.message || 'An error occurred while updating the proposal');
          });
      }
    }
  };

  return (
    archived === 1 ? <>
      <Toaster position="top-right" reverseOrder={false} />
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
                <Form.Label><strong>Title</strong></Form.Label>
                <Form.Control
                  type="text"
                  name="title"
                  value={proposalData.title}
                  onChange={handleInputChange}
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="formCosupervisor">
                <Form.Label><strong>Cosupervisors mails</strong></Form.Label>
                <Form.Control
                  type="text"
                  readOnly
                  value={proposalData.cosupervisor !== '' ? proposalData.cosupervisor.map(element => {
                    return ` ${element}`;

                  }) : ''}
                />
                <Container>
                  <Row className="mt-3">
                    <Col sm="12" md="12" lg="6" className="d-flex align-items-center">
                      <Button onClick={() => { handleCoSup(searchTerm); }} variant="primary" style={{ width: '40px', height: '38px', marginTop: '5px', marginRight: '5px' }}>
                        +
                      </Button>
                      <Dropdown style={{ marginTop: '5px' }}>
                        <Dropdown.Toggle variant="primary" id="dropdown-basic">
                          {searchTerm === '' ? 'Select mail' : searchTerm}
                        </Dropdown.Toggle>
                        <Dropdown.Menu show={searchTerm !== ''}>
                          <Form.Control
                            type="text"
                            placeholder="Search..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{ borderBlockWidth: '2px' }}
                          />
                          {filt_cosup.map((item, id) => (
                            <Dropdown.Item onClick={() => setSearchTerm(item)} key={id}>{item}</Dropdown.Item>
                          )).slice(0, 3)}
                        </Dropdown.Menu>
                      </Dropdown>
                      <Button onClick={handleDeleteCoSup} variant="danger" style={{ width: '40px', height: '38px', marginTop: '5px', marginLeft: '5px' }}>
                        -
                      </Button>
                    </Col>
                  </Row>
                </Container>
              </Form.Group>

              <Form.Group className="mb-3" controlId="formExpDate">
                <Form.Label><strong>Expiration Date</strong></Form.Label>
                <Form.Control
                  type="date"
                  name="expiration_date"
                  value={proposalData.expiration_date}
                  onChange={handleInputChange}
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="formKeywords">
                <Form.Label><strong>keywords</strong></Form.Label>
                <Form.Control
                  type="text"
                  name="keywords"
                  value={proposalData.keywords}
                  onChange={handleInputChange}
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="formType">
                <Form.Label><strong>Type</strong>&nbsp;(separated by ',')</Form.Label>
                <Form.Control
                  type="text"
                  name="type"
                  value={proposalData.type}
                  onChange={handleList}
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="formGroups">
                <Form.Label><strong>Groups</strong></Form.Label>
                <Form.Control
                  type="text"
                  name="groups"
                  value={proposalData.groups}
                  onChange={handleInputChange}
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="formDescription">
                <Form.Label><strong>Description</strong></Form.Label>
                <Form.Control
                  as="textarea"
                  name="description"
                  value={proposalData.description}
                  onChange={handleInputChange}
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="formKnowledge">
                <Form.Label><strong>Knowledge</strong></Form.Label>
                <Form.Control
                  type="text"
                  name="knowledge"
                  value={proposalData.knowledge}
                  onChange={handleInputChange}
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="formNote">
                <Form.Label><strong>Note</strong></Form.Label>
                <Form.Control
                  type="text"
                  name="note"
                  value={proposalData.note}
                  onChange={handleInputChange}
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="formLevel">
                <Form.Label><strong>Level</strong></Form.Label>
                <div>
                  <Form.Check
                    type="checkbox"
                    label="Bachelor"
                    name="level"
                    id="levelBachelor"
                    checked={proposalData.level === 'Bachelor'}
                    onChange={() => handleCheckboxChange('Bachelor')}
                  />
                  <Form.Check
                    type="checkbox"
                    label="Master"
                    name="level"
                    id="levelMaster"
                    checked={proposalData.level === 'Master'}
                    onChange={() => handleCheckboxChange('Master')}
                  />
                </div>
              </Form.Group>

              <Form.Group className="mb-3" controlId="formCds">
                <Form.Label><strong>CdS</strong></Form.Label>
                <Form.Control
                  type="text"
                  name="cds"
                  value={proposalData.cds}
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

      <Toaster position="top-right" reverseOrder={false} />
      <BootstrapSwitchButton onChange={() => handleSwitch()} checked={archived === 1} size="sm" onlabel='published' offlabel='archived' width={100} onstyle="success" offstyle="warning" style="border" />

      <div style={{ marginTop: '10px' }}>
        {proposalsArchiv.map((proposal) => (
          <Card key={proposal.id} style={{ marginBottom: '10px' }}>
            <Accordion>
              <Accordion.Item eventKey={proposal.id}>
                <Accordion.Header>
                  <Container fluid>
                    <Row className="d-md-flex justify-content-center align-items-center">
                      <Col md='4' sm='4' xs='12' className="text-center">
                        <strong>Title:</strong> {proposal.title}
                      </Col>
                      <Col md='4' sm='4' xs='12' className="text-center">
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
                      <Col md='1' sm='1' xs='12' className="text-center">
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
                  <Button variant="primary" onClick={() => handleModify(proposal)}>Modify</Button>
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
                <Form.Label><strong>Title</strong></Form.Label>
                <Form.Control
                  type="text"
                  name="title"
                  value={proposalData.title}
                  onChange={handleInputChange}
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="formCosupervisor">
                <Form.Label><strong>Cosupervisors mails</strong></Form.Label>
                <Form.Control
                  type="text"
                  readOnly
                  value={proposalData.cosupervisor !== '' ? proposalData.cosupervisor.map(element => {
                    return ` ${element}`;

                  }) : ''}
                />
                <Container>
                  <Row className="mt-3">
                    <Col sm="12" md="12" lg="6" className="d-flex align-items-center">
                      <Button onClick={() => { handleCoSup(searchTerm); }} variant="primary" style={{ width: '40px', height: '38px', marginTop: '5px', marginRight: '5px' }}>
                        +
                      </Button>
                      <Dropdown style={{ marginTop: '5px' }}>
                        <Dropdown.Toggle variant="primary" id="dropdown-basic">
                          {searchTerm === '' ? 'Select mail' : searchTerm}
                        </Dropdown.Toggle>
                        <Dropdown.Menu show={searchTerm !== ''}>
                          <Form.Control
                            type="text"
                            placeholder="Search..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{ borderBlockWidth: '2px' }}
                          />
                          {filt_cosup.map((item, id) => (
                            <Dropdown.Item onClick={() => setSearchTerm(item)} key={id}>{item}</Dropdown.Item>
                          )).slice(0, 3)}
                        </Dropdown.Menu>
                      </Dropdown>
                      <Button onClick={handleDeleteCoSup} variant="danger" style={{ width: '40px', height: '38px', marginTop: '5px', marginLeft: '5px' }}>
                        -
                      </Button>
                    </Col>
                  </Row>
                </Container>
              </Form.Group>

              <Form.Group className="mb-3" controlId="formExpDate">
                <Form.Label><strong>Expiration Date</strong></Form.Label>
                <Form.Control
                  type="date"
                  name="expiration_date"
                  value={proposalData.expiration_date}
                  onChange={handleInputChange}
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="formKeywords">
                <Form.Label><strong>keywords</strong></Form.Label>
                <Form.Control
                  type="text"
                  name="keywords"
                  value={proposalData.keywords}
                  onChange={handleInputChange}
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="formType">
                <Form.Label><strong>Type</strong>&nbsp;(separated by ',')</Form.Label>
                <Form.Control
                  type="text"
                  name="type"
                  value={proposalData.type}
                  onChange={handleList}
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="formGroups">
                <Form.Label><strong>Groups</strong></Form.Label>
                <Form.Control
                  type="text"
                  name="groups"
                  value={proposalData.groups}
                  onChange={handleInputChange}
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="formDescription">
                <Form.Label><strong>Description</strong></Form.Label>
                <Form.Control
                  as="textarea"
                  name="description"
                  value={proposalData.description}
                  onChange={handleInputChange}
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="formKnowledge">
                <Form.Label><strong>Knowledge</strong></Form.Label>
                <Form.Control
                  type="text"
                  name="knowledge"
                  value={proposalData.knowledge}
                  onChange={handleInputChange}
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="formNote">
                <Form.Label><strong>Note</strong></Form.Label>
                <Form.Control
                  type="text"
                  name="note"
                  value={proposalData.note}
                  onChange={handleInputChange}
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="formLevel">
                <Form.Label><strong>Level</strong></Form.Label>
                <div>
                  <Form.Check
                    type="checkbox"
                    label="Bachelor"
                    name="level"
                    id="levelBachelor"
                    checked={proposalData.level === 'Bachelor'}
                    onChange={() => handleCheckboxChange('Bachelor')}
                  />
                  <Form.Check
                    type="checkbox"
                    label="Master"
                    name="level"
                    id="levelMaster"
                    checked={proposalData.level === 'Master'}
                    onChange={() => handleCheckboxChange('Master')}
                  />
                </div>
              </Form.Group>

              <Form.Group className="mb-3" controlId="formCds">
                <Form.Label><strong>CdS</strong></Form.Label>
                <Form.Control
                  type="text"
                  name="cds"
                  value={proposalData.cds}
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