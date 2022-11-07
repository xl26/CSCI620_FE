import React, { Component } from 'react';
import {
  Button, TextField, Dialog, DialogActions, LinearProgress,
  DialogTitle, DialogContent, TableBody, Table,
  TableContainer, TableHead, TableRow, TableCell, Link
} from '@material-ui/core';
import { Pagination } from '@material-ui/lab';
import swal from 'sweetalert';
import "./Dashboard.css"
const axios = require('axios');
export default class Dashboard extends Component {
  constructor() {
    super();
    this.state = {
      token: '',
      openInventoryModal: false,
      openInventoryEditModal: false,
      id: '',
      name: '',
      desc: '',
      approx_v: '',
      ins_v: '',
      date_aq: null,
      file: '',
      fileName: '',
      page: 1,
      search: '',
      products: [],
      pages: 0,
      loading: false,
      picUrl: ''
    };
  }

  componentDidMount = () => {
    let token = localStorage.getItem('token');
    if (!token) {
      this.props.history.push('/login');
    } else {
      this.setState({ token: token }, () => {
        this.getInventory();
      });
    }
  }

  getInventory = () => {

    this.setState({ loading: true });

    let data = '?';
    data = `${data}page=${this.state.page}`;
    if (this.state.search) {
      data = `${data}&search=${this.state.search}`;
    }
    axios.get(`http://54.241.142.245/api/get-product${data}`, {
      headers: {
        'token': this.state.token
      }
    }).then((res) => {
      this.setState({ loading: false, products: res.data.products, pages: res.data.pages });
    }).catch((err) => {
      swal({
        text: err.response.data.errorMessage,
        icon: "error",
        type: "error"
      });
      this.setState({ loading: false, products: [], pages: 0 }, () => { });
    });
  }

  deleteProduct = (id) => {
    axios.post('http://54.241.142.245/api/delete', {
      id: id
    }, {
      headers: {
        'Content-Type': 'application/json',
        'token': this.state.token
      }
    }).then((res) => {
      this.setState({ page: 1 }, () => {
        this.pageChangeOperation(null, 1);
      });
      return true;
    }).catch((err) => {
      swal({
        text: err.response.data.errorMessage,
        icon: "error",
        type: "error"
      });
    });
  }

  pageChangeOperation = (e, page) => {
    this.setState({ page: page }, () => {
      this.getInventory();
    });
  }

  logOut = () => {
    localStorage.setItem('token', null);
    this.props.history.push('/');
  }

  onChange = (e) => {
    if (e.target.files && e.target.files[0] && e.target.files[0].name) {
      this.setState({ fileName: e.target.files[0].name }, () => { });
    }
    this.setState({ [e.target.name]: e.target.value }, () => { });
    if (e.target.name == 'search') {
      this.setState({ page: 1 }, () => {
        this.getInventory();
      });
    }
    if (e.target.name == 'date_aq') {
      this.setState({ date_aq: new Date(`${e.target.value}`) });
    }
  };

  addInventory = () => {
    const fileInput = document.querySelector("#fileInput_add");
    const file = new FormData();
    file.append('name', this.state.name);
    file.append('desc', this.state.desc);
    file.append('ins_v', this.state.ins_v);
    file.append('approx_v', this.state.approx_v);
    file.append('date_aq', this.state.date_aq);
    file.append('image', this.state.picUrl);

    axios.post('http://54.241.142.245/api/add', file, {
      headers: {
        'content-type': 'multipart/form-data',
        'token': this.state.token
      }
    }).then((res) => {

      swal({
        text: res.data.title,
        icon: "success",
        type: "success"
      });

      this.handleInventoryClose();
      this.setState({ name: '', desc: '', ins_v: '', approx_v: '', date_aq: null, file: null, page: 1 }, () => {
        this.getInventory();
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

  updateInventory = () => {
    const fileInput = document.querySelector("#fileInput");
    const file = new FormData();
    file.append('id', this.state.id);
    file.append('name', this.state.name);
    file.append('desc', this.state.desc);
    file.append('ins_v', this.state.ins_v);
    file.append('approx_v', this.state.approx_v);
    file.append('date_aq', this.state.date_aq);
    file.append('image', this.state.picUrl);

    axios.post('http://54.241.142.245/api/update', file, {
      headers: {
        'content-type': 'multipart/form-data',
        'token': this.state.token
      }
    }).then((res) => {

      swal({
        text: res.data.title,
        icon: "success",
        type: "success"
      });

      this.handleInventoryEditClose();
      this.setState({ name: '', desc: '', ins_v: '', approx_v: '', date_aq: null, file: null }, () => {
        this.getInventory();
      });
    }).catch((err) => {
      swal({
        text: err.response.data.errorMessage,
        icon: "error",
        type: "error"
      });
      this.handleInventoryEditClose();
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
      fileName: ''
    });
  };

  getPrettyDate = (date) => {
    let temp = new Date(`${date}`);
    let month = temp.getUTCMonth();
    let day = temp.getUTCDate();
    let year = temp.getUTCFullYear();
    return `${month}/${day}/${year}`;

  }

  handleInventoryClose = () => {
    this.setState({ openInventoryModal: false });
  };

  handleDeleteOpen = (id) => {
    swal({
      title: "Are you sure?",
      text: "Once deleted, you will not be able to recover this inventory",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    })
      .then((willDelete) => {
        if (willDelete) {
          let result = this.deleteProduct(id);
          if (result) {
            swal("Product deleted!!", {
              icon: "success",
            });
          }
        } else {
          swal("Inventory is safe!!");
        }
      });
  }

  handlePicUpload = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("pic", e.target.files[0]);
    await axios
      .post("http://54.241.142.245/api/addPicture", formData,
        {
          headers: {
            'Content-Type': 'application/json',
            'token': this.state.token
          }
        })
      .then((res) => { this.setState({ picUrl: res.data }); })
      .catch((error) => console.log(error.message))
  }


  handleInventoryEditOpen = (data) => {
    let temp = new Date(`${data.date_aq}`);
    let month = temp.getUTCMonth();
    let day = temp.getUTCDate();
    let year = temp.getUTCFullYear();
    let full = `${month}/${day}/${year}`;
    this.setState({
      openInventoryEditModal: true,
      id: data._id,
      name: data.name,
      desc: data.desc,
      approx_v: data.approx_v,
      ins_v: data.ins_v,
      date_aq: full,
      picUrl: data.image
    });
  };

  handleInventoryEditClose = () => {
    this.setState({ openInventoryEditModal: false });
  };

  render() {
    return (
      <>
        <div className="navbar">
          <div className="nav-item">Welcome {localStorage.getItem("username")}</div>
          <a className="button_style nav-item"
            variant="contained"
            size="small" href="/about">
            About
          </a>
          <a
            className="button_style nav-item"
            variant="contained"
            size="small"
            onClick={this.logOut}
            style={{cursor: 'pointer'}}
          >
            Log Out
          </a>
        </div>
        <div>
          {this.state.loading && <LinearProgress size={40} />}
          <div>
            <h2 style={{ textAlign: 'left' }}>Inventory Dashboard</h2>
            <Button
              className="button_style"
              variant="contained"
              color="primary"
              size="small"
              onClick={this.handleInventoryOpen}
            >
              Add Inventory
            </Button>

          </div>

          {/* Edit Inventory */}
          <Dialog
            open={this.state.openInventoryEditModal}
            onClose={this.handleInventoryClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">Edit Product</DialogTitle>
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
                placeholder="Approximate Value"
                required
              /><br />
              <TextField
                id="standard-basic"
                type="number"
                autoComplete="off"
                name="ins_v"
                value={this.state.ins_v}
                onChange={this.onChange}
                placeholder="Insurance Value"
                required
              /><br /><br />
              <TextField
                id="date"
                placeholder="Date Aquired"
                type="date"
                name="date_aq"
                onChange={this.onChange}
                defaultValue={this.state.date_aq}
                sx={{ width: 220 }}
                InputLabelProps={{
                  shrink: true,
                }}
              />
              <br /><br />
              <Button
                variant="contained"
                component="label"
              > Upload
                <input
                  id="standard-basic"
                  type="file"
                  accept="image/*"
                  name="file"
                  value={this.state.file}
                  onChange={this.onChange}
                  placeholder="File"
                  hidden
                />
              </Button>&nbsp;
              <img src={this.state.picUrl} height={70} width={70} />
            </DialogContent>

            <DialogActions>
              <Button onClick={this.handleInventoryEditClose} color="primary">
                Cancel
              </Button>
              <Button
                disabled={this.state.name == '' || this.state.desc == '' || this.state.ins_v == '' || this.state.approx_v == ''}
                onClick={(e) => this.updateInventory()} color="primary" autoFocus>
                Edit Product
              </Button>
            </DialogActions>
          </Dialog>

          {/* Add Inventory */}
          <Dialog
            open={this.state.openInventoryModal}
            onClose={this.handleInventoryClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">Add Inventory</DialogTitle>
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
              <Button
                variant="contained"
                component="label"
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
                  required
                />
              </Button>&nbsp;
              <img src={this.state.picUrl} height={100} width={100} />
            </DialogContent>

            <DialogActions>
              <Button onClick={this.handleInventoryClose} color="primary">
                Cancel
              </Button>
              <Button
                disabled={this.state.name == '' || this.state.desc == '' || this.state.ins_v == '' || this.state.approx_v == '' || this.state.file == null}
                onClick={(e) => this.addInventory()} color="primary" autoFocus>
                Add Inventory
              </Button>
            </DialogActions>
          </Dialog>

          <br />

          <TableContainer>
            <TextField
              id="standard-basic"
              type="search"
              autoComplete="off"
              name="search"
              value={this.state.search}
              onChange={this.onChange}
              placeholder="Search by product name"
              required
            />
            <Table aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell sortDirection align="center">Name</TableCell>
                  <TableCell align="center">Image</TableCell>
                  <TableCell align="center">Description</TableCell>
                  <TableCell align="center">Approximate Value</TableCell>
                  <TableCell align="center">Insurance Value</TableCell>
                  <TableCell align="center">Date Aquired</TableCell>
                  <TableCell align="center">Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {this.state.products.map((row) => (
                  <TableRow key={row.name}>
                    <TableCell align="center" component="th" scope="row">
                      {row.name}
                    </TableCell>
                    <TableCell align="center"><img src={row.image} width="70" height="70" /></TableCell>
                    <TableCell align="center">{row.desc}</TableCell>
                    <TableCell align="center">{row.approx_v}</TableCell>
                    <TableCell align="center">{row.ins_v}</TableCell>
                    <TableCell align="center">{this.getPrettyDate(row.date_aq)}</TableCell>
                    <TableCell align="center">
                      <Button
                        className="button_style"
                        variant="outlined"
                        color="primary"
                        size="small"
                        onClick={(e) => this.handleInventoryEditOpen(row)}
                      >
                        Edit
                      </Button>
                      <Button
                        className="button_style"
                        variant="outlined"
                        color="secondary"
                        size="small"
                        onClick={(e) => this.handleDeleteOpen(row._id)}
                      >
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <br />
            <Pagination count={this.state.pages} page={this.state.page} onChange={this.pageChangeOperation} color="primary" />
          </TableContainer>

        </div>
      </>
    );
  }
}