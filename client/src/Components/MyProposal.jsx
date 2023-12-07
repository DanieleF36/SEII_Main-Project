import React, { useState, useEffect } from 'react';
import { Form, Button, Alert, Container, Row, Col, Dropdown, DropdownButton, Navbar, NavLink, Accordion, Badge, Card, Modal,OverlayTrigger, Tooltip } from 'react-bootstrap';
import toast, { Toaster } from 'react-hot-toast';
import API from '../API';
import BootstrapSwitchButton from 'bootstrap-switch-button-react';
import 'bootstrap-icons/font/bootstrap-icons.css';

function MyProposal(props) {

  const [dirty, setDirty] = useState(true);
  const [archived, setArchived] = useState(1);
  const [selectedProposal, setSelectedProposal] = useState('');
  const [proposals, setProposals] = useState([/*{ id: 0, title: 'AI system research', supervisor: 'Mario Rossi', cosupervisor: ['123456@polito.it', '654321@polito.it'], expiration_date: '10/01/2024', keywords: 'AI', type: 'Sperimental', groups: 'A32', description: 'AI thesis about...', know: 'Machine learning', level: 'Master', cds: 'LM_31', note: 'thesis for AI', creation_date: '10/1/2023', status: '1' }*/]);
  const [showModal, setShowModal] = useState(false);
  const [showModal2, setShowModal2] = useState(false);



  const handleModify = (proposal) => {
    setSelectedProposal( {...proposal} );
    setShowModal(true);
  };

  const handleStatus = (proposal) => {
    setShowModal2(false);
  
    API.updateProposal(proposal.id, proposal, proposal.status)
         .then(() => {
           setDirty(true);
            toast.success('Thesis Proposal successfully archived');
         })
         .catch((error) => {
           toast.error(error.message || 'An error occurred while updating the proposal');
         });
    
  };

  const handleSwitch = () => {
    if (archived === 0){
      
      setArchived(1);
      setDirty(true);
      
    }else{
      setArchived(0);
      setDirty(true);
    }

  };

  const handleCloseModal = () => {
    setShowModal(false);

    setSelectedProposal('');
    
  };
  const handleCloseModal2 = () => {
    setShowModal2(false);

    setSelectedProposal('');
  };
  
  const [cosup_email, setCoSup_email] = useState(['marco.colli@mail.com', 'marco.collo@mail.com']);
  const [filt_cosup, setFilt_cosup] = useState([]);

  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    setFilt_cosup(cosup_email.filter((item) =>
      item.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [searchTerm]);

   
    useEffect(() => {
      if(props.user.role === 'teacher'){
          API.browseProposal(archived)
          .then((proposals) => {
              setProposals(proposals);
              setDirty(false);
          })
          .catch((err) => { toast.error(err.error); });
        }
       
    }, [dirty, props.user]);


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSelectedProposal((prevselectedProposal) => ({
      ...prevselectedProposal,
      [name]: value,
    }));
  };

  const correctSpace = (prop) => {
    if(Array.isArray(prop.cds)){
    let c = prop.cds.map(e=>e.trim());
    prop.cds = c;
    }
    if(Array.isArray(prop.keywords)){
    let k = prop.keywords.map(e=>e.trim());
    prop.keywords = k;
    }
    if(Array.isArray(prop.type)){
    let t = prop.type.map(e=>e.trim());
    prop.type = t;
    }
    if(Array.isArray(prop.knowledge)){
    let kn = prop.knowledge.map(e=>e.trim());
    prop.knowledge = kn;
    }
    if(Array.isArray(prop.groups)){
    let g = prop.groups.map(e=>e.trim());
    prop.groups = g;
    }
    return prop;
  }


  const handleResetChange = () => {
    setSelectedProposal('');
  };

  const handleCheckboxChange = (selectedLevel) => {
    setSelectedProposal({ ...selectedProposal, level: selectedLevel });
  };

  const handleList = (e) => {
    let name = e.target.name;
    let cosup_arr = e.target.value.split(",");
    setSelectedProposal({ ...selectedProposal, [name]: cosup_arr});
  };

  /*const handleCoSup = (e) => {
    if (selectedProposal.cosupervisor === '') {
      let co = [];
      co.push(e);
      setSelectedProposal({ ...selectedProposal, cosupervisor: co });
      setSearchTerm('');
    } else {
      let co = [...selectedProposal.cosupervisor]; // Crea una copia dell'array
      if (co.includes(e)) {
        toast.error('CoSupervisor already inserted');
        setSearchTerm('');
      } else {
        co.push(e);
        setSelectedProposal({ ...selectedProposal, cosupervisor: co });
        setSearchTerm('');
      }
    }
  };*/
  
  /*const handleDeleteCoSup = () => {
    const updatedCoSupervisors = [...selectedProposal.cosupervisor];
    if (updatedCoSupervisors.length > 0) {
      updatedCoSupervisors.pop();
      setSelectedProposal({ ...selectedProposal, cosupervisor: updatedCoSupervisors });
    } else {
      toast.error('No co-supervisors to delete');
    }
  };*/

  const handleSaveChanges = () => {
    if (selectedProposal) {
      if (selectedProposal.title === '') {
        toast.error('Title field cannot be empty');
      } else if (selectedProposal.keywords === '') {
        toast.error('Keywords field cannot be empty');
      } else if (selectedProposal.type === '') {
        toast.error('Type field cannot be empty');
      } else if (selectedProposal.groups === '') {
        toast.error('Group field cannot be empty');
      } else if (selectedProposal.description === '') {
        toast.error('Description field cannot be empty');
      } else if (selectedProposal.know === '') {
        toast.error('Knowledge field cannot be empty');
      } else if (selectedProposal.expiration_date === '') {
        toast.error('Expiration Date field cannot be empty');
      } else if (selectedProposal.level === '') {
        toast.error('Level field cannot be unset');
      } else if (selectedProposal.cds === '') {
        toast.error('CdS field cannot be empty');
      } else {
        setShowModal(false);
        let updatep = selectedProposal
       API.updateProposal(selectedProposal.id, correctSpace(updatep))
         .then(() => {
           setDirty(true);
           toast.success('Thesis Proposal successfully updated');
         })
         .catch((error) => {
           toast.error(error.message || 'An error occurred while updating the proposal');
         });
      }
    }
  };


  return (
    <>
      <BootstrapSwitchButton onChange={() => handleSwitch()} checked={archived === 1} size="sm" onlabel='published' offlabel='archived' width={100} onstyle="success" offstyle="warning" style="border" />
      <div style={{ marginTop: '10px' }}>
        {proposals.map((proposal) => (
          <Card key={proposal.id} style={{ marginBottom: '10px' }}>
            <Toaster position="top-center" reverseOrder={false} />
            <Accordion>
              <Accordion.Item eventKey={proposal.id}>
                <Accordion.Header>
                  <Container fluid>
                    <Row className="d-md-flex justify-content-center align-items-center">
                      <Col md='4' sm='4' xs='12'>
                        <strong>Title:</strong> {proposal.title}
                      </Col>
                      <Col md='4' sm='4' xs='12'>
                        <strong>Expiration date:</strong> {proposal.expiration_date}
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
                  <strong>Description:</strong> {proposal.description}
                  <br />
                  <strong>Knowledge:</strong> {proposal.knowledge}
                  <br />
                  <strong>Note:</strong> {proposal.note}
                  <br />
                  <strong>Level:</strong> {proposal.level === 1 ? 'Master' : 'Bachelor'}
                  <br />
                  <strong>CdS:</strong> {proposal.cds}
                  <br />
                  <strong>Creation Date:</strong> {proposal.creation_date}
                  <br />
                  <br />
                  <OverlayTrigger placement="top" delay={{ show: 250, hide: 300 }} overlay={<Tooltip>Modify</Tooltip>  }><Button variant="warning mx-2" onClick={() => handleModify(proposal)}><i className="bi bi-pencil-fill" style={{color:'white'}}/></Button></OverlayTrigger>
                  {proposal.status==1 ?
                    (<OverlayTrigger placement="top" delay={{ show: 250, hide: 300 }} overlay={<Tooltip>Archive</Tooltip>  }><Button variant="secondary mx-2" onClick={() => {setShowModal2(true); setSelectedProposal(proposal);}}><i className="bi bi-archive"/></Button></OverlayTrigger>)
                   : ''
                    /*(<OverlayTrigger placement="top" delay={{ show: 250, hide: 300 }} overlay={<Tooltip>Active</Tooltip>  }><Button variant="success mx-2" onClick={() => {setShowModal2(true); setSelectedProposal(proposal);}}><i className="bi bi-archive"/></Button></OverlayTrigger>)*/
                  }
                  <OverlayTrigger placement="top" delay={{ show: 250, hide: 300 }} overlay={<Tooltip>Copy</Tooltip>  }><Button variant="primary mx-2" onClick={() => props.handleCopy(proposal)} ><i className="bi bi-clipboard-plus-fill"/></Button></OverlayTrigger>
                  
                </Accordion.Body>
              </Accordion.Item>
            </Accordion>
          </Card>
        ))}
      </div>
      <Modal show={showModal} onHide={handleCloseModal}  backdrop="static"
        keyboard={false}>
        <Toaster position="top-center" reverseOrder={false} />
        <Modal.Header closeButton>
          <Modal.Title>Edit Proposal</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedProposal && (
            <Form>
              <Form.Group className="mb-3">
                <Form.Label><strong>Title</strong></Form.Label>
                <Form.Control
                  type="text"
                  name="title"
                  value={selectedProposal.title}
                  onChange={handleInputChange}
                />
              </Form.Group>

              {/* <Form.Group className="mb-3">
                <Form.Label><strong>Cosupervisors mails</strong></Form.Label>
                <Form.Control
                  type="text"
                  readOnly
                  value={selectedProposal.cosupervisor !== '' ? selectedProposal.cosupervisor.map(element => {
                    return ` ${element}`;

                  }) : ''}
                />
                <Container>
                  <Row className="mt-3">
                    <Col sm="12" md="12" lg="6" className="d-flex align-items-center">
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
                      <Button onClick={() => { handleCoSup(searchTerm); }} variant="primary" style={{ width: '40px', height: '38px', marginTop: '5px', marginRight: '3px', marginLeft: '10px'  }}>
                        +
                      </Button>
                      <Button onClick={handleDeleteCoSup} variant="danger" style={{ width: '40px', height: '38px', marginTop: '5px'}}>
                        -
                      </Button>
                    </Col>
                  </Row>
                </Container>
              </Form.Group> */}

              <Form.Group className="mb-3">
                <Form.Label><strong>Expiration Date</strong></Form.Label>
                <Form.Control
                  type="date"
                  name="expiration_date"
                  value={selectedProposal.expiration_date} // cambiare con proposal dinamica
                  onChange={handleInputChange}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label><strong>Keywords</strong>&nbsp;(separated by ',')</Form.Label>
                <Form.Control
                  type="text"
                  name="keywords"
                  value={selectedProposal.keywords}
                  onChange={handleList}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label><strong>Type</strong>&nbsp;(separated by ',')</Form.Label>
                <Form.Control
                  type="text"
                  name="type"
                  value={selectedProposal.type}
                  onChange={handleList}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label><strong>Groups</strong>&nbsp;(separated by ',')</Form.Label>
                <Form.Control
                  type="text"
                  name="groups"
                  value={selectedProposal.groups}
                  onChange={handleList}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label><strong>Description</strong></Form.Label>
                <Form.Control
                  as="textarea"
                  name="description"
                  value={selectedProposal.description}
                  onChange={handleInputChange}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label><strong>Knowledge</strong>&nbsp;(separated by ',')</Form.Label>
                <Form.Control
                  type="text"
                  name="knowledge"
                  value={selectedProposal.knowledge}
                  onChange={handleList}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label><strong>Note</strong></Form.Label>
                <Form.Control
                  type="text"
                  name="note"
                  value={selectedProposal.note}
                  onChange={handleInputChange}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label><strong>Level</strong></Form.Label>
                <div>
                  <Form.Check
                    type="checkbox"
                    label="Bachelor"
                    name="level"
                    id="levelBachelor"
                    checked={selectedProposal.level == 0}
                    onChange={() => handleCheckboxChange(0)}
                  />
                  <Form.Check
                    type="checkbox"
                    label="Master"
                    name="level"
                    id="levelMaster"
                    checked={selectedProposal.level == 1}
                    onChange={() => handleCheckboxChange(1)}
                  />
                </div>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label><strong>CdS</strong>&nbsp;(separated by ',')</Form.Label>
                <Form.Control
                  type="text"
                  name="cds"
                  value={selectedProposal.cds}
                  onChange={handleList}
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

      <Modal show={showModal2} onHide={handleCloseModal2} backdrop="static"
        keyboard={false}>
      <Modal.Header closeButton>
          <Modal.Title>Are you sure to archive this proposal?</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Button variant="success mx-2" onClick={() => handleStatus(selectedProposal)}>Yes</Button>
          <Button variant="danger" onClick={handleCloseModal2}>No</Button>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal2}>Close</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default MyProposal;