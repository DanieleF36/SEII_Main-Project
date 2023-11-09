import { Form, Button, Alert, Container, Row, Col, Dropdown, DropdownButton, Navbar, Nav, Accordion, Badge, Card } from 'react-bootstrap';
import { useState } from 'react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { TitleBar } from './TitleBar';
import './Homepage.css';
import { FilterContainer } from './Filters';
import AddProposalForm from './AddProposal';
import API from '../API';




function Homepage(props) {

    const [add, setAdd] = useState(false);
    const [listA, setListA] = useState(false);



    const [filters, setFilters] = useState({
        title: '',
        supervisor: '',
        cosupervisor:'',
        expDate: '',
        status: '',
        keywords: '',
        type: '',
        groups: '',
        know:'',
        level: '',
        cds: '',
        creatDate: '',
        order:'',
        orderby:''
    });


    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters({ ...filters, [name]: value });
    };

    const handleFilterCoSupChange = (e) => {
        let cosup_arr = e.target.value.split(",");
        let co=cosup_arr.map(e=>e.trim());
        setFilters({ ...filters, cosupervisor: co });
    };

    const handleApplyProp = (e) => {

        //API apply proposal ( e is the selected proposal)
    };

    const handleResetChange = () => {
        setFilters({
            title: '',
            supervisor: '',
            cosupervisor:'',
            expDate: '',
            status: '',
            keywords: '',
            type: '',
            groups: '',
            know:'',
            level: '',
            cds: '',
            creatDate: '',
            order:'',
            orderby:''
        });
    };

    const handleApplyFilters = () => {
        console.log(filters);
        //API--applyFilters(filters);
    };



    return (
        props.user === 0 ? <div id="background-div" style={{ backgroundColor: '#FAFAFA' }}>
            <TitleBar user={props.user} setUser={props.setUser} />
            <Container fluid style={{ marginTop: '20px' }}>
                <Row>
                    <Col xs={3}>

                        <Navbar style={{ backgroundColor: '#fff' }} className="flex-column rounded">
                            <Nav className="flex-column">
                                <Nav.Link active={true}> Proposals List</Nav.Link>
                            </Nav>
                        </Navbar>

                    </Col>
                    <Col xs={9}>
                        <FilterContainer handleApplyFilters={handleApplyFilters} filters={filters} handleFilterChange={handleFilterChange} handleFilterCoSupChange={handleFilterCoSupChange} handleResetChange={handleResetChange}></FilterContainer>
                        <div>
                            {props.proposals.map((proposal) => (
                                <Card key={proposal.id} style={{ marginBottom: '10px' }}>
                                    <Accordion>
                                        <Accordion.Item eventKey={proposal.id}>
                                            <Accordion.Header>
                                                <div className="d-md-flex justify-content-center align-items-center">
                                                    <div>
                                                        <strong>Title:</strong> {proposal.title}&nbsp;&nbsp;&nbsp;&nbsp;
                                                    </div>
                                                    <div>
                                                        <strong>Supervisor:</strong> {proposal.supervisor}&nbsp;&nbsp;&nbsp;&nbsp;
                                                    </div>
                                                    <div>
                                                        <strong>Expiration date:</strong> {proposal.expDate}&nbsp;&nbsp;&nbsp;&nbsp;
                                                    </div>
                                                    <div>
                                                        <strong>Status:</strong>{' '}
                                                        {proposal.status === '1' ? (
                                                            <Badge pill bg="success">P</Badge>
                                                        ) : (
                                                            <Badge pill bg="danger">A</Badge>
                                                        )}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                                    </div>
                                                    <div>
                                                        <img src="./info-circle.svg"
                                                            alt="info"
                                                            className="img-responsive" />

                                                    </div>
                                                </div>
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
                                                <strong>Level:</strong> {proposal.level}
                                                <br />
                                                <strong>CdS:</strong> {proposal.cds}
                                                <br />
                                                <strong>Creation Date:</strong> {proposal.creatDate}
                                                <br />
                                                <br />
                                                {proposal.status === '1' ? <Button onClick={() => handleApplyProp(proposal)} variant='primary'>Apply</Button> : ''}
                                            </Accordion.Body>
                                        </Accordion.Item>
                                    </Accordion>
                                </Card>
                            ))}
                        </div>
                    </Col>


                </Row>

            </Container>
        </div> : add === true ? <div id="background-div" style={{ backgroundColor: '#FAFAFA' }}>
            <TitleBar user={props.user} setUser={props.setUser} />
            <Container fluid style={{ marginTop: '20px' }}>
                <Row>
                    <Col xs={3}>

                        <Navbar style={{ backgroundColor: '#fff' }} className="flex-column rounded">
                            <Nav className="flex-column">
                                <Nav.Link active={add} onClick={() => { setAdd(true); setListA(false); }}> Add Proposal</Nav.Link>
                                <Nav.Link active={listA} onClick={() => { setAdd(false); setListA(true); }}>Applications List</Nav.Link>
                            </Nav>
                        </Navbar>

                    </Col>
                    <Col xs={9}>
                        <div className="flex-column rounded" style={{ backgroundColor: '#fff' }} >
                            <AddProposalForm />
                        </div>

                    </Col>


                </Row>

            </Container>
        </div> : <div id="background-div" style={{ backgroundColor: '#FAFAFA' }}>
            <TitleBar user={props.user} setUser={props.setUser} />
            <Container fluid style={{ marginTop: '20px' }}>
                <Row>
                    <Col xs={3}>

                        <Navbar style={{ backgroundColor: '#fff' }} className="flex-column rounded">
                            <Nav className="flex-column">
                                <Nav.Link active={add} onClick={() => { setAdd(true); setListA(false); }}> Add Proposal</Nav.Link>
                                <Nav.Link active={listA} onClick={() => { setAdd(false); setListA(true); }}>Applications List</Nav.Link>
                            </Nav>
                        </Navbar>

                    </Col>
                    <Col xs={9}>
                        <div className="flex-column rounded" style={{ backgroundColor: '#fff' }} >
                            <h2>(Applications List)</h2>
                        </div>

                    </Col>


                </Row>

            </Container>
        </div>


    )
}

export { Homepage };