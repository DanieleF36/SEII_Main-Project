import { Form, Button, Alert, Container, Row, Col, Dropdown, DropdownButton, Navbar, Nav, Accordion, Badge, Card, Modal, Pagination } from 'react-bootstrap';
import { useState } from 'react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { TitleBar } from './TitleBar';
import './Homepage.css';
import { FilterContainer } from './Filters';
import AddProposalForm from './AddProposal';
import ApplicationList from './ApplicationList';
import API from '../API';




function Homepage(props) {

    const [add, setAdd] = useState(false);
    const [listA, setListA] = useState(false);
    const [active, setActive] = useState(1);


    const numPages = 5;
    let items = [];

    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);


    for (let number = 1; number <= numPages; number++) {
            items.push(
                <Pagination.Item key={number} active={number === active} onClick={()=>setActive(number)}>
                    {number}
                </Pagination.Item>
        );
    }

    const [filters, setFilters] = useState({
        title: '',
        supervisor: '',
        cosupervisor: '',
        expDate: '',
        status: '',
        keywords: '',
        type: '',
        groups: '',
        know: '',
        level: '',
        cds: '',
        creatDate: '',
        order: '',
        orderby: '',
        page: ''
    });

    useEffect(() => {
        items.map(e=>{if(e.key===active){e.props.active=true}});
        setFilters({...filters, page: active});
        //API.filter(active)
      }, [active]);

    


    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters({ ...filters, [name]: value });
    };

    const handleFilterCoSupChange = (e) => {
        let cosup_arr = e.target.value.split(",");
        let co = cosup_arr.map(e => e.trim());
        setFilters({ ...filters, cosupervisor: co });
    };

    const handleApplyProp = (e) => {

        //API apply proposal ( e is the selected proposal)
    };



    const handleResetChange = () => {
        setFilters({
            title: '',
            supervisor: '',
            cosupervisor: '',
            expDate: '',
            status: '',
            keywords: '',
            type: '',
            groups: '',
            know: '',
            level: '',
            cds: '',
            creatDate: '',
            order: '',
            orderby: ''
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
                                                            {proposal.status === '1' ? (
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
                                                <strong>Level:</strong> {proposal.level}
                                                <br />
                                                <strong>CdS:</strong> {proposal.cds}
                                                <br />
                                                <strong>Creation Date:</strong> {proposal.creatDate}
                                                <br />
                                                <br />
                                                {proposal.status === '1' ? <>
                                                    <Button variant="primary" onClick={handleShow}>
                                                        Apply
                                                    </Button>

                                                    <Modal show={show} onHide={handleClose}>
                                                        <Modal.Header closeButton>
                                                            <Modal.Title>Apply for proposal</Modal.Title>
                                                        </Modal.Header>
                                                        <Modal.Body> <Form.Group controlId="formFile" className="mb-3">
                                                            <Form.Label><strong>Upload your CV</strong></Form.Label>
                                                            <Form.Control
                                                                type="file"
                                                            //name=""
                                                            //value={proposalData.cosupervisor}
                                                            //onChange={handleCoSupChange} 
                                                            />
                                                        </Form.Group></Modal.Body>
                                                        <Modal.Footer>
                                                            <Button variant="secondary" onClick={handleClose}>
                                                                Close
                                                            </Button>
                                                            <Button variant="primary" onClick={handleClose}>
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

                    </Col>


                </Row>

                <Row className="d-md-flex justify-content-center align-items-center">
                 <Col xs='3'>
                 </Col>
                 <Col xs='9'className="d-md-flex justify-content-center align-items-center">
                 <Pagination>{items}</Pagination>
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
                            <ApplicationList />
                        </div>

                    </Col>


                </Row>

            </Container>
        </div>


    )
}

export { Homepage };