import React, { useState } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import toast, { Toaster } from 'react-hot-toast';
import API from '../API';

function AddProposalForm() {
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

    const handleCoSupChange = (e) => {
        let name = e.target.name;
        let cosup_arr = e.target.value.split(",");
        let co=cosup_arr.map(e=>e.trim());
        setProposalData({ ...proposalData, [name]: co });
    };

    const handleAddProposal = () => {
        console.log(proposalData);
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
            API.insertProposal(proposalData)
            .then(toast.success('Thesis Proposal successfully added'))
            .catch((msg)=>toast.error(msg));
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
                        <Form.Label><strong>CoSupervisors</strong>&nbsp;(separated by ',')</Form.Label>
                        <Form.Control
                            type="text"
                            name="cosupervisor"
                            value={proposalData.cosupervisor}
                            onChange={handleCoSupChange}
                        />
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
                        <Form.Label><strong>Keywords</strong>&nbsp;(separated by ',')</Form.Label>
                        <Form.Control
                            type="text"
                            name="keywords"
                            value={proposalData.keywords}
                            onChange={handleCoSupChange}
                        />
                    </Form.Group>
                    <Form.Group style={{ marginBottom: '10px' }}>
                        <Form.Label><strong>Type</strong>&nbsp;(separated by ',')</Form.Label>
                        <Form.Control
                            type="text"
                            name="type"
                            value={proposalData.type}
                            onChange={handleCoSupChange}
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
                            value={proposalData.know}
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
                    <Button style={{marginTop:'5px'}} variant="primary" onClick={handleAddProposal}>
                        Add Proposal
                    </Button><br/>
                    <Button style={{marginTop:'5px'}} variant="danger" onClick={handleResetChange}>
                        Reset Fields
                    </Button>
                </Form>
            </Card.Body>
        </Card>
    );
}

export default AddProposalForm;