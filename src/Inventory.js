import React, { Component } from 'react';
import {
    Button, TextField, Dialog, DialogActions, LinearProgress,
    DialogTitle, DialogContent, TableBody, Table,
    TableContainer, TableHead, TableRow, TableCell, Link, Select, MenuItem, FormControl, InputLabel
} from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import VisibilityIcon from '@material-ui/icons/Visibility';
import { Pagination } from '@material-ui/lab';
import swal from 'sweetalert';
import "./Dashboard.css"
const axios = require('axios');

class Inventory extends Component {
    constructor() {
        super();
        this.state = {
            token: '',
            u_id: '',
            openInventoryModal: false,
            openInventoryEditModal: false,
            historyModal: false,
            p_id: '',
            count: 0,
            type: '',
            date_aq: null,
            p_Url: '',
            page: 1,
            search: '',
            inventories: [],
            stockHistory: [],
            products: [],
            pages: 0,
            loading: false,
        };
    }
    handleInventoryOpen = () => {
        this.setState({
            openInventoryModal: true,
            p_id: '',
            count: '',
            type: ''
        });
    };
    handleHistoryOpen = () => {
        this.setState({ historyModal: true })
    }
    handleHistoryClose = () => {
        this.setState({ historyModal: false })
    }
    handleInventoryClose = () => {
        this.setState({ openInventoryModal: false });
    };
    pageChangeOperation = (e, page) => {
        this.setState({ page: page }, () => {
            this.getProducts();
        });
    }
    componentDidMount = () => {
        let token = localStorage.getItem('token');
        this.setState({ u_id: localStorage.getItem('user_id'), u_role: localStorage.getItem('user_role') })
        if (!token) {
            this.props.history.push('/login');
        } else {
            this.setState({ token: token }, () => {
                this.getAllInventory();
            });
        }
    }
    addInventory = () => {
        const file = new FormData();
        file.append('p_id', this.state.p_id);
        file.append('count', this.state.count);
        file.append('type', this.state.type);

        axios.post('/api/add-inventory', file, {
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
            this.setState({ p_id: '', count: '', type: '' }, () => {
                this.getAllInventory();
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
    getAllInventory = () => {
        this.setState({ loading: true });
        let data = '?';
        data = `${data}page=${this.state.page}`;
        if (this.state.search) {
            data = `${data}&search=${this.state.search}`;
        }
        const getInventory = axios.get(`/api/get-inventory${data}`, {
            headers: {
                'token': localStorage.getItem('token')
            }
        }).then((data) => {
            if (data && data.length > 0) {
                // this.setState({ inventories: data.data.inventory }, () => { })
            }
            return data.data

        }).catch(err => err)

        const getProducts = axios.get('/api/getProducts').then((data) => {
            // this.setState({ products: data.data.products })
            return data.data
        })

        Promise.all([getInventory, getProducts]).then(res => {
            if (res[0] && res[0].inventory.length > 0) {
                this.setState({ inventories: res[0].inventory }, () => {
                    console.log(this.state)
                })
            }
            if (res[1] && res[1].products.length > 0) {
                const availableProducts = res[1].products.map(product => product.name)
                const inv = res[0].inventory.filter((inventory) => availableProducts.includes(inventory.name))
                this.setState({ products: res[1].products, inventories: inv }, () => { })
            }
        }).catch(err => {
            this.setState({ inventories: [], products: [], page: 0 })
            console.log(err);
        }).finally(res => {
            this.setState({ loading: false })
        })
    }
    getPrettyDate = (date) => {
        let temp = new Date(`${date}`);
        let month = temp.getUTCMonth();
        let day = temp.getUTCDate();
        let year = temp.getUTCFullYear();
        return `${month}/${day}/${year}`;
    }
    productHistory = (id) => {
        this.setState({ loading: true, historyModal: true });
        axios.get(`/api/get-product-details/${id}`, {
            headers: {
                'token': localStorage.getItem('token')
            }
        }).then((res) => {
            this.setState({
                loading: false, p_name: res.data.details.name, p_desc: res.data.details.desc, p_id: res.data.details.id, p_aqr: res.data.details.approx_v,
                p_ivr: res.data.details.ins_v, p_Url: res.data.details.image, stockHistory: res.data.stockHistory
            });
        }).catch((err) => {
            swal({
                text: err.response.data.errorMessage,
                icon: "error",
                type: "error"
            });
            this.setState({ loading: false, products: [], pages: 0 }, () => { });
        });
    }
    onChange = (e) => {
        this.setState({ [e.target.name]: e.target.value }, () => {
            // console.log(this.state)
        });
    };

    logOut = () => {
        localStorage.setItem('token', null);
        this.props.history.push('/');
    }
    render() {
        return (
            <div>
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
                    {!this.state.loading && <div>
                        <h2 style={{ textAlign: 'center' }}>Inventory Dashboard</h2>
                        <Button
                            className="button_style"
                            variant="contained"
                            color="primary"
                            size="small"
                            style={{float: 'right', marginBottom:'20px'}}
                            disabled={this.state.u_role == 'admin' ? false : true}
                            onClick={this.handleInventoryOpen}
                        >
                            Manage Inventory
                        </Button>

                    </div>}
                    <br />
                    {!this.state.loading && <TableContainer>
                        <Table aria-label="simple table">
                            <TableHead>
                                <TableRow>
                                    <TableCell style={{
                                        width: 100,
                                        backgroundColor: "orange"
                                    }} sortDirection align="center">Product name</TableCell>
                                    <TableCell style={{
                                        width: 100,
                                        backgroundColor: "orange"
                                    }} sortDirection align="center">Inventory Available</TableCell>
                                    <TableCell style={{
                                        width: 100,
                                        backgroundColor: "orange"
                                    }} align="center">Product History</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {this.state.inventories.map((row) => (
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
                                        }} align="center">{row.count}</TableCell>
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
                                                aria-label='Show History'
                                                disabled={this.state.u_role == 'admin' ? false : true}
                                                onClick={() => this.productHistory(row.id)}
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
                    </TableContainer>}
                    {/* Add Inventory */}
                    <Dialog
                        open={this.state.openInventoryModal}
                        onClose={this.handleInventoryClose}
                        aria-labelledby="alert-dialog-title"
                        aria-describedby="alert-dialog-description"
                    >
                        <DialogTitle id="alert-dialog-title">Manage Inventory</DialogTitle>
                        <DialogContent>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                <FormControl variant="filled">
                                    <InputLabel id="demo-simple-select-filled-label">Select Product</InputLabel>
                                    <Select
                                        labelId="demo-simple-select-label"
                                        id="demo-simple-select"
                                        name="p_id"
                                        value={this.state.p_id}
                                        onChange={this.onChange}
                                    >
                                        {this.state.products.map((el) => {
                                            return (<MenuItem value={el._id}>{el.name}</MenuItem>)
                                        })}
                                    </Select>
                                </FormControl>

                                <TextField
                                    id="standard-basic"
                                    type="number"
                                    autoComplete="off"
                                    name="count"
                                    value={this.state.count}
                                    onChange={this.onChange}
                                    placeholder="Quantity"
                                    required
                                /><br />
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    name="type"
                                    value={this.state.type}
                                    onChange={this.onChange}
                                >
                                    <MenuItem value={'In'}>Inventory Add</MenuItem>
                                    <MenuItem value={'Out'}>Inventory Reduce</MenuItem>
                                </Select>
                            </div>
                        </DialogContent>

                        <DialogActions>
                            <Button onClick={this.handleProductEditClose} color="primary">
                                Cancel
                            </Button>
                            <Button
                                disabled={this.state.p_id == '' || this.state.count == '' || this.state.type == ''}
                                onClick={(e) => this.addInventory()} color="primary" autoFocus>
                                Save
                            </Button>
                        </DialogActions>
                    </Dialog>
                    {/* Product History */}
                    <Dialog
                        open={this.state.historyModal}
                        onClose={this.handleHistoryClose}
                        aria-labelledby="alert-dialog-title"
                        aria-describedby="alert-dialog-description"
                        scroll={'paper'}>
                        <DialogTitle id="alert-dialog-title"><u>Product History</u></DialogTitle>
                        <DialogContent>
                            <List style={{
                                width: '100%',
                                maxWidth: 360,
                            }}>
                                <ListItem>

                                    <ListItemText primary="Name" secondary={this.state.p_name} />
                                </ListItem>
                                <ListItem>

                                    <ListItemText primary="Description" secondary={this.state.p_desc} />
                                </ListItem>
                                <ListItem>

                                    <ListItemText primary="Approximate Value" secondary={this.state.p_aqr} />
                                </ListItem>
                                <ListItem>
                                    <ListItemText primary="Insurance Value" secondary={this.state.p_ivr} />
                                </ListItem>
                                <ListItem>
                                    <ListItemText primary="Preview" secondary="Preview" />
                                    <ListItemAvatar>
                                        <img src={this.state.p_Url} height="40" width="40" />
                                    </ListItemAvatar>
                                </ListItem>
                            </List>
                            <TableContainer>
                                <Table aria-label="simple table">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell sortDirection align="center">Date of Transaction</TableCell>
                                            <TableCell align="center">Count</TableCell>
                                            <TableCell align="center">Type</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {this.state.stockHistory.map((row) => (
                                            <TableRow key={row._id}>
                                                <TableCell align="center" component="th" scope="row">
                                                    {this.getPrettyDate(row.date_created)}
                                                </TableCell>
                                                <TableCell align="center">{row.count}</TableCell>
                                                <TableCell align="center">{row.type == "In" ? "Stock Added" : "Stock Removed"}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                                <br />
                            </TableContainer>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>
        );
    }
}

export default Inventory;