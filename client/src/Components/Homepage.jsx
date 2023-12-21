import { Container, Row, Col, Navbar, Nav, Pagination } from 'react-bootstrap';
import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import { TitleBar } from './TitleBar';
import SeacrhProp from './SearchProp';
import './Homepage.css';
import { FilterContainer } from './Filters';
import AddProposalForm from './AddProposal';
import AddRequestForm from './AddRequest';
import ApplicationList from './ApplicationList';
import StudentList from './StudentList';
import MyProposal from './MyProposal';
import HandleRequest from './HandleRequest';
import ProfessorRequests from './ProfessorRequests';
import toast, { Toaster } from 'react-hot-toast';
import Clock from './Clock';
import API from '../API';




function Homepage(props) {
    
    
    // states def
    const [add, setAdd] = useState(false);
    const [req, setRequests] = useState(false);
    const [addRequest, setAddRequest] = useState(false);
    const [listA, setListA] = useState(false);
    const [propList, setPropList] = useState(true);
    const [requestClerk, setRequestClerk] = useState(true);
    const [listApplicationStud, setListApplicationStud] = useState(false);
    const [myProp, setMyProp] = useState(true);
    const [copy, setCopy] = useState(undefined);
    const [copyT, setCopyT] = useState(undefined);
    const [copyD, setCopyD] = useState(undefined);
    const [mails, setMails] = useState([]);
    const [application, setApplication] = useState({
        id_thesis: '',
        cv: ''
    });
    const [show, setShow] = useState(false);
    const handleClose = () => {setShow(false); setApplication({id_thesis: '',
    cv: ''})};
    const handleShow = () => setShow(true);
    const [filters, setFilters] = useState({title: '', supervisor: '', cosupervisor: '', expDate: '', status: '', keywords: '', type: '',
        groups: '', know: '', level: '', cds: '', creatDate: '', order: '', orderby: '', page: 1
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
        items.forEach(e => {
            if (e.key === props.active) {
              e.props.active = true;
            }
          });
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

    useEffect(()=>{
        if(props.user.role==='teacher')
            API.getCoSupervisorsEmails().then((res)=>{setMails(res);})
    }, [props.user]);

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
        if (application.cv !== '' && application.cv.type === 'application/pdf' && application.cv.size<=32*1024*1024) {
            API.applyForProposal(application).then((res) => { toast.success('Application successfully sended'); setApplication({ ...application, cv: '' }) })
                .catch((res) => toast.error(res.message));
        }
        else if(application.cv.type !== 'application/pdf')(
            toast.error('CV must be in PDF format')
        )
        else if(application.cv.size>32*1024*1024)(
            toast.error('CV size must be under 32MB')
        )
        else{
            toast.error('CV upload missing')
        }

    };

    const handleResetChange = () => {
        setFilters({ title: '', supervisor: '', cosupervisor: '', expDate: '', status: '', keywords: '', type: '', groups: '', know: '',
            level: '', cds: '', creatDate: '', order: '', orderby: ''
        });
    };

    const filterCond = (filters) => {
        return filters.order === '' 
        && filters.orderby === '' 
        || filters.order !== '' 
        && filters.orderby !== '';

    }

    const handleApplyFilters = () => {
        if (filterCond(filters)) {
            if(props.user.role === 'teacher')
                API.advancedSearchThesis({ ...filters, page: 1}).then(res => {
                props.setProposals(res[1]);
                props.setPage(res[0]);
                });
            else    
                API.advancedSearchThesis({ ...filters, page: props.active}).then(res => {
                props.setProposals(res[1]);
                props.setPage(res[0]);
                });
                
        }
        else {
            toast.error('Some Order fields are not filled');
        }
    };

    const handleCopy = (copyP) => {
        delete(copyP.id);
        delete(copyP.creation_date);
        copyP.keywords= copyP.keywords.split(',');
        copyP.type= copyP.type.split(',');
        copyP.groups= copyP.groups.split(',');
        copyP.knowledge= copyP.knowledge.split(',');
        copyP.cds= copyP.cds.split(',');
        copyP.cosupervisor= [];
        setCopy({...copyP, level: copyP.level === 1 ? 'Master' : 'Bachelor'});
        setCopyT(copyP.title);
        setCopyD(copyP.description);
        setAdd(true);
        setMyProp(false);
        setListA(false);

    };

    const navigateH = () =>{
        
            setTimeout(()=>{ setAdd(false);
            setListA(false);
            setRequests(false);
            setMyProp(true);}, 2000);

    };



    return (
        props.user.role === 'student' ? 
        propList === true && addRequest === false && listApplicationStud === false? <div id="background-div" style={{ backgroundColor: '#FAFAFA' }}>
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
                                <Nav.Link active={propList} onClick={()=> {toast.remove(); setPropList(true); setAddRequest(false); setListApplicationStud(false)}}> Proposals List</Nav.Link>
                                <Nav.Link active={addRequest} onClick={()=> {toast.remove(); setPropList(false); setAddRequest(true);  setListApplicationStud(false)}}> Add Request</Nav.Link>
                                <Nav.Link active={listApplicationStud} onClick={()=> {toast.remove(); setPropList(false); setAddRequest(false);  setListApplicationStud(true)}}> My Applications</Nav.Link>
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
        : addRequest=== true && listApplicationStud === false? <div id="background-div" style={{ backgroundColor: '#FAFAFA' }}>
            <TitleBar setIsAuth={props.setIsAuth} user={props.user} setUser={props.setUser} isAuth={props.isAuth}/>
            <Container fluid style={{ marginTop: '20px' }}>
                <Row>
                    <Col xs={3}>
                    <Navbar style={{ backgroundColor: '#fff' }} className="flex-column rounded">
                            <Nav className="flex-column">
                                <Nav.Link active={propList} onClick={()=> {toast.remove(); setPropList(true); setAddRequest(false); setListApplicationStud(false)}}> Proposals List</Nav.Link>
                                <Nav.Link active={addRequest} onClick={()=> {toast.remove(); setPropList(false); setAddRequest(true); setListApplicationStud(false)}}> Add Request</Nav.Link>
                                <Nav.Link active={listApplicationStud} onClick={()=> {toast.remove(); setPropList(false); setAddRequest(false); setListApplicationStud(true)}}> My Applications</Nav.Link>
                            </Nav>
                        </Navbar>
                        <Clock currentTime={props.currentTime} setCurrentTime={props.setCurrentTime}/>
                    </Col>
                    <Col xs={9}>
                        <div className="flex-column rounded" style={{ backgroundColor: '#fff' }} >
                            <AddRequestForm user={props.user} mails={mails}/>
                        </div>
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
                            <Nav.Link active={propList} onClick={()=> {toast.remove(); setPropList(true); setAddRequest(false); setListApplicationStud(false)}}> Proposals List</Nav.Link>
                            <Nav.Link active={addRequest} onClick={()=> {toast.remove(); setPropList(false); setAddRequest(true); setListApplicationStud(false)}}> Add Request</Nav.Link>
                            <Nav.Link active={listApplicationStud} onClick={()=> {toast.remove(); setPropList(false); setAddRequest(false); setListApplicationStud(true)}}> My Applications</Nav.Link>
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
        : props.user.role === 'teacher' ? add === true && listA === false && myProp === false && req === false? <div id="background-div" style={{ backgroundColor: '#FAFAFA' }}>
            <TitleBar setIsAuth={props.setIsAuth} user={props.user} setUser={props.setUser} isAuth={props.isAuth} />
            <Container fluid style={{ marginTop: '20px' }}>
                <Row>
                    <Col xs={3}>
                        <Navbar style={{ backgroundColor: '#fff' }} className="flex-column rounded">
                            <Nav className="flex-column">
                                <Nav.Link active={myProp} onClick={() => { toast.remove(); setAdd(false); setListA(false); setMyProp(true); setRequests(false)}}> My Proposals</Nav.Link>
                                <Nav.Link active={add} onClick={() => {toast.remove(); setAdd(true); setListA(false); setMyProp(false); setRequests(false) }}> Add Proposal</Nav.Link>
                                <Nav.Link active={listA} onClick={() => {toast.remove(); setAdd(false); setListA(true); setMyProp(false); setRequests(false) }}> Applications List</Nav.Link>
                                <Nav.Link active={req} onClick={() => {toast.remove(); setAdd(false); setListA(false); setMyProp(false); setRequests(true) }}>Proposal Requests</Nav.Link>
                            </Nav>
                        </Navbar>
                        <Clock currentTime={props.currentTime} setCurrentTime={props.setCurrentTime}/>
                    </Col>
                    <Col xs={9}>
                        <div className="flex-column rounded" style={{ backgroundColor: '#fff' }} >
                            <AddProposalForm navigateH={navigateH} user={props.user} copy={copy} setCopy={setCopy} setCopyD={setCopyD} setCopyT={setCopyT} copyD={copyD} copyT={copyT} mails={mails}/>
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
                                <Nav.Link active={myProp} onClick={() => {toast.remove(); setAdd(false); setListA(false); setMyProp(true); setRequests(false) }}> My Proposals</Nav.Link>
                                <Nav.Link active={add} onClick={() => {toast.remove(); setAdd(true); setListA(false); setMyProp(false); setRequests(false) }}> Add Proposal</Nav.Link>
                                <Nav.Link active={listA} onClick={() => {toast.remove(); setAdd(false); setListA(true); setMyProp(false); setRequests(false) }}> Applications List</Nav.Link>
                                <Nav.Link active={req} onClick={() => {toast.remove(); setAdd(false); setListA(false); setMyProp(false); setRequests(true) }}>Proposal Requests</Nav.Link>
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
        :req === true ? <div id="background-div" style={{ backgroundColor: '#FAFAFA' }}>
        <TitleBar setIsAuth={props.setIsAuth} user={props.user} setUser={props.setUser} isAuth={props.isAuth} />
        <Container fluid style={{ marginTop: '20px' }}>
            <Row>
                <Col xs={3}>
                    <Navbar style={{ backgroundColor: '#fff' }} className="flex-column rounded">
                        <Nav className="flex-column">
                            <Nav.Link active={myProp} onClick={() => {toast.remove(); setAdd(false); setListA(false); setMyProp(true); setRequests(false) }}> My Proposals</Nav.Link>
                            <Nav.Link active={add} onClick={() => {toast.remove(); setAdd(true); setListA(false); setMyProp(false); setRequests(false) }}> Add Proposal</Nav.Link>
                            <Nav.Link active={listA} onClick={() => {toast.remove(); setAdd(false); setListA(true); setMyProp(false); setRequests(false) }}> Applications List</Nav.Link>
                            <Nav.Link active={req} onClick={() => {toast.remove(); setAdd(false); setListA(false); setMyProp(false); setRequests(true) }}>Proposal Requests</Nav.Link>
                        </Nav>
                    </Navbar>
                    <Clock currentTime={props.currentTime} setCurrentTime={props.setCurrentTime}/>
                </Col>
                <Col xs={9}>
                 <ProfessorRequests user={props.user}/>
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
                            <Nav.Link active={myProp} onClick={() => {toast.remove(); setAdd(false); setListA(false); setMyProp(true); setRequests(false) }}> My Proposals</Nav.Link>
                            <Nav.Link active={add} onClick={() => {toast.remove(); setAdd(true); setListA(false); setMyProp(false); setRequests(false) }}> Add Proposal</Nav.Link>
                            <Nav.Link active={listA} onClick={() => {toast.remove(); setAdd(false); setListA(true); setMyProp(false); setRequests(false) }}> Applications List</Nav.Link>
                            <Nav.Link active={req} onClick={() => {toast.remove(); setAdd(false); setListA(false); setMyProp(false); setRequests(true) }}>Proposal Requests</Nav.Link>
                        </Nav>
                    </Navbar>
                    <Clock currentTime={props.currentTime} setCurrentTime={props.setCurrentTime}/>
                </Col>
                <Col xs={9}>
                 <FilterContainer handleApplyFilters={handleApplyFilters} filters={filters} handleFilterChange={handleFilterChange} handleFilterCoSupChange={handleFilterCoSupChange} handleResetChange={handleResetChange}></FilterContainer>
                 <MyProposal user={props.user} handleCopy={handleCopy}/>
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
                            <Nav.Link active={requestClerk} onClick={() => {toast.remove(); setRequestClerk(true) }}>Request From Student</Nav.Link>
                        </Nav>
                    </Navbar>
                    <Clock currentTime={props.currentTime} setCurrentTime={props.setCurrentTime}/>
                </Col>
                <Col xs={9}>
                 <HandleRequest user={props.user}/>
                </Col>
            </Row>
        </Container>
        </div>


    )
}

Homepage.propTypes = {
    user : PropTypes.oneOfType([PropTypes.string,
        PropTypes.object]).isRequired,
    proposals : PropTypes.array.isRequired,
    active : PropTypes.number.isRequired,
    pages : PropTypes.number.isRequired,
    currentTime : PropTypes.object.isRequired,
    isAuth : PropTypes.number.isRequired,
    setIsAuth : PropTypes.func.isRequired,
    setUser : PropTypes.func.isRequired,
    setProposals : PropTypes.func.isRequired,
    setPage : PropTypes.func.isRequired,
    setActive : PropTypes.func.isRequired,
    setCurrentTime : PropTypes.func.isRequired,
  };

export { Homepage };