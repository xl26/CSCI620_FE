import React, { Component } from 'react';
import swal from 'sweetalert';
import { Button, TextField, Link, Grid, InputAdornment } from '@material-ui/core';
import { AccountCircle, LockRounded } from "@material-ui/icons";
import {
    Dialog, DialogActions,
  DialogTitle, DialogContent,  Select, MenuItem, InputLabel
} from '@material-ui/core';
const axios = require('axios');
const bcrypt = require('bcryptjs');
var salt = bcrypt.genSaltSync(10);

export default class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      openInventoryModal: false,
      name: '',
      desc: '',
      approx_v: '',
      ins_v: '',
      date_aq: null,
      category: '',
      file: '',
      fileName: '',
      categories: []
    };
  }
  addProduct = () => {
    const fileInput = document.querySelector("#fileInput_add");
    const file = new FormData();
    file.append('name', this.state.name);
    file.append('desc', this.state.desc);
    file.append('ins_v', this.state.ins_v);
    file.append('approx_v', this.state.approx_v);
    file.append('date_aq', this.state.date_aq);
    file.append('category', this.state.category);
    file.append('image', this.state.picUrl);

    axios.post('/api/add-product', file, {
      headers: {
        'content-type': 'multipart/form-data',
      }
    }).then((res) => {

      swal({
        text: res.data.title,
        icon: "success",
        type: "success"
      });

      this.handleInventoryClose();
      this.setState({ name: '', desc: '', ins_v: '', approx_v: '', date_aq: null, category: '', file: null, page: 1, picUrl: '' }, () => {
      });
    }).catch((err) => {
      swal({
        text: err.response.data.errorMessage,
        icon: "error",
        type: "error"
      });
      this.handleInventoryClose();
    });

  }
  handleInventoryOpen = () => {
    this.setState({
      openInventoryModal: true,
      id: '',
      name: '',
      desc: '',
      approx_v: '',
      ins_v: '',
      fileName: '',
      category: '',
      picUrl: ''
    });
  };

  handleInventoryClose = () => {
    this.setState({ openInventoryModal: false });
  };
  handlePicUpload = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("pic", e.target.files[0]);
    await axios
      .post("/api/addPicture", formData,
        {
          headers: {
            'Content-Type': 'application/json'
          }
        })
      .then((res) => { this.setState({ picUrl: res.data }); })
      .catch((error) => console.log(error.message))
  }
  onChange = (e) => this.setState({ [e.target.name]: e.target.value });

  login = () => {

    const pwd = bcrypt.hashSync(this.state.password, salt);

    axios.post('/api/login', {
      email: this.state.email,
      password: pwd,
    }).then((res) => {
      console.log(res.data.info);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user_id', res.data.info._id);
      localStorage.setItem('user_role', res.data.info.role);
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
  componentDidMount = () => {
    axios.get('/api/getCategories').then((data) => {
       this.setState({ categories: data.data.categories })
    })
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
            style={{ float: 'right' }}>
            <div />
            <div style={{ display: 'flex', flexDirection: "column", justifyContent:'space-betweenx', maxWidth: 400, minWidth: 300 }}>
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
              <br /><br /><br />
              <label><b>Want to add a new product? Click Below</b></label><br />
              <Button
              color="secondary"
              variant="contained"
              onClick={this.handleInventoryOpen}
            >
              Add a Product
            </Button>
            </div>
            <div />
          </Grid>
        </Grid>
        <Dialog
          maxWidth={'md'}
          fullWidth={true}
            open={this.state.openInventoryModal}
            onClose={this.handleInventoryClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">Add Product</DialogTitle>
            <DialogContent>
              <TextField
                id="standard-basic"
                type="text"
                autoComplete="off"
                name="name"
                value={this.state.name}
                onChange={this.onChange}
                placeholder="Product Name"
                required
              /><br />
              <TextField
                id="standard-basic"
                type="text"
                autoComplete="off"
                name="desc"
                value={this.state.desc}
                onChange={this.onChange}
                placeholder="Description"
                required
              /><br />
              <TextField
                id="standard-basic"
                type="number"
                autoComplete="off"
                name="approx_v"
                value={this.state.approx_v}
                onChange={this.onChange}
                placeholder="Approximate Price"
                required
              /><br />
              <TextField
                id="standard-basic"
                type="number"
                autoComplete="off"
                name="ins_v"
                value={this.state.ins_v}
                onChange={this.onChange}
                placeholder="Insurance value"
                required
              /><br /><br />
              <InputLabel id="demo-simple-select-filled-label">Select Category</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                name="category"
                value={this.state.category}
                onChange={this.onChange}
              >
                {this.state.categories.map((el) => {
                  return (<MenuItem value={el.name}>{el.name}</MenuItem>)
                })}
              </Select>
              <br /><br />
              <TextField
                id="date"
                label="Date Aquired"
                type="date"
                name="date_aq"
                onChange={this.onChange}
                sx={{ width: 220 }}
                InputLabelProps={{
                  shrink: true,
                }}
              />
              <br /><br />

              <div style={{display:'flex'}}>
                <Button
                  variant="contained"
                  component="label"
                  color="primary"
                > Upload
                  <input
                    id="standard-basic"
                    type="file"
                    accept="image/*"
                    name="file"
                    value={this.state.file}
                    onChange={this.handlePicUpload}
                    placeholder="File"
                    hidden
                  />
                </Button>&nbsp;
                <InputLabel id="demo-simple-select-filled-label">Image Preview:</InputLabel>
                <img src={this.state.picUrl} height={70} width={70} />
              </div>
            </DialogContent>

            <DialogActions>
              <Button onClick={this.handleInventoryClose} color="primary">
                Cancel
              </Button>
              <Button
                onClick={(e) => this.addProduct()} color="primary" autoFocus>
                Add Product
              </Button>
            </DialogActions>
          </Dialog>
      </div>
    );
  }
}
