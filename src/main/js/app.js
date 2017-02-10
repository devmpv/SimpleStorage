'use strict'
import MainPage from  "./MainPage";

const React = require('react');
const ReactDOM = require('react-dom');
const Router = require('react-router').Router;
const Route = require('react-router').Route;
const browserHistory = require('react-router').browserHistory;

ReactDOM.render(
    <Router history={browserHistory}>
        <Route path="/" component={MainPage}/>
    </Router>,
    document.getElementById('react')
);
