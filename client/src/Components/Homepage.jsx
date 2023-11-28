import { Form, Button, Alert, Container, Row, Col, Dropdown, DropdownButton, Navbar, Nav, Accordion, Badge, Card, Modal, Pagination } from 'react-bootstrap';
import { useState } from 'react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { TitleBar } from './TitleBar';
import './Homepage.css';
import { FilterContainer } from './Filters';
import AddProposalForm from './AddProposal';
import ApplicationList from './ApplicationList';
import StudentList from './StudentList';
import MyProposal from './MyProposal';
import toast, { Toaster } from 'react-hot-toast';
import Clock from './Clock';
import API from '../API';




function Homepage(props) {

    const [add, setAdd] = useState(false);
    const [listA, setListA] = useState(false);
    const [propList, setPropList] = useState(true);
    const [listApplicationStud, setListApplicationStud] = useState(false);
    const [myProp, setMyProp] = useState(true);
    const [active, setActive] = useState(1);

    let items = [];

    const navigate = useNavigate();

    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);


    for (let number = 1; number <= props.pages; number++) {
        //console.log(props.pages);
        items.push(
            <Pagination.Item key={number} active={number === props.active} onClick={() => { props.setActive(number); setFilters({ ...filters, page: number }); }}>
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
        page: 1
    });

    const [application, setApplication] = useState({
        id_thesis: '',
        cv: ''
    });

    useEffect(() => {
        if(props.isAuth===0){
            navigate('/');
        }
        items.map(e => { if (e.key === props.active) { e.props.active = true } });
        //console.log(filters);
        API.advancedSearchThesis({...filters, page: props.active}).then(res => {
            props.setProposals(res[1]);
            props.setPages(res[0]);
        });
    }, [props.active]);


    useEffect(() => {
        API.userAuthenticated().then(user => {
            console.log(user);
            props.setUser(user);
            props.setIsAuth(1);
        }).catch(console.log('errore'));
    }, []);

    useEffect(() => {
        handleResetChange();
    }, [props.user]);


    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters({ ...filters, [name]: value });
    };

    const handleFilterCoSupChange = (e) => {
        let name = e.target.name;
        let cosup_arr = e.target.value.split(",");
        let co = cosup_arr.map(e => e.trim());
        setFilters({ ...filters, [name]: co });
    };

    const handleApplyChange = (e) => {

        let name = e.target.name;
        let file = e.target.files[0];
        setApplication({ ...application, [name]: file });
    };

    const handleApplyProp = () => {
        if (application.cv !== '') {
            //console.log(application);
            API.applyForProposal(application).then((res) => { toast.success('Application successfully sended'); setApplication({ ...application, cv: '' }) })
                .catch((res) => console.log(res));

        }
        else (
            toast.error('CV upload missing')
        )

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
        //console.log(filters);
        if (filters.order === '' && filters.orderby === '' || filters.order !== '' && filters.orderby !== '') {
            API.advancedSearchThesis({ ...filters, page: props.active}).then(res => {
                props.setProposals(res[1]);
                props.setPages(res[0]);
            });
        }
        else {
            toast.error('Some Order fields are not filled');
        }
    };



    return (
        props.user.role === 'student' ? 
        propList === true? <div id="background-div" style={{ backgroundColor: '#FAFAFA' }}>
            <TitleBar setIsAuth={props.setIsAuth} user={props.user} setUser={props.setUser} isAuth={props.isAuth}/>
            <Toaster
                position="top-center"
                reverseOrder={false}
            />
            <Container fluid style={{ marginTop: '20px' }}>
                <Row>
                    <Col xs={3}>

                        <Navbar style={{ backgroundColor: '#fff' }} className="flex-column rounded">
                            <Nav className="flex-column">
                                <Nav.Link active={propList} onClick={()=> {toast.remove(); setPropList(true); setListApplicationStud(false)}}> Proposals List</Nav.Link>
                                <Nav.Link active={listApplicationStud} onClick={()=> {toast.remove(); setPropList(false); setListApplicationStud(true)}}> My Applications</Nav.Link>
                            </Nav>
                        </Navbar>

                        <Clock currentTime={props.currentTime} setCurrentTime={props.setCurrentTime}/>



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
                                                            {proposal.status === 1 ? (
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
                                                <strong>Level:</strong> {proposal.level === 1 ? 'Master' : 'Bachelor'}
                                                <br />
                                                <strong>CdS:</strong> {proposal.cds}
                                                <br />
                                                <strong>Creation Date:</strong> {proposal.creatDate}
                                                <br />
                                                <br />
                                                {proposal.status === 1 ? <>
                                                    <Button variant="primary" onClick={() => { handleShow(); setApplication({ ...application, id_thesis: proposal.id }); }}>
                                                        Apply
                                                    </Button>

                                                    <Modal show={show} onHide={handleClose}>
                                                        <Modal.Header closeButton>
                                                            <Modal.Title>Apply for proposal</Modal.Title>
                                                        </Modal.Header>
                                                        <Modal.Body>
                                                            <Form.Group controlId="formFile" className="mb-3">
                                                                <Form.Label><strong>Upload your CV</strong></Form.Label>
                                                                <Form.Control
                                                                    type="file"
                                                                    name="cv"
                                                                    onChange={handleApplyChange}
                                                                />
                                                            </Form.Group>
                                                        </Modal.Body>
                                                        <Modal.Footer>
                                                            <Button variant="secondary" onClick={handleClose}>
                                                                Close
                                                            </Button>
                                                            <Button variant="primary" onClick={() => { handleClose(); handleApplyProp(); }}>
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
                    <Col xs='9' className="d-md-flex justify-content-center align-items-center">
                        <Pagination>{items}</Pagination>
                    </Col>

                </Row>


            </Container>
        </div> 
        : <div id="background-div" style={{ backgroundColor: '#FAFAFA' }}>
            <TitleBar setIsAuth={props.setIsAuth} user={props.user} setUser={props.setUser} isAuth={props.isAuth}/>
            <Container fluid style={{ marginTop: '20px' }}>
                <Row>
                    <Col xs={3}>

                    <Navbar style={{ backgroundColor: '#fff' }} className="flex-column rounded">
                            <Nav className="flex-column">
                                <Nav.Link active={propList} onClick={()=> {toast.remove(); setPropList(true); setListApplicationStud(false)}}> Proposals List</Nav.Link>
                                <Nav.Link active={listApplicationStud} onClick={()=> {toast.remove(); setPropList(false); setListApplicationStud(true)}}> My Applications</Nav.Link>
                            </Nav>
                        </Navbar>
                        <Clock currentTime={props.currentTime} setCurrentTime={props.setCurrentTime}/>

                    </Col>
                    <Col xs={9}>
                        <div className="flex-column rounded" style={{ backgroundColor: '#fff' }} >
                            <StudentList />
                        </div>

                    </Col>


                </Row>

            </Container>
        </div>
        : add === true && listA === false && myProp === false? <div id="background-div" style={{ backgroundColor: '#FAFAFA' }}>
            <TitleBar setIsAuth={props.setIsAuth} user={props.user} setUser={props.setUser} isAuth={props.isAuth} />
            <Container fluid style={{ marginTop: '20px' }}>
                <Row>
                    <Col xs={3}>

                        <Navbar style={{ backgroundColor: '#fff' }} className="flex-column rounded">
                            <Nav className="flex-column">
                                <Nav.Link active={myProp} onClick={() => { toast.remove(); setAdd(false); setListA(false); setMyProp(true) }}> My Proposals</Nav.Link>
                                <Nav.Link active={add} onClick={() => {toast.remove(); setAdd(true); setListA(false); setMyProp(false) }}> Add Proposal</Nav.Link>
                                <Nav.Link active={listA} onClick={() => {toast.remove(); setAdd(false); setListA(true); setMyProp(false) }}> Applications List</Nav.Link>
                            </Nav>
                        </Navbar>
                        <Clock currentTime={props.currentTime} setCurrentTime={props.setCurrentTime}/>

                    </Col>
                    <Col xs={9}>
                        <div className="flex-column rounded" style={{ backgroundColor: '#fff' }} >
                            <AddProposalForm />
                        </div>

                    </Col>


                </Row>

            </Container>
        </div> 
        : listA === true && myProp === false ? <div id="background-div" style={{ backgroundColor: '#FAFAFA' }}>
            <TitleBar setIsAuth={props.setIsAuth} user={props.user} setUser={props.setUser} isAuth={props.isAuth} />
            <Container fluid style={{ marginTop: '20px' }}>
                <Row>
                    <Col xs={3}>

                        <Navbar style={{ backgroundColor: '#fff' }} className="flex-column rounded">
                            <Nav className="flex-column">
                                <Nav.Link active={myProp} onClick={() => {toast.remove(); setAdd(false); setListA(false); setMyProp(true) }}> My Proposals</Nav.Link>
                                <Nav.Link active={add} onClick={() => {toast.remove(); setAdd(true); setListA(false); setMyProp(false) }}> Add Proposal</Nav.Link>
                                <Nav.Link active={listA} onClick={() => {toast.remove(); setAdd(false); setListA(true); setMyProp(false) }}> Applications List</Nav.Link>
                            </Nav>
                        </Navbar>
                        <Clock currentTime={props.currentTime} setCurrentTime={props.setCurrentTime}/>

                    </Col>
                    <Col xs={9}>

                        <div className="flex-column rounded" style={{ backgroundColor: '#fff' }} >
                            <ApplicationList />
                        </div>

                    </Col>


                </Row>

            </Container>
        </div>
        : <div id="background-div" style={{ backgroundColor: '#FAFAFA' }}>
        <TitleBar setIsAuth={props.setIsAuth} user={props.user} setUser={props.setUser} isAuth={props.isAuth} />
        <Container fluid style={{ marginTop: '20px' }}>
            <Row>
                <Col xs={3}>
                

                    <Navbar style={{ backgroundColor: '#fff' }} className="flex-column rounded">
                        <Nav className="flex-column">
                            <Nav.Link active={myProp} onClick={() => {toast.remove(); setAdd(false); setListA(false); setMyProp(true) }}> My Proposals</Nav.Link>
                            <Nav.Link active={add} onClick={() => {toast.remove(); setAdd(true); setListA(false); setMyProp(false) }}> Add Proposal</Nav.Link>
                            <Nav.Link active={listA} onClick={() => {toast.remove(); setAdd(false); setListA(true); setMyProp(false) }}> Applications List</Nav.Link>
                        </Nav>
                    </Navbar>

                    <Clock currentTime={props.currentTime} setCurrentTime={props.setCurrentTime}/>

                </Col>
                <Col xs={9}>

                   
                        <MyProposal />

                </Col>


            </Row>

        </Container>

    </div>


    )
}

export { Homepage };