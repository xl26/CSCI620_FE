import React, { Component } from 'react';
import {
  Button, TextField, Dialog, DialogActions, LinearProgress,
  DialogTitle, DialogContent, TableBody, Table,
  TableContainer, TableHead, TableRow, TableCell, Link, Select, MenuItem, FormControl, InputLabel
} from '@material-ui/core';
import { Pagination } from '@material-ui/lab';
import VisibilityIcon from '@material-ui/icons/Visibility';
import swal from 'sweetalert';
import "./Dashboard.css"
const axios = require('axios');
export default class Product extends Component {
  constructor() {
    super();
    this.state = {
      token: '',
      openInventoryModal: false,
      openInventoryEditModal: false,
      openShowProduct: false,
      id: '',
      name: '',
      desc: '',
      approx_v: '',
      ins_v: '',
      date_aq: null,
      category: '',
      file: '',
      fileName: '',
      page: 1,
      search: '',
      products: [],
      categories: [],
      pages: 0,
      loading: false,
      picUrl: '',
      showUrl: ''
    };
  }

  componentDidMount = () => {
    let token = localStorage.getItem('token');
    if (!token) {
      this.props.history.push('/login');
    } else {
      this.setState({ token: token }, () => {
        this.getProducts();
      });
    }
  }

  getProducts = () => {
    this.setState({ loading: true });
    let data = '?';
    data = `${data}page=${this.state.page}`;
    if (this.state.search) {
      data = `${data}&search=${this.state.search}`;
    }
    const getAllProducts = axios.get(`/api/get-product${data}`, {
      headers: {
        'token': localStorage.getItem('token')
      }
    }).then((data) => {
      if (data && data.length > 0) {
        // this.setState({ inventories: data.data.inventory }, () => { })
      }
      return data.data

    }).catch(err => err)

    const getCategories = axios.get('/api/getCategories').then((data) => {
      // this.setState({ products: data.data.products })
      return data.data
    })

    Promise.all([getAllProducts, getCategories]).then(res => {
      console.log(res)
      if (res[0]) {
        this.setState({ products: res[0].products, pages: res[0].pages }, () => { })
        if(res[0].products.length == 0)
        {
          swal({
            text: res[0].errorMessage,
            icon: "error",
            type: "error"
          });
        }
      }
      if (res[1] && res[1].categories.length > 0) {
        this.setState({ categories: res[1].categories, }, () => { })
      }
    }).catch(err => {
      console.log(err);
      this.setState({ products: [], categories: [], page: 0 })
    }).finally(res => {
      this.setState({ loading: false })
    })
    console.log(this.state)
  }

  deleteProduct = (id) => {
    return axios.post('/api/delete-product', {
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
      this.getProducts();
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
        this.getProducts();
      });
    }
    if (e.target.name == 'date_aq') {
      this.setState({ date_aq: new Date(`${e.target.value}`) });
    }
  };

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
        'token': this.state.token
      }
    }).then((res) => {

      swal({
        text: res.data.title,
        icon: "success",
        type: "success"
      });

      this.handleInventoryClose();
      this.setState({ name: '', desc: '', ins_v: '', approx_v: '', date_aq: null, category: '', file: null, page: 1, picUrl: '' }, () => {
        this.getProducts();
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

  updateProduct = () => {
    const fileInput = document.querySelector("#fileInput");
    const file = new FormData();
    file.append('id', this.state.id);
    file.append('name', this.state.name);
    file.append('desc', this.state.desc);
    file.append('ins_v', this.state.ins_v);
    file.append('approx_v', this.state.approx_v);
    file.append('date_aq', this.state.date_aq);
    file.append('category', this.state.category);
    file.append('image', this.state.picUrl);

    axios.post('/api/product-update', file, {
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

      this.handleProductEditClose();
      this.setState({ name: '', desc: '', ins_v: '', approx_v: '', date_aq: null, file: null }, () => {
        this.getProducts();
      });
    }).catch((err) => {
      swal({
        text: err.response.data.errorMessage,
        icon: "error",
        type: "error"
      });
      this.handleProductEditClose();
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
      .then(async (willDelete) => {
        if (willDelete) {
          let result = await this.deleteProduct(id);
          if (result) {
            swal("Product deleted!!", {
              icon: "success",
            });
            window.location.reload();
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
      .post("/api/addPicture", formData,
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
      category: data.category,
      picUrl: data.image
    });
  };
  handleShowProduct = (url) => {
    this.setState({ openShowProduct: true, showUrl:url  });
  }

  handleShowProductClose = () => {
    this.setState({ openShowProduct : false, showUrl: ''});
  }

  handleProductEditClose = () => {
    this.setState({ openInventoryEditModal: false });
  };

  render() {
    return (
      <>
        <div className="navbar">
          <div>
            <a className="button_style nav-item"
              variant="contained"
              style={{ textDecoration: 'none' }}
              size="small" href="/dashboard">
              <img height="30" width="30" src="https://firebasestorage.googleapis.com/v0/b/csci620-a1435.appspot.com/o/logo.jpeg?alt=media&token=83a498af-9289-4c34-8754-286d02675ea4" />
            </a>
            <a className="button_style nav-item"
              variant="contained"
              style={{ textDecoration: 'none' }}
              size="small" href="/dashboard">
              Dashboard
            </a>
            <a className="button_style nav-item"
              variant="contained"
              style={{ textDecoration: 'none' }}
              size="small" href="/category">
              Category
            </a>
            <a className="button_style nav-item"
              variant="contained"
              style={{ textDecoration: 'none' }}
              size="small" href="/product">
              Product
            </a>
            <a className="button_style nav-item"
              variant="contained"
              style={{ textDecoration: 'none' }}
              size="small" href="/inventory">
              Inventory
            </a>
          </div>
          <div>
            <a className="nav-item" style={{ textDecoration: 'none' }} href="/user-info">Welcome {localStorage.getItem("username")}</a>
            <a className="button_style nav-item"
              variant="contained"
              style={{ textDecoration: 'none' }}
              size="small" href="/about">
              About
            </a>

            <a
              className="button_style nav-item"
              variant="contained"
              size="small"
              onClick={this.logOut}
              style={{ cursor: 'pointer', textDecoration: 'none' }}
            >
              Log Out
            </a>
          </div>
        </div>
        <div>
          {this.state.loading && <LinearProgress size={40} />}
          <div>
            <h2 style={{ textAlign: 'center' }}>Product Dashboard</h2>
            <Button
              className="button_style"
              variant="contained"
              color="primary"
              size="small"
              style={{float: 'right', marginBottom:'20px'}}
              onClick={this.handleInventoryOpen}
            >
              Add Product
            </Button>

          </div>

          {/* Edit Product */}
          <Dialog
          maxWidth={'sm'}
          fullWidth={true}
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
              <InputLabel id="demo-simple-select-filled-label">Select Date</InputLabel>
              <TextField
                id="date"
                placeholder="Date Aquired"
                type="date"
                name="date_aq"
                onChange={this.onChange}
                defaultValue={this.state.date_aq}
                sx={{ width: 220 }}
                InputLabelProps={{
                  shrink: false,
                }}
              />
              <br /><br />
              <div style={{display:'flex'}}>
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
                  />
                </Button>&nbsp;
                <InputLabel id="demo-simple-select-filled-label">Image Preview:</InputLabel>
                <img src={this.state.picUrl} height={70} width={70} />
              </div>
              
            </DialogContent>

            <DialogActions>
              <Button onClick={this.handleProductEditClose} color="primary">
                Cancel
              </Button>
              <Button
                disabled={this.state.name == '' || this.state.desc == '' || this.state.ins_v == '' || this.state.approx_v == ''}
                onClick={(e) => this.updateProduct()} color="primary" autoFocus>
                Save
              </Button>
            </DialogActions>
          </Dialog>

          {/* Add Product */}
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

          <br />

          <TableContainer>
            <TextField
              id="standard-basic"
              type="search"
              variant="outlined"
              autoComplete="off"
              name="search"
              value={this.state.search}
              style={{float: 'right', marginBottom:'20px'}}
              onChange={this.onChange}
              placeholder="Search by product name"
              required
            />
            <Table aria-label="simple table" style={{ tableLayout: "auto" }}>
              <TableHead>
                <TableRow style={{
                  backgroundColor: "yellow",
                  borderBottom: "2px solid black",
                  "& th": {
                    fontSize: "1.25rem",
                    color: "rgba(96, 96, 96)"
                  }
                }}>
                  <TableCell style={{
                    
                    width: 100,
                    backgroundColor: "orange"
                  }} sortDirection align="center">Name</TableCell>
                  <TableCell style={{
                    
                    width: 100,
                    backgroundColor: "orange"
                  }} sortDirection align="center">Image</TableCell>
                  <TableCell style={{
                    
                    width: 100,
                    backgroundColor: "orange"
                  }} sortDirection align="center">Description</TableCell>
                  <TableCell style={{
                    
                    width: 100,
                    backgroundColor: "orange"
                  }} sortDirection align="center">Category</TableCell>
                  <TableCell style={{
                    
                    width: 100,
                    backgroundColor: "orange"
                  }} sortDirection align="center">Approximate Value</TableCell>
                  <TableCell style={{
                    
                    width: 100,
                    backgroundColor: "orange"
                  }} sortDirection align="center">Insurance Value</TableCell>
                  <TableCell style={{
                    
                    width: 100,
                    backgroundColor: "orange"
                  }} sortDirection align="center">Date Aquired</TableCell>
                  <TableCell style={{
                    
                    width: 100,
                    backgroundColor: "orange"
                  }} sortDirection align="center">Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {this.state.products.map((row) => (
                  <TableRow key={row.name}>
                    <TableCell style={{
                      padding: "0px 0px",
                      borderRight: "2px solid black",
                      borderLeft: "2px solid black",
                      backgroundColor: "lightblue",
                      fontSize: "1.1rem"
                    }} align="center" component="th" scope="row">
                      {row.name}
                    </TableCell>
                    <TableCell style={{
                      padding: "0px 0px",
                      borderRight: "2px solid black",
                      backgroundColor: "lightblue",
                      fontSize: "1.1rem"
                    }} align="center"><img src={row.image} width="70" height="70" /></TableCell>
                    <TableCell style={{
                      padding: "0px 0px",
                      borderRight: "2px solid black",
                      backgroundColor: "lightblue",
                      fontSize: "1.1rem"
                    }} align="center">{row.desc}</TableCell>
                    <TableCell style={{
                      padding: "0px 0px",
                      borderRight: "2px solid black",
                      backgroundColor: "lightblue",
                      fontSize: "1.1rem"
                    }} align="center">{row.category}</TableCell>
                    <TableCell style={{
                      padding: "0px 0px",
                      borderRight: "2px solid black",
                      backgroundColor: "lightblue",
                      fontSize: "1.1rem"
                    }} align="center">{row.approx_v}</TableCell>
                    <TableCell style={{
                      padding: "0px 0px",
                      borderRight: "2px solid black",
                      backgroundColor: "lightblue",
                      fontSize: "1.1rem"
                    }} align="center">{row.ins_v}</TableCell>
                    <TableCell style={{
                      padding: "0px 0px",
                      borderRight: "2px solid black",
                      backgroundColor: "lightblue",
                      fontSize: "1.1rem"
                    }} align="center">{this.getPrettyDate(row.date_aq)}</TableCell>
                    <TableCell style={{
                      padding: "0px 0px",
                      borderRight: "2px solid black",
                      backgroundColor: "lightblue",
                      fontSize: "1.1rem"
                    }} align="center">
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
                      <Button
                        className="button_style"
                        variant="outlined"
                        color="secondary"
                        size="small"
                        title="Show Image Preview"
                        onClick={(e) => this.handleShowProduct(row.image)}
                      >
                        <VisibilityIcon />
                        </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <br />
            <Pagination count={this.state.pages} page={this.state.page} onChange={this.pageChangeOperation} color="primary" />
          </TableContainer>
          <Dialog maxWidth={'md'}
          fullWidth={true}
            open={this.state.openShowProduct}
            onClose={this.handleShowProductClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description">
            <DialogTitle>Product Preview</DialogTitle>
            <DialogContent>
              <img src={this.state.showUrl} />
            </DialogContent>
          </Dialog>
        </div>
      </>
    );
  }
}