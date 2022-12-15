import React, { Component } from 'react';
import {
    Button, TextField, Dialog, DialogActions, LinearProgress,
    DialogTitle, DialogContent, TableBody, Table,
    TableContainer, TableHead, TableRow, TableCell, Link
} from '@material-ui/core';
import { Pagination } from '@material-ui/lab';
import swal from 'sweetalert';
import "./Dashboard.css"
import { BorderAllRounded } from '@material-ui/icons';
const axios = require('axios');

class Category extends Component {
    constructor() {
        super();
        this.state = {
            token: '',
            openCategoryModal: false,
            openCategoryEditModal: false,
            id: '',
            name: '',
            desc: '',
            page: 1,
            search: '',
            categories: [],
            pages: 0,
            loading: false,
        };
    }
    componentDidMount = () => {
        let token = localStorage.getItem('token');
        if (!token) {
            this.props.history.push('/login');
        } else {
            this.setState({ token: token }, () => {
                this.getCategories();
            });
        }
    }
    getCategories = () => {

        this.setState({ loading: true });

        let data = '?';
        data = `${data}page=${this.state.page}`;
        if (this.state.search) {
            data = `${data}&search=${this.state.search}`;
        }
        axios.get(`/api/get-category${data}`, {
            headers: {
                'token': this.state.token
            }
        }).then((res) => {
            this.setState({ loading: false, categories: res.data.category, pages: res.data.pages });
        }).catch((err) => {
            swal({
                text: err.response.data.errorMessage,
                icon: "error",
                type: "error"
            });
            this.setState({ loading: false, categories: [], pages: 0 }, () => { });
        });
    }
    deleteCategory = (id) => {
        axios.post('/api/delete-category', {
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
            this.getCategories();
        });
    }

    logOut = () => {
        localStorage.setItem('token', null);
        this.props.history.push('/');
    }
    onChange = (e) => {
        this.setState({ [e.target.name]: e.target.value }, () => { });
        if (e.target.name == 'search') {
            this.setState({ page: 1 }, () => {
                this.getCategories();
            });
        }
    };
    addCategory = () => {
        const file = new FormData();
        file.append('name', this.state.name);
        file.append('desc', this.state.desc);

        axios.post('/api/add-category', file, {
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

            this.handleCategoryClose();
            this.setState({ name: '', desc: '', page: 1 }, () => {
                this.getCategories();
            });
        }).catch((err) => {
            swal({
                text: err.response.data.errorMessage,
                icon: "error",
                type: "error"
            });
            this.handleCategoryClose();
        });
    }
    updateCategory = () => {
        const file = new FormData();
        file.append('id', this.state.id);
        file.append('name', this.state.name);
        file.append('desc', this.state.desc);

        axios.post('/api/update-category', file, {
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

            this.handleCategoryEditClose();
            this.setState({ name: '', desc: '' }, () => {
                this.getCategories();
            });
        }).catch((err) => {
            console.log(err )
            swal({
                text: err.response.data.errorMessage,
                icon: "error",
                type: "error"
            });
            this.handleCategoryEditClose();
        });

    }
    handleCategoryOpen = () => {
        this.setState({
            openCategoryModal: true,
            id: '',
            name: '',
            desc: '',
        });
    };
    handleCategoryClose = () => {
        this.setState({ openCategoryModal: false });
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
                    let result = this.deleteCategory(id);
                    if (result) {
                        swal("Category deleted!!", {
                            icon: "success",
                        });
                    }
                } else {
                    swal("Category is safe!!");
                }
            });
    }
    handleCategoryEditOpen = (data) => {
        this.setState({
            openCategoryEditModal: true,
            id: data._id,
            name: data.name,
            desc: data.description,
        });
    };
    handleCategoryEditClose = () => {
        this.setState({ openCategoryEditModal: false });
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

                {this.state.loading && <LinearProgress size={40} />}
                <div>
                    <h2 style={{ textAlign: 'center' }}>Category Dashboard</h2>
                    <Button
                        className="button_style"
                        variant="contained"
                        color="primary"
                        size="small"
                        style={{float: 'right', marginBottom:'20px'}}
                        onClick={this.handleCategoryOpen}
                    >
                        Add Category
                    </Button>
                </div>
                {/* Edit Category */}
                <Dialog
                    open={this.state.openCategoryEditModal}
                    onClose={this.handleCategoryClose}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle id="alert-dialog-title">Edit Category</DialogTitle>
                    <DialogContent>
                        <TextField
                            id="standard-basic"
                            type="text"
                            autoComplete="off"
                            name="name"
                            value={this.state.name}
                            onChange={this.onChange}
                            placeholder="Category Name"
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
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleCategoryEditClose} color="primary">
                            Cancel
                        </Button>
                        <Button
                            disabled={this.state.name == '' || this.state.desc == ''}
                            onClick={(e) => this.updateCategory()} color="primary" autoFocus>
                            Save
                        </Button>
                    </DialogActions>
                </Dialog>
                {/* Add Product */}
                <Dialog
                    open={this.state.openCategoryModal}
                    onClose={this.handleCategoryClose}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle id="alert-dialog-title">Add Category</DialogTitle>
                    <DialogContent>
                        <TextField
                            id="standard-basic"
                            type="text"
                            autoComplete="off"
                            name="name"
                            value={this.state.name}
                            onChange={this.onChange}
                            placeholder="Category Name"
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
                        />
                    </DialogContent>

                    <DialogActions>
                        <Button onClick={this.handleCategoryClose} color="primary">
                            Cancel
                        </Button>
                        <Button
                            disabled={this.state.name == '' || this.state.desc == ''}
                            onClick={(e) => this.addCategory()} color="primary" autoFocus>
                            Save
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
                        onChange={this.onChange}
                        style={{float: 'right', marginBottom:'20px'}}
                        placeholder="Search by category name"
                        required
                    />
                    <Table aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell style={{

                                    width: 100,
                                    backgroundColor: "orange",
                                }} sortDirection align="center">Name</TableCell>
                                <TableCell style={{

                                    width: 100,
                                    backgroundColor: "orange"
                                }} sortDirection align="center">Description</TableCell>
                                <TableCell style={{

                                    width: 100,
                                    backgroundColor: "orange"
                                }} sortDirection align="center">Action</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {this.state.categories.map((row) => (
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
                                    }} align="center">{row.description}</TableCell>
                                    <TableCell style={{
                                        padding: "0px 0px",
                                        borderRight: "2px solid black",
                                        backgroundColor: "lightblue",
                                        fontSize: "1.1rem"
                                    }} align="center">
                                        <Button
                                            className="button_style"
                                            variant="contained"
                                            color="primary"
                                            size="small"
                                            onClick={(e) => this.handleCategoryEditOpen(row)}
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
            </>
        );
    }
}

export default Category;