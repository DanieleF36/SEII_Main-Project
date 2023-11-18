import React, { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import { Container, Row, Col, Form, ListGroup, Dropdown } from 'react-bootstrap';
import Card from 'react-bootstrap/Card';
import toast, { Toaster } from 'react-hot-toast';
import API from '../API';

function AddProposalForm() {
    const [proposalData, setProposalData] = useState({
        title: 'Demo1',
        supervisor: '',
        cosupervisor: '',
        expiration_date: '',
        keywords: ['D1', 'M1'],
        type: ['Demo'],
        groups: 'Group14',
        description: 'Demo Presentation',
        knowledge: 'Team Organization',
        note: 'DEMO1',
        level: 'Master',
        cds: 'LM-32',
    });

    const [cosup_email, setCoSup_email] = useState(['marco.colli@mail.com', 'marco.collo@mail.com']);
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
        setProposalData({ ...proposalData, [name]: value });
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
            if(co.includes(e)){
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

    const handleAddProposal = () => {
        //console.log(proposalData);
        if (proposalData.title === '') {
            toast.error('Title field cannot be empty')

        }
        else if (proposalData.keywords === '') {
            toast.error('Keywords field cannot be empty')
        }
        else if (proposalData.type === '') {
            toast.error('Type field cannot be empty')
        }
        else if (proposalData.groups === '') {
            toast.error('Group field cannot be empty')
        }
        else if (proposalData.description === '') {
            toast.error('Description field cannot be empty')
        }
        else if (proposalData.knowledge === '') {
            toast.error('Knowledge field cannot be empty')
        }
        else if (proposalData.expiration_date === '') {
            toast.error('Expiration Date field cannot be empty')
        }
        else if (proposalData.level === '') {
            toast.error('Level field cannot be unset')
        }
        else if (proposalData.cds === '') {
            toast.error('CdS field cannot be empty')
        }
        else {
            // Implement the logic to add the proposal using the proposalData state- API
            console.log(proposalData);
            API.insertProposal(proposalData)
                .then(() => { toast.success('Thesis Proposal successfully added'); handleResetChange() })
                .catch((error) => toast.error(error));
        }
    };

    return (
        <Card>
            <Toaster
                position="top-center"
                reverseOrder={false}
            />
            <Card.Body>
                <h2>Thesis Proposal</h2>
                <Form>
                    <Form.Group style={{ marginBottom: '10px', marginTop: '20px' }}>
                        <Form.Label><strong>Title</strong></Form.Label>
                        <Form.Control
                            type="text"
                            name="title"
                            value={proposalData.title}
                            onChange={handleInputChange}
                        />
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
                                <Col sm='12'md='12'lg='3'>
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
                                                style={{borderBlockWidth:'2px'}}
                                            />
                                            {filt_cosup.map((item, id) => (
                                                <Dropdown.Item onClick={() => setSearchTerm(item)} key={id}>{item}</Dropdown.Item>
                                            )).slice(0, 3)}
                                        </Dropdown.Menu>
                                    </Dropdown>
                                </Col>
                                <Col sm='12'md='12'lg='3'>
                                    <Button onClick={() => { handleCoSup(searchTerm); }} variant="primary" style={{ width: '40px', height: '38px', marginTop: '5px' }}>
                                        +
                                    </Button>
                                </Col>
                            </Row>
                        </Container>
                    </Form.Group>
                    <Form.Group style={{ marginBottom: '10px' }}>
                        <Form.Label><strong>Expiration Date</strong></Form.Label>
                        <Form.Control
                            type="date"
                            name="expiration_date"
                            value={proposalData.expiration_date}
                            onChange={handleInputChange}
                        />
                    </Form.Group>
                    <Form.Group style={{ marginBottom: '10px' }}>
                        <Form.Label><strong>Type</strong>&nbsp;(separated by ',')</Form.Label>
                        <Form.Control
                            type="text"
                            name="type"
                            value={proposalData.type}
                            onChange={handleList}
                        />
                    </Form.Group>
                    <Form.Group style={{ marginBottom: '10px' }}>
                        <Form.Label><strong>Groups</strong></Form.Label>
                        <Form.Control
                            type="text"
                            name="groups"
                            value={proposalData.groups}
                            onChange={handleInputChange}
                        />
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
                        <Form.Label><strong>Knowledge</strong></Form.Label>
                        <Form.Control
                            type="text"
                            name="knowledge"
                            value={proposalData.knowledge}
                            onChange={handleInputChange}
                        />
                    </Form.Group>
                    <Form.Group style={{ marginBottom: '10px' }}>
                        <Form.Label><strong>Note</strong></Form.Label>
                        <Form.Control
                            type="text"
                            name="note"
                            value={proposalData.note}
                            onChange={handleInputChange}
                        />
                    </Form.Group>
                    <Form.Group>
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
                    <Form.Group style={{ marginBottom: '10px' }}>
                        <Form.Label><strong>CdS</strong></Form.Label>
                        <Form.Control
                            type="text"
                            name="cds"
                            value={proposalData.cds}
                            onChange={handleInputChange}
                        />
                    </Form.Group>
                    <Button style={{ marginTop: '5px' }} variant="primary" onClick={handleAddProposal}>
                        Add Proposal
                    </Button><br />
                    <Button style={{ marginTop: '5px' }} variant="danger" onClick={handleResetChange}>
                        Reset Fields
                    </Button>
                </Form>
            </Card.Body>
        </Card>
    );
}

export default AddProposalForm;