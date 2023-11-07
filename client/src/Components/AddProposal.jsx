import React, { useState } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';

function AddProposalForm() {
    const [proposalData, setProposalData] = useState({
        title: '',
        supervisor: '',
        expDate: '',
        keywords: '',
        type: '',
        groups: '',
        description: '',
        know: '',
        note: '',
        level: '',
        cds: '',
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setProposalData({ ...proposalData, [name]: value });
    };

    const handleCheckboxChange = (selectedLevel) => {
        setProposalData({ ...proposalData, level: selectedLevel });
      };

    const handleAddProposal = () => {
        // Implement the logic to add the proposal using the proposalData state- API
    };

    return (
        <Card>
            <Card.Body>
                <h2>Thesis Proposal</h2>
                <Form>
                    <Form.Group style={{ marginBottom: '10px', marginTop:'20px' }}>
                        <Form.Label><strong>Title</strong></Form.Label>
                        <Form.Control
                            type="text"
                            name="title"
                            value={proposalData.title}
                            onChange={handleInputChange}
                        />
                    </Form.Group>
                    <Form.Group style={{ marginBottom: '10px' }}>
                        <Form.Label><strong>Supervisor</strong></Form.Label>
                        <Form.Control
                            type="text"
                            name="supervisor"
                            value={proposalData.supervisor}
                            onChange={handleInputChange}
                        />
                    </Form.Group>
                    <Form.Group style={{ marginBottom: '10px' }}>
                        <Form.Label><strong>Expiration Date</strong></Form.Label>
                        <Form.Control
                            type="date"
                            name="expDate"
                            value={proposalData.expDate}
                            onChange={handleInputChange}
                        />
                    </Form.Group>
                    <Form.Group style={{ marginBottom: '10px' }}>
                        <Form.Label><strong>Keywords</strong></Form.Label>
                        <Form.Control
                            type="text"
                            name="keywords"
                            value={proposalData.keywords}
                            onChange={handleInputChange}
                        />
                    </Form.Group>
                    <Form.Group style={{ marginBottom: '10px' }}>
                        <Form.Label><strong>Type</strong></Form.Label>
                        <Form.Control
                            type="text"
                            name="type"
                            value={proposalData.type}
                            onChange={handleInputChange}
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
                            name="know"
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
                    <Button variant="primary" onClick={handleAddProposal}>
                        Add Proposal
                    </Button>
                </Form>
            </Card.Body>
        </Card>
    );
}

export default AddProposalForm;