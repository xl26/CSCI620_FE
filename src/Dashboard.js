import React, { Component } from 'react';
import { Grid, Card, Button } from '@material-ui/core';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import swal from 'sweetalert';
import "./Dashboard.css"
const axios = require('axios');


export default class Dashboard extends Component {
  constructor() {
    super();
    this.state = {
      token: '',
      productCount: 0,
      categoryCount: 0,
      loading: false,
    };
  }

  componentDidMount = () => {
    let token = localStorage.getItem('token');
    if (!token) {
      this.props.history.push('/login');
    } else {
      this.setState({ token: token }, () => {
        this.getProductCount();
        this.getCategoryCount();
      });
    }
  }

  getProductCount = () => {

    this.setState({ loading: true });
    axios.get(`/api/get-product-count`, {
      headers: {
        'token': this.state.token
      }
    }).then((res) => {
      this.setState({ loading: false, productCount: res.data.count });
    }).catch((err) => {
      swal({
        text: err.response.data.errorMessage,
        icon: "error",
        type: "error"
      });
      this.setState({ loading: false }, () => { });
    });
  }

  getCategoryCount = () => {

    this.setState({ loading: true });
    axios.get(`/api/get-category-count`, {
      headers: {
        'token': this.state.token
      }
    }).then((res) => {
      this.setState({ loading: false, categoryCount: res.data.count });
    }).catch((err) => {
      swal({
        text: err.response.data.errorMessage,
        icon: "error",
        type: "error"
      });
      this.setState({ loading: false }, () => { });
    });
  }


  logOut = () => {
    localStorage.setItem('token', null);
    this.props.history.push('/');
  }

  render() {
    return (
      <>
        <div className="navbar">
          <div>
            <a className="button_style nav-item"
              variant="contained"
              style={{textDecoration: 'none'}}
              size="small" href="/dashboard">
              <img height="30" width="30" src="https://firebasestorage.googleapis.com/v0/b/csci620-a1435.appspot.com/o/logo.jpeg?alt=media&token=83a498af-9289-4c34-8754-286d02675ea4"/>
            </a>
            <a className="button_style nav-item"
              variant="contained"
              style={{textDecoration: 'none'}}
              size="small" href="/dashboard">
              Dashboard
            </a>
            <a className="button_style nav-item"
              variant="contained"
              style={{textDecoration: 'none'}}
              size="small" href="/category">
              Category
            </a>
            <a className="button_style nav-item"
              variant="contained"
              style={{textDecoration: 'none'}}
              size="small" href="/product">
              Product
            </a>
            <a className="button_style nav-item"
              variant="contained"
              style={{textDecoration: 'none'}}
              size="small" href="/inventory">
              Inventory
            </a>
          </div>
          <div>
            <a className="nav-item"  style={{ textDecoration: 'none' }} href="/user-info">Welcome {localStorage.getItem("username")}</a>
            <a className="button_style nav-item"
              variant="contained"
              style={{textDecoration: 'none'}}
              size="small" href="/about">
              About
            </a>

            <a
              className="button_style nav-item"
              variant="contained"
              size="small"
              onClick={this.logOut}
              style={{ cursor: 'pointer' , textDecoration: 'none'}}
            >
              Log Out
            </a>
          </div>
        </div>
        <div>
          <div></div>
          <Grid container spacing={3}>
            <Grid item xs={6}>
              <Card style={{ minWidth: 275, border:"1px solid", padding: "10px", boxShadow:"3px 5px lightblue" }}>
                <CardContent>
                  <Typography style={{ fontSize: 14 }} color="textSecondary" gutterBottom>
                    <b>Categories</b>
                  </Typography>
                  <Typography style={{ fontSize: 14 }} color="textSecondary" gutterBottom>
                    {this.state.categoryCount}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button variant="outlined" color="primary" onClick={() => this.props.history.push('/category')}>Go to categories</Button>
                </CardActions>
              </Card>
            </Grid>
            <Grid item xs={6}>
              <Card style={{ minWidth: 275, border:"1px solid", padding: "10px", boxShadow:"3px 5px lightblue" }}>
                <CardContent>
                  <Typography style={{ fontSize: 14 }} color="textSecondary" gutterBottom>
                    <b>Products</b>
                  </Typography>
                  <Typography style={{ fontSize: 14 }} color="textSecondary" gutterBottom>
                    {this.state.productCount}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button variant="outlined" color="primary" onClick={() => this.props.history.push('/product')}>Go to Products</Button>
                </CardActions>
              </Card>
            </Grid>
          </Grid>

        </div>
      </>
    );
  }
}