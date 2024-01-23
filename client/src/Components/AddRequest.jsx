import React, { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import { Container, Row, Col, Form, Dropdown } from 'react-bootstrap';
import Card from 'react-bootstrap/Card';
import PropTypes from 'prop-types';
import toast, { Toaster } from 'react-hot-toast';
import API from '../API';

function AddRequestForm(props) {
    const [proposalData, setProposalData] = useState({
        supervisor: '',
        cosupervisor: '',
        description: 'Description of thesis request'
    });

    const [cosup_email] = useState(props.mails);
    const [sup_list] = useState(props.sup);
    const [filt_cosup, setFilt_cosup] = useState([]);
    const [filt_sup, setFilt_sup] = useState([]);
    const [searchSup, setSearchSup] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    

    useEffect(() => {
        setFilt_cosup(cosup_email.filter((item) =>
        item.toLowerCase().includes(searchTerm.toLowerCase())))
    }, [searchTerm]);

    useEffect(() => {
        setFilt_sup(sup_list.filter((item) =>
        item.toLowerCase().includes(searchSup.toLowerCase())))
    }, [searchSup]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setProposalData({ ...proposalData, [name]: value });
    };

    const handleResetChange = () => {
        setProposalData({
            supervisor: '',
            cosupervisor: '',
            description: '',
        });
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
                toast.error('This CoSupervisor already inserted');
                setSearchTerm('');
            }
            else {
                co.push(e);
                setProposalData({ ...proposalData, cosupervisor: co });
                setSearchTerm('');
            }
        }

    };
    const handleSup = (e) => {
        if (proposalData.supervisor === '') {
            setProposalData({ ...proposalData, supervisor: e });
            setSearchTerm('');
            setSearchSup('');
        }
        else {
            toast.error('Supervisor already inserted');      
        }

    };

    const handleDeleteCoSup = () => {
        const updatedCoSupervisors = [...proposalData.cosupervisor];
        if (updatedCoSupervisors.length > 0) {
          updatedCoSupervisors.pop();
          setProposalData({ ...proposalData, cosupervisor: updatedCoSupervisors });
        } else {
          toast.error('No co-supervisors to delete');
        }
      };

      const handleDeleteSup = () => {
        if (proposalData.supervisor !== "" ) {
          setProposalData({ ...proposalData, supervisor: "" });
        } else {
          toast.error('No supervisors to delete');
        }
      };

    const handleAddProposal = () => {
        if (proposalData.supervisor === '') {
            toast.error('Supervisor field cannot be empty')
        } else if (proposalData.description === '') {
            toast.error('Description field cannot be empty')
        } else {
            let addP = proposalData;
            if(addP.cosupervisor.length === 0)
                addP.cosupervisor=[]; 
            API.addRequest(addP)
                .then(() => { toast.success('Thesis Request successfully added'); handleResetChange();})
                .catch((error) => toast.error(error.message));
        }
    };


    return (
        <Card>
            <Toaster
                position="top-center"
                reverseOrder={false}
            />
            <Card.Body>
                <h2>Thesis Request</h2>
                <Form>
                    <Form.Group style={{ marginBottom: '10px' }}>
                        <Form.Label><strong>Supervisor</strong></Form.Label>
                        <Form.Control
                            type="text"
                            readOnly
                            value={proposalData.supervisor}
                        />
                        <Container>
                            <Row className="mt-3">
                                <Col sm="12" md="12" lg="6" className="d-flex align-items-center">
                                    <Dropdown style={{ marginTop: '5px' }}>
                                        <Dropdown.Toggle variant="primary" id="dropdown-basic">
                                            {searchSup === '' ? 'Select mail' : searchSup}
                                        </Dropdown.Toggle>

                                        <Dropdown.Menu show={searchSup !== ''}>
                                            <Form.Control
                                                type="text"
                                                placeholder="Search..."
                                                value={searchSup}
                                                onChange={(e) => setSearchSup(e.target.value)}
                                                style={{ borderBlockWidth: '2px' }}
                                            />
                                            {filt_sup.map((item, id) => (
                                                <Dropdown.Item onClick={() => setSearchSup(item)} key={id}>{item}</Dropdown.Item>
                                            )).slice(0, 3)}
                                        </Dropdown.Menu>
                                    </Dropdown>
                                    {proposalData.supervisor===''?<Button onClick={() => { handleSup(searchSup); }} variant="primary" style={{ width: '100px', height: '38px', marginTop: '5px', marginRight: '3px', marginLeft: '10px' }}>
                                        Add
                                    </Button>:<Button onClick={handleDeleteSup} variant="danger" style={{ width: '100px', height: '38px', marginTop: '5px', marginLeft: '10px' }}>
                                        Remove
                                    </Button>}
                                    
                                </Col>
                            </Row>
                        </Container>
                    </Form.Group>
                    <Form.Group style={{ marginBottom: '10px' }}>
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
                                    <Button onClick={() => { handleCoSup(searchTerm); }} variant="primary" style={{ width: '40px', height: '38px', marginTop: '5px', marginRight: '3px', marginLeft: '10px' }}>
                                        +
                                    </Button>
                                    <Button onClick={handleDeleteCoSup} variant="danger" style={{ width: '40px', height: '38px', marginTop: '5px' }}>
                                        -
                                    </Button>
                                </Col>
                            </Row>
                        </Container>
                    </Form.Group>
                    <Form.Group style={{ marginBottom: '10px' }}>
                        <Form.Label><strong>Description</strong></Form.Label>
                        <Form.Control
                            as="textarea"
                            name="description"
                            value={proposalData.description}
                            onChange={handleInputChange}
                        />
                    </Form.Group>
                    <Form.Group style={{ marginBottom: '10px' }}>
                        <Form.Label><strong>CdS</strong>&nbsp;(separated by ',')</Form.Label>
                        <Form.Control
                            readOnly
                            type="text"
                            name="cds"
                            value={props.user.cds}
                        />
                    </Form.Group>
                    <Button style={{ marginTop: '5px' }} variant="primary" onClick={handleAddProposal}>
                        Add Request
                    </Button><br />
                    <Button style={{ marginTop: '5px' }} variant="danger" onClick={handleResetChange}>
                        Reset Fields
                    </Button>
                </Form>
            </Card.Body>
        </Card>
    );
}

AddRequestForm.propTypes = {
    user : PropTypes.oneOfType([PropTypes.string,
        PropTypes.object]).isRequired,
    mails : PropTypes.array.isRequired,
    sup : PropTypes.array.isRequired
  };

export default AddRequestForm;