import React, { useState, useEffect } from 'react';
import { Button, Container, Row, Col, Form, ButtonGroup } from 'react-bootstrap';
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

        if (props.currentTime) {
            let newTime = new Date(props.currentTime);
            newTime.setMinutes(newTime.getMinutes() + 1);
            props.setCurrentTime(newTime);
        }
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
        API.vc_set(newTime.toISOString().slice(0, 10) + 'T' + newTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })).then(props.setCurrentTime(newTime))
        .catch((error)=>{toast.error(error)});
       
    };

    useEffect(() => {

        const interval = setInterval(updateClock, 60000);
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


                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default Clock;