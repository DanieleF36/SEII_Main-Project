import React, { useEffect } from 'react';
import { Button, Container, Row, Col, Form, ButtonGroup } from 'react-bootstrap';
import API from '../API';
import PropTypes from 'prop-types';
import './TitleBar.css';
import dayjs from 'dayjs';

const Clock = (props) => {

    const updateClock = () => {
        API.vc_get().then((time)=>{const [date, hour] = time.split('T'); const [year, month, day] = date.split('-').map(Number); const [hh, min] = hour.split(':').map(Number);
        props.setCurrentTime(new Date(year, month-1, day, hh, min)) });
    }; 

    const addTime = (unit, value) => {
        let newTime = dayjs(props.currentTime);

        switch (unit) {
            case 'minute':
                newTime = newTime.add(value, 'minute');
                break;
            case 'hour':
                newTime = newTime.add(value, 'hour');
                break;
            case 'day':
                newTime = newTime.add(value, 'day');
                break;
            case 'month':
                newTime = newTime.add(value, 'month');
                break;
            case 'year':
                newTime = newTime.add(value, 'year');
                break;
            default:
                return;
        }

        const formattedTime = newTime.format('YYYY-MM-DDTHH:mm');
        
        API.vc_set(formattedTime)
            .then(() => {
                props.setCurrentTime(newTime.toDate());
            })
    };

    const handleRestore = () =>{

        API.vc_restore().then(props.setCurrentTime(new Date()));
    }

    useEffect(() => {

        const interval = setInterval(updateClock, 10000);
        return () => clearInterval(interval);


    }, [props.currentTime]);


    return (
        <div className='d-none d-lg-block' style={{ marginTop: '10px', backgroundColor: '#ffff' }}>
            <Container>
                <Row>
                    <Col className="text-center">
                        < br />
                        <h6>Virtual Clock</h6>
                        <div id="clock" className="my-4">
                            <Form.Control
                                type="text"
                                readOnly
                                value={props.currentTime.toISOString().slice(0, 10) + '  ' + props.currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                className='text-center'
                            ></Form.Control>

                        </div>

                        <ButtonGroup aria-label="Basic example">

                            <Button onClick={() => addTime('year', 1)} className="my-2 btn-col">
                                + YYYY
                            </Button>
                            <Button onClick={() => addTime('month', 1)} className="my-2 btn-col">
                                + MM
                            </Button>
                            <Button onClick={() => addTime('day', 1)} className="my-2 btn-col">
                                + DD
                            </Button>

                        </ButtonGroup>

                        <br />

                        <ButtonGroup aria-label="Basic example">
                            <Button onClick={() => addTime('hour', 1)} className="my-2 btn-col">
                                + hh
                            </Button>
                            <Button onClick={() => addTime('minute', 1)} className="my-2 btn-col">
                                + mm
                            </Button>

                        </ButtonGroup>
                        < br/>

                        <ButtonGroup aria-label="Basic example">
                            <Button onClick={() => handleRestore()} variant='danger' className="my-2">
                                <img src='./arrow-counterclockwise.svg'
                                 alt="Logo"
                                 className="img-responsive"/>
                            </Button>
                        </ButtonGroup>


                    </Col>
                </Row>
            </Container>
        </div>
    );
};

Clock.propTypes = {
    currentTime : PropTypes.object.isRequired,
    setCurrentTime : PropTypes.func.isRequired,
  };

export default Clock;