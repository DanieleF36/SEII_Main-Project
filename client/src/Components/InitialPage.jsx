import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Carousel from 'react-bootstrap/Carousel';
import { TitleBar } from './TitleBar';
import { useState, useEffect } from 'react';

function InitialPage(props) {





    return (
        <> 
            <TitleBar setIsAuth={props.setIsAuth} user={props.user} setUser={props.setUser} isAuth={props.isAuth}/>
            <Carousel interval={1000} fade>
                <Carousel.Item>
                    <img src="./Pol_im1.jpg"
                        className="d-block mx-auto w-100" />
                </Carousel.Item>
                <Carousel.Item>
                    <img src="./Pol_im2.jpg"
                        className="d-block mx-auto w-100" />
                </Carousel.Item>
                <Carousel.Item>
                    <img src="./Pol_im3.jpg"
                        className="d-block mx-auto w-100" />
                </Carousel.Item>
            </Carousel>

        </>
    );
}

export default InitialPage;