import React, { Component } from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import PersonOutlineTwoToneIcon from '@material-ui/icons/PersonOutlineTwoTone';
import MailOutlineTwoToneIcon from '@material-ui/icons/MailOutlineTwoTone';
import SupervisorAccountTwoToneIcon from '@material-ui/icons/SupervisorAccountTwoTone';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
const axios = require('axios');

class UserInfo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: '',
            email: '',
            role: '',
            loading: false
        }
    }
    componentDidMount = () => {
        let token = localStorage.getItem('token');
        if (!token) {
            this.props.history.push('/login');
        } else {
            this.setState({ token: token }, () => {
                this.getUserInfo();
            });
        }
    }
    getUserInfo = () => {
        this.setState({ loading: true });
        const userDetails = axios.get(`/api/user-info`, {
            headers: {
                'token': localStorage.getItem('token')
            }
        }).then((data) => {
            console.log(data.data)
            if (data) {
                this.setState({ name: data.data.name, email: data.data.email, role: data.data.role })
            }

        }).catch(err => err)

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
                        <a className="nav-item" href="/user-info">Welcome {localStorage.getItem("username")}</a>
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

                <br />
                <h1 style={{ textAlign: 'left' }}>User Information</h1>
                <Card style={{ width: 'fit-content' }} variant="outlined">
                    <CardContent>
                        <List style={{
                            width: '100%',
                            maxWidth: 360,
                        }}>
                            <ListItem>
                                <ListItemAvatar>
                                    <Avatar>
                                        <PersonOutlineTwoToneIcon />
                                    </Avatar>
                                </ListItemAvatar>
                                <ListItemText primary="Name" secondary={this.state.name} />
                            </ListItem>
                            <ListItem>
                                <ListItemAvatar>
                                    <Avatar>
                                        <MailOutlineTwoToneIcon />
                                    </Avatar>
                                </ListItemAvatar>
                                <ListItemText primary="Email" secondary={this.state.email} />
                            </ListItem>
                            <ListItem>
                                <ListItemAvatar>
                                    <Avatar>
                                        <SupervisorAccountTwoToneIcon />
                                    </Avatar>
                                </ListItemAvatar>
                                <ListItemText primary="Role" secondary={this.state.role} />
                            </ListItem>
                        </List>
                    </CardContent>
                </Card>
            </div>
        );
    }
}

export default UserInfo;