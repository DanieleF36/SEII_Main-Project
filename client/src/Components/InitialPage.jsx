import 'bootstrap/dist/css/bootstrap.min.css';
import Carousel from 'react-bootstrap/Carousel';
import PropTypes from 'prop-types';
import { TitleBar } from './TitleBar';


function InitialPage(props) {





    return (
        <> 
            <TitleBar setIsAuth={props.setIsAuth} user={props.user} setUser={props.setUser} isAuth={props.isAuth}/>
            <Carousel interval={1000} fade>
                <Carousel.Item>
                    <img src="./Pol_im1.jpg"
                        alt="poli_1"
                        className="d-block mx-auto w-100" />
                </Carousel.Item>
                <Carousel.Item>
                    <img src="./Pol_im2.jpg"
                        alt="poli_2"
                        className="d-block mx-auto w-100" />
                </Carousel.Item>
                <Carousel.Item>
                    <img src="./Pol_im3.jpg"
                        alt="poli_3"
                        className="d-block mx-auto w-100" />
                </Carousel.Item>
            </Carousel>

        </>
    );
}

InitialPage.propTypes = {
    user : PropTypes.object.isRequired,
    isAuth : PropTypes.object.isRequired,
    setIsAuth : PropTypes.func.isRequired,
    setUser : PropTypes.func.isRequired,
  };

export default InitialPage;