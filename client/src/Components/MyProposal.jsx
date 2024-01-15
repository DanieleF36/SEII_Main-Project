import React, { useState, useEffect } from 'react';
import { Form, Button, Container, Row, Col,  Accordion, Badge, Card, Modal,OverlayTrigger, Tooltip } from 'react-bootstrap';
import toast, { Toaster } from 'react-hot-toast';
import PropTypes from 'prop-types';
import API from '../API';
import BootstrapSwitchButton from 'bootstrap-switch-button-react';
import 'bootstrap-icons/font/bootstrap-icons.css';

function MyProposal(props) {

  const [dirty, setDirty] = useState(true);
  const [archived, setArchived] = useState(1);
  const [selectedProposal, setSelectedProposal] = useState('');
  const [proposals, setProposals] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showModal2, setShowModal2] = useState(false);
  const [showModal3, setShowModal3] = useState(false);
  const [deleteP, setDeleteP] = useState(false);



  const handleModify = (proposal) => {
    setSelectedProposal( {...proposal} );
    setShowModal(true);
  };

  const handleDelete = (proposal) => {
    setDeleteP( {...proposal} );
    setShowModal3(true);
  };

  const applyDelete = () => {
    API.deleteThesis(deleteP.id).then(()=>toast.success('Thesis Proposal successfully deleted')).catch((err)=>{toast.error(err.message)});
    setDirty(true);
    handleCloseModal3();
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
    toast.remove();
    if (archived === 0){
      
      setArchived(1);
      props.setSwitch(1);
      setDirty(true);
      
    }else{
      setArchived(0);
      props.setSwitch(0);
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

  const handleCloseModal3 = () => {
    setShowModal3(false);

    setDeleteP('');
  };
  
  const [cosup_email] = useState(['marco.colli@mail.com', 'marco.collo@mail.com']);
  const [filt_cosup, setFilt_cosup] = useState([]);

  const [searchTerm] = useState('');

  useEffect(() => {
    setFilt_cosup(cosup_email.filter((item) =>
      item.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [searchTerm]);

   
    useEffect(() => {
      if(props.user.role === 'teacher'){
        API.advancedSearchThesis({ ...props.filters, page: 1, status:archived})
          .then((res) => {
              setProposals(res[1]);
              setDirty(false);
          })
          .catch((err)=>{toast.error(err.message)})
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

  const handleCheckboxChange = (selectedLevel) => {
    setSelectedProposal({ ...selectedProposal, level: selectedLevel });
  };

  const handleList = (e) => {
    let name = e.target.name;
    let cosup_arr = e.target.value.split(",");
    setSelectedProposal({ ...selectedProposal, [name]: cosup_arr});
  };

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
      } else if (selectedProposal.expDate === '') {
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
                        <strong>Expiration date:</strong> {proposal.expDate}
                      </Col>
                      <Col md='3' sm='3' xs='12'>
                        <strong>Status:</strong>{' '}
                      
                        {proposal.status == 1 ? (
                          <Badge pill bg="success">PUB</Badge>
                        ) : (
                          <Badge pill bg="warning">ARC</Badge>
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
                  }
                  <OverlayTrigger placement="top" delay={{ show: 250, hide: 300 }} overlay={<Tooltip>Copy</Tooltip>  }><Button variant="primary mx-2" onClick={() => props.handleCopy(proposal)} ><i className="bi bi-clipboard-plus-fill"/></Button></OverlayTrigger>
                  {proposal.status==1?
                  <OverlayTrigger placement="top" delay={{ show: 250, hide: 300 }} overlay={<Tooltip>Delete</Tooltip>  }><Button variant="danger mx-2 my-2" onClick={() => handleDelete(proposal)} ><i className="bi bi-trash3-fill"></i></Button></OverlayTrigger>:''
                  }
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


              <Form.Group className="mb-3">
                <Form.Label><strong>Expiration Date</strong></Form.Label>
                <Form.Control
                  type="date"
                  name="expDate"
                  value={selectedProposal.expDate} // cambiare con proposal dinamica
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

      <Modal show={showModal3} onHide={handleCloseModal3} backdrop="static"
        keyboard={false}>
      <Modal.Header closeButton>
          <Modal.Title>Are you sure to delete this proposal?</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Button variant="success mx-2" onClick={() => applyDelete()}>Yes</Button>
          <Button variant="danger" onClick={handleCloseModal3}>No</Button>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal3}>Close</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

MyProposal.propTypes = {
  user : PropTypes.oneOfType([PropTypes.string,
    PropTypes.object]).isRequired,
  handleCopy: PropTypes.func.isRequired,
};

export default MyProposal;