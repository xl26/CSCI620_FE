import React, { Component } from 'react';
import swal from 'sweetalert';
import { Button, TextField, Link,Grid } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
const axios = require('axios');

export default class Register extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fName: '',
      lName: '',
      email: '',
      role: '',
      password: '',
      confirm_password: ''
    };
  }
  

  onChange = (e) => this.setState({ [e.target.name]: e.target.value });

  register = () => {

    axios.post('http://54.241.142.245/api/register', {
      F_name: this.state.fName,
      L_name: this.state.lName,
      email: this.state.email,
      password: this.state.password
    }).then((res) => {
      swal({
        text: res.data.title,
        icon: "success",
        type: "success"
      });
      this.props.history.push('/');
    }).catch((err) => {
      swal({
        text: err.response.data.errorMessage,
        icon: "error",
        type: "error"
      });
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
            <div style={{ display: 'flex', flexDirection: "column", justifyContent: "space-between", maxWidth: 400, minWidth: 300 }}>
              <h1>Register</h1>
              <TextField
                
                type="text"
                autoComplete="off"
                name="fName"
                value={this.state.fName}
                onChange={this.onChange}
                placeholder="First Name"
                required
              />
              <br /><br />
              <TextField
                
                type="text"
                autoComplete="off"
                name="lName"
                value={this.state.lName}
                onChange={this.onChange}
                placeholder="Last Name"
                required
              />
              <br /><br />
              <TextField
                
                type="text"
                autoComplete="off"
                name="email"
                value={this.state.email}
                onChange={this.onChange}
                placeholder="Email"
                required
              />
              <br /><br /><br /><br />
              <FormControl style={{marginTop: '10px'}} variant="outlined">
                <InputLabel htmlFor="outlined-age-native-simple">Role</InputLabel>
                <Select
                  native
                  value={this.state.role}
                  onChange={this.onChange}
                  label="Age"
                  name="role"
                  inputProps={{
                    name: 'role',
                    id: 'outlined-age-native-simple',
                  }}
                >
                  <option aria-label="None" value="" />
                  <option value={'user'}>User</option>
                  <option value={'admin'}>Admin</option>
                </Select>
              </FormControl>
              <TextField
                
                type="password"
                autoComplete="off"
                name="password"
                value={this.state.password}
                onChange={this.onChange}
                placeholder="Password"
                required
              />
              <br /><br />
              <TextField
                
                type="password"
                autoComplete="off"
                name="confirm_password"
                value={this.state.confirm_password}
                onChange={this.onChange}
                placeholder="Confirm Password"
                required
              />
              <Button
                className="button_style"
                variant="contained"
                color="primary"
                size="small"
                style={{marginTop: '10px'}}
                disabled={this.state.username == '' && this.state.password == ''}
                onClick={this.register}
              >
                Register
              </Button> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              <Link href="/">
                Login
              </Link>
            </div>
            <div />
          </Grid>
        </Grid>
      </div>
    );
  }
}
