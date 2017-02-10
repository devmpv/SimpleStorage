'use strict';

import 'whatwg-fetch';
const React = require('react');
const ListGroup = require('react-bootstrap/lib/ListGroup')
const ListGroupItem = require('react-bootstrap/lib/ListGroupItem')

class MainPage extends React.Component {

    constructor(props) {
        super(props);
        this.state = {items: [], attributes: []};
    }

    loadFromServer() {
      fetch('/api/items/', {
           method: 'GET'
       }).then(response => {
           return response.json();
       }).then(json => {
           console.log(json);
           this.setState({'items': json});
       });
    }

    componentDidMount() {
        this.loadFromServer();
    }

    render() {
        let boards = this.state.items.map(item =>
            <ListGroupItem header={'/' + item.title} key={item.id} href={'#'}>
              {item.title}
            </ListGroupItem>
        );
        return (
            <div className="panel">
                <div>
                    <h4>Board List</h4>
                </div>
                <ListGroup>
                    {boards}
                </ListGroup>

            </div>
        )
    }
}

export default MainPage;
