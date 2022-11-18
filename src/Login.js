import React, { Component } from 'react';
import swal from 'sweetalert';
import { Button, TextField, Link, Grid, InputAdornment } from '@material-ui/core';
import { AccountCircle, LockRounded } from "@material-ui/icons";
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
      if (res.data && res.data.info) {
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
      <div>
        <Grid container style={{ minHeight: '100vh' }}>
          <Grid item xs={12} sm={6}>
            <img src="https://i0.wp.com/www.n41.com/wp-content/uploads/2022/04/N41_Web-Blog_APRIL-04-1.jpg)"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              alt="project name"
            />
          </Grid>
          <Grid container
            item xs={12}
            sm={6}
            alignItems="center"
            direction='column'
            justify='space-between'
            style={{ padding: '10' }}>
            <div />
            <div style={{ display: 'flex', flexDirection: "column", maxWidth: 400, minWidth: 300 }}>
              <h1>Login</h1>
              <TextField
                label="Email"
                margin="normal"
                type="text"
                autoComplete="off"
                name="email"
                required
                value={this.state.email}
                onChange={this.onChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position='start'>
                      <AccountCircle />
                    </InputAdornment>
                  )
                }} />
              <TextField
                label="Password"
                margin="normal"
                type="password"
                autoComplete="off"
                name="password"
                value={this.state.password}
                onChange={this.onChange}
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position='start'>
                      <AccountCircle />
                    </InputAdornment>
                  )
                }} />
              <Button
                color="primary"
                variant="contained"
                disabled={this.state.email == '' && this.state.password == ''}
                onClick={this.login}
              >
                Log In
              </Button>
              <br /><br /><br />
              <Link href="/register" style={{marginTop: '10px'}}>
                SIGNUP
              </Link>
            </div>
            <div />
          </Grid>
        </Grid>
      </div>
    );
  }
}
