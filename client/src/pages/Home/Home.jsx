import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { KeyboardArrowUp } from '@mui/icons-material'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Footer from './components/Footer'
import Features from './components/Features'
import Testimonials from './components/Testimonials'
import Benefits from './components/Benifits'
import About from './components/About'
import SignUp from '../../components/SignUp'
import SignIn from '../../components/SignIn'
import Faq from './components/Faq'

import {jwtDecode} from "jwt-decode"

const ScrollToTop = styled.div`
  position: fixed;
  bottom: 40px;
  right: 40px;
  height: 50px;
  width: 50px;
  background: #854CE6;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
  opacity: ${({ show }) => (show ? '1' : '0')};
  visibility: ${({ show }) => (show ? 'visible' : 'hidden')};
  transform: translateY(${({ show }) => (show ? '0' : '20px')});
  transition: all 0.3s ease-in-out;
  z-index: 2;

  &:hover {
    background: #9361F6;
    transform: translateY(-5px);
  }

  @media (max-width: 768px) {
    bottom: 20px;
    right: 20px;
    height: 40px;
    width: 40px;
  }
`;

const Body = styled.div`
    background: #13111C;
    display: flex;
    justify-content: center;
    overflow-x: hidden;
`

const Container = styled.div`
    width: 100%;
    background-Image: linear-gradient(38.73deg, rgba(204, 0, 187, 0.25) 0%, rgba(201, 32, 184, 0) 50%), linear-gradient(141.27deg, rgba(0, 70, 209, 0) 50%, rgba(0, 70, 209, 0.25) 100%);    
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    position: -webkit-sticky;
    position: sticky;
    top: 0;
    z-index: 1;
`

const Top = styled.div`
    width: 100%;
    display: flex;
    padding-bottom: 50px;
    flex-direction: column;
    align-items: center;
    background: linear-gradient(38.73deg, rgba(204, 0, 187, 0.15) 0%, rgba(201, 32, 184, 0) 50%), linear-gradient(141.27deg, rgba(0, 70, 209, 0) 50%, rgba(0, 70, 209, 0.15) 100%);
    clip-path: polygon(0 0, 100% 0, 100% 100%,50% 95%, 0 100%);
    @media (max-width: 768px) {
        clip-path: polygon(0 0, 100% 0, 100% 100%,50% 98%, 0 100%);
        padding-bottom: 0px;
    }
`;

const Content = styled.div`
    width: 100%;
    height: 100%;
    background: #13111C;
    display: flex;
    flex-direction: column;
`

const Home = () => {
    const [SignInOpen, setSignInOpen] = React.useState(false);
    const [SignUpOpen, setSignUpOpen] = React.useState(false);
    const [showScroll, setShowScroll] = useState(false);

    useEffect(() => {
        const checkScrollTop = () => {
            if (!showScroll && window.scrollY > 400) {
                setShowScroll(true);
            } else if (showScroll && window.scrollY <= 400) {
                setShowScroll(false);
            }
        };

        window.addEventListener('scroll', checkScrollTop);
        return () => window.removeEventListener('scroll', checkScrollTop);
    }, [showScroll]);

    useEffect(()=>{
        const token=localStorage.getItem("token");
        if(token){
            //decode token jwt
            const decoded=jwtDecode(token);
            const currentTime=Date.now()/1000;
            if(decoded.exp<currentTime){
                localStorage.clear();
                window.location.href="/";
            }
        }else{
            localStorage.clear();
        }
    })

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    return (
        <><Navbar setSignInOpen={setSignInOpen} />
        <Body>
            <Container>
                <Top id="home">
                    
                    <Hero setSignInOpen={setSignInOpen} />
                </Top>
                <Content>
                    <Features />
                    <Benefits />
                    <Testimonials />
                    <Faq />
                    <About />
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <Footer />
                    </div>
                </Content>
                {SignUpOpen && (
                    <SignUp setSignUpOpen={setSignUpOpen} setSignInOpen={setSignInOpen} />
                )}
                {SignInOpen && (
                    <SignIn setSignInOpen={setSignInOpen} setSignUpOpen={setSignUpOpen} />
                )}
                <ScrollToTop show={showScroll} onClick={scrollToTop}>
                    <KeyboardArrowUp style={{ color: 'white', fontSize: '28px' }} />
                </ScrollToTop>
            </Container>
        </Body>
        </>
    )
}

export default Home