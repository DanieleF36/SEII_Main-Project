import React, { useState, useEffect } from 'react';
import { Button, Container, Row, Col, Form, ButtonGroup } from 'react-bootstrap';
import API from '../API';
import './TitleBar.css';

const Clock = (props) => {

    const updateClock = () => {
        //API.getTime().then(...
        //const dateString = "2023-11-23|13:51";
        //const [datePart, timePart] = dateString.split("T");
        //const [year, month, day] = datePart.split("-").map(Number);
        //const [hours, minutes] = timePart.split(":").map(Number);
        //const dateObject = new Date(year, month - 1, day, hours, minutes);
        // props.setCurrentTime(dateObject)).catch(...)

        API.vc_get().then((time)=>{const [date, hour] = time.split('T'); const [year, month, day] = date.split('-').map(Number); const [hh, min] = hour.split(':').map(Number);
        props.setCurrentTime(new Date(year, month-1, day, hh, min)) });
    }; 

    const addTime = (unit, value) => {
        const newTime = new Date(props.currentTime);

        switch (unit) {
            case 'minute':
                newTime.setMinutes(newTime.getMinutes() + value);
                break;
            case 'hour':
                newTime.setHours(newTime.getHours() + value);
                break;
            case 'day':
                newTime.setDate(newTime.getDate() + value);
                break;
            case 'month':
                newTime.setMonth(newTime.getMonth() + value);
                break;
            case 'year':
                newTime.setFullYear(newTime.getFullYear() + value);
                break;
            default:
                return;
        }
        API.vc_set(newTime.toISOString().slice(0, 10) + 'T' + newTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })).
        then(()=> {props.setCurrentTime(newTime);})
        .catch();
       
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

export default Clock;