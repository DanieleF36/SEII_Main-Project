import { Container, Row, Col, Navbar, Nav, Pagination } from 'react-bootstrap';
import { useState } from 'react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { TitleBar } from './TitleBar';
import SeacrhProp from './SearchProp';
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
    
    // states def
    const [add, setAdd] = useState(false);
    const [listA, setListA] = useState(false);
    const [propList, setPropList] = useState(true);
    const [listApplicationStud, setListApplicationStud] = useState(false);
    const [myProp, setMyProp] = useState(true);
    const navigate = useNavigate();
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const [filters, setFilters] = useState({title: '', supervisor: '', cosupervisor: '', expDate: '', status: '', keywords: '', type: '',
        groups: '', know: '', level: '', cds: '', creatDate: '', order: '', orderby: '', page: 1
    });
    const [application, setApplication] = useState({
        id_thesis: '',
        cv: ''
    });
    
    //pagination items def
    let items = [];
    for (let number = 1; number <= props.pages; number++) {
        items.push(
            <Pagination.Item key={number} active={number === props.active} onClick={() => { props.setActive(number); setFilters({ ...filters, page: number }); }}>
                {number}
            </Pagination.Item>
        );
    }
  
    //useEffects

    useEffect(() => {
        items.map(e => { if (e.key === props.active) { e.props.active = true } });
        if(props.user.role === 'student'){
        API.advancedSearchThesis({...filters, page: props.active}).then(res => {
            props.setProposals(res[1]);
            props.setPage(res[0]);
        });}
    }, [props.active]);


    useEffect(() => {
        API.userAuthenticated().then(user => {
            props.setUser(user);
            props.setIsAuth(1);
            if(user.role === 'student'){
            API.advancedSearchThesis({...filters, page: props.active}).then(res=>{
                props.setProposals(res[1]);
                props.setPage(res[0]);
              });
            }
        })
    }, [props.currentTime]);

    //handleFunctions

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
            API.applyForProposal(application).then((res) => { toast.success('Application successfully sended'); setApplication({ ...application, cv: '' }) })
                .catch((res) => toast.error(res.error));
        }
        else (
            toast.error('CV upload missing')
        )

    };

    const handleResetChange = () => {
        setFilters({ title: '', supervisor: '', cosupervisor: '', expDate: '', status: '', keywords: '', type: '', groups: '', know: '',
            level: '', cds: '', creatDate: '', order: '', orderby: ''
        });
    };

    const handleApplyFilters = () => {
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
                        <SeacrhProp proposals={props.proposals} handleShow={handleShow} setApplication={setApplication} application={application} show={show} handleClose={handleClose} handleApplyChange={handleApplyChange} handleApplyProp={handleApplyProp}/>
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
                            <StudentList user={props.user}/>
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
                            <AddProposalForm user={props.user}/>
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
                            <ApplicationList user={props.user}/>
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
                 <MyProposal user={props.user} />
                </Col>
            </Row>
        </Container>
    </div>


    )
}

export { Homepage };