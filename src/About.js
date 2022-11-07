import React, { Component } from 'react';

export default class About extends React.Component {
    logOut = () => {
        localStorage.setItem('token', null);
        this.props.history.push('/');
      }
    render() {
        return (
            <div>
                <div className="navbar">
                    <div className="nav-item">Welcome {localStorage.getItem("username")}</div>
                    <a className="button_style nav-item"
                        variant="contained"
                        size="small" href="/dashboard">
                        Dashboard
                    </a>
                    <a
                        className="button_style nav-item"
                        variant="contained"
                        size="small"
                        onClick={this.logOut}
                        style={{ cursor: 'pointer' }}
                    >
                        Log Out
                    </a>
                </div>
                <h1>Team Members</h1>
                <ol>
                    <li>
                        <h4 style={{ textAlign: 'left' }}>Sahil Dayanand Shetty</h4>
                        <div style={{ textAlign: 'left' }}>
                            <img height={120} width={120} src='https://firebasestorage.googleapis.com/v0/b/csci620-a1435.appspot.com/o/IMG_1493.jpg?alt=media&token=2a7c6a26-a01d-49d7-b413-ffb199bf85b9' />
                        </div>
                        <p style={{ textAlign: 'left' }}> Grad student at Chico state with majoring in Computer science. Enjoy travelling and exploring new places. Passionate about all kinds of sports especially Hockey and football.</p>
                    </li>
                    <li>
                        <h4 style={{ textAlign: 'left' }}>Keerthana Gopal Seenivasan</h4>
                        <div style={{ textAlign: 'left' }}>
                            <img height={120} width={120} src='https://firebasestorage.googleapis.com/v0/b/csci620-a1435.appspot.com/o/IMG_0623.jpg?alt=media&token=739657dc-44cc-4171-976b-c43ce2048093' />
                        </div>
                        <p style={{ textAlign: 'left' }}>Hi, I am Keerthana Gopal Seenivasan, a graduate student majoring in Computer Science.
                            I am a person who has always had a profound passion and fascination for areas requiring an analytical approach.
                            My hobbies mostly lie towards reading novels, dancing and enjoy cooking!
                        </p>
                    </li>
                    <li>
                        <h4 style={{ textAlign: 'left' }}>Sarthak Mishra</h4>
                        <div style={{ textAlign: 'left' }}>
                            <img height={120} width={120} src='https://firebasestorage.googleapis.com/v0/b/csci620-a1435.appspot.com/o/IMG_1186.jpg?alt=media&token=8f7f4ec4-4b8c-4f16-ac66-c8d930d06736' />
                        </div>
                        <p style={{ textAlign: 'left' }}>I am from India. I am a final year graduate student at Chico State. I love to have deep meaningful converstations with anyone and everyone.
                            I am a die hard Arsenal(football) fan. I love to cook, I feel its the best therapy for anyone. I am pretty much bugged by cybersecurity at the moment and would like to pursue my career there.
                            I have worked in the computer industry for 4-5 years back home, before I decided to take the leap of pursuing my Masters in the US.
                        </p>
                    </li>
                </ol>
            </div>
        );
    }
}