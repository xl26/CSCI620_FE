import React, { Component } from 'react';
import swal from 'sweetalert';
import { Button, TextField, Link } from '@material-ui/core';
const axios = require('axios');
const bcrypt = require('bcryptjs');
var salt = bcrypt.genSaltSync(10);

export default class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: ''
    };
  }

  onChange = (e) => this.setState({ [e.target.name]: e.target.value });

  login = () => {

    const pwd = bcrypt.hashSync(this.state.password, salt);

    axios.post('http://54.241.142.245/api/login', {
      email: this.state.email,
      password: pwd,
    }).then((res) => {
      console.log(res.data.info);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user_id', res.data.id);
      if(res.data && res.data.info)
      {
        localStorage.setItem('username', `${res.data.info.F_name} ${res.data.info.L_name}`);
      }
      
      this.props.history.push('/dashboard');
    }).catch((err) => {
      if (err.response && err.response.data && err.response.data.errorMessage) {
        swal({
          text: err.response.data.errorMessage,
          icon: "error",
          type: "error"
        });
      }
    });
  }

  render() {
    return (
      <div style={{ margin: "0px",
        padding: "0px",
        height: "100vh",
        width:"100vw",
        boxSizing:"border-box",
        backgroundSize:"contain",
        backgroundRepeat:'no-repeat',
        backgroundPosition:"center",
        backgroundImage:
              "url(https://i0.wp.com/www.n41.com/wp-content/uploads/2022/04/N41_Web-Blog_APRIL-04-1.jpg)" }}>
        <div>
          <h2>Login</h2>
        </div>

        <div>
          <TextField
            id="standard-basic"
            type="text"
            autoComplete="off"
            name="email"
            value={this.state.email}
            onChange={this.onChange}
            placeholder="Email"
            required
          />
          <br /><br />
          <TextField
            id="standard-basic"
            type="password"
            autoComplete="off"
            name="password"
            value={this.state.password}
            onChange={this.onChange}
            placeholder="Password"
            required
          />
          <br /><br />
          <Button
            className="button_style"
            variant="contained"
            color="primary"
            size="small"
            disabled={this.state.email == '' && this.state.password == ''}
            onClick={this.login}
          >
            Login
          </Button> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          <Link href="/register">
            Register
          </Link>
        </div>
      </div>
    );
  }
}
