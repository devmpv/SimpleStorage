'use strict';

import { Button, ButtonGroup, Table, FormGroup, Form, FormControl, ControlLabel, HelpBlock, ButtonToolbar, Pagination, Modal, Checkbox, InputGroup } from 'react-bootstrap';
const client = require('./client');
const React = require('react');

class MainPage extends React.Component {

    constructor(props) {
        super(props);
        this.state = {items: [], brands: [], attributes: [], file: {}, activePage: 1, pageSize: 20, total: 0, currentItem: {}, showModal: false, search: "", lowcount: false};
        this.handleUpload = this.handleUpload.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleFileChange = this.handleFileChange.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleSearch = this.handleSearch.bind(this);
        this.handlePageSelect = this.handlePageSelect.bind(this);
        this.modalClose = this.modalClose.bind(this);
        this.modalOpen = this.modalOpen.bind(this);
        this.getBrandList = this.getBrandList.bind(this);
    }

    modalClose() {
        this.setState({ showModal: false });
    }

    modalOpen(event) {
        if (event.target.id === 'new') {
            this.setState({ showModal: true, currentItem: {}});
        }else {
            this.setState({ showModal: true, currentItem:  this.state.items.filter((item)=> item.id==event.target.id)[0]});
        }
    }

    loadFromServer(activePage, search, lowcount) {
        activePage = activePage ? activePage : this.state.activePage;
        let params = {
            max: this.state.pageSize,
            offset: (activePage-1) * this.state.pageSize
        };
        if (search != "") {
            params.title = search;
            params.brand = search;
        }
        if (lowcount) {
            params.count = 5;
        }
        client({
              method: 'GET', path: '/search/', params: params
        }).done(response => {
            this.setState({items: response.entity.result, total: response.entity.count});
        });
        this.getBrandList();
    }

    componentDidMount() {
        this.loadFromServer(this.state.activePage, this.state.search, this.state.lowcount);
    }

    handleUpload() {
        event.preventDefault();
        if (this.state.file.name) {
            let form = new FormData();
            form.append('attach', this.state.file);
            const request = {
                              method: 'POST',
                              path: '/upload',
                              entity: form,
                              headers: {'Content-Type': 'multipart/form-data' }
                            };
            client(request).done(() => {
                  this.loadFromServer(this.state.pageSize, this.state.search, this.state.lowcount);
            });
        }
    }

    handleFileChange(event) {
        event.preventDefault();
        this.setState({file: event.target.files[0]})
    }
    handleChange(event) {
        event.preventDefault();
        let item = this.state.currentItem;
        if (event.target.id == "brand") {
            item[event.target.id] = event.target.selectedOptions[0].value
        }else {
            item[event.target.id] = event.target.value;
        }
        this.setState({currentItem: item})
    }

    handleSubmit(event) {
        event.preventDefault();
        if (this.state.currentItem.id) {
            client({
                  method: 'PUT', path: '/item/'+this.state.currentItem.id, entity: this.state.currentItem,
                  headers: {'Content-Type': 'application/json'}
            }).done(response => {
                console.log(response);
                this.loadFromServer(this.state.activePage, this.state.search, this.state.lowcount);
            });
        } else {
            client({
                  method: 'POST', path: '/item/', entity: this.state.currentItem,
                  headers: {'Content-Type': 'application/json'}
            }).done(response => {
                console.log(response);
                this.loadFromServer(this.state.activePage, this.state.search, this.state.lowcount);
            });
        }
        this.modalClose();
    }

    handleSearch(event) {
        event.preventDefault();
        if (event.target.id == "lowcount") {
            this.setState({lowcount: event.target.checked})
            this.loadFromServer(this.state.activePage, this.state.search, event.target.checked)
        }else {
            this.setState({search: event.target.value})
            this.loadFromServer(this.state.activePage, event.target.value, this.state.lowcount)
        }

    }

    handlePageSelect(eventKey) {
        event.preventDefault();
        this.setState({activePage: eventKey });
        this.loadFromServer(eventKey, this.state.search, this.state.lowcount);
    }

    handleDelete(event){
        event.preventDefault();
        client({
              method: 'DELETE', path: '/item/'+event.target.id
        }).done(response => {
            console.log(response);
            this.loadFromServer(this.state.activePage, this.state.search, this.state.lowcount);
        });
    }

    getBrandList(){
      client({
            method: 'GET', path: '/brand/'
      }).done(response => {
          this.setState({brands: response.entity});
      });
    }

    render() {
        let brands = this.state.brands.map(brand =>
          <option key={brand.id} value={brand.id}>{brand.title}</option>
        )
        let items = this.state.items.map(item =>
          <tr key={item.id}>
            <td>{item.title}</td><td>{item.br_title}</td><td>{item.size}</td><td>{item.count}</td><td>{item.price}</td><td>{item.extId}</td>
            <td>
              <ButtonToolbar>
                <ButtonGroup><Button id={item.id} type="button" bsSize="xsmall" bsStyle="info" placeholder="Edit item" onClick={this.modalOpen}>E</Button></ButtonGroup>
                <ButtonGroup><Button id={item.id} type="button" bsSize="xsmall" bsStyle="warning" placeholder="Delete item" onClick={this.handleDelete}>x</Button></ButtonGroup>
              </ButtonToolbar>
            </td>
          </tr>
        );
        return (
          <div>
              <Form inline onSubmit={this.handleUpload}>
                <FormGroup controlId="formFile">
                  <ControlLabel>Import data from csv/xls</ControlLabel>
                  <FormControl type="file" placeholder="Upload csv/xsl file.." onChange={this.handleFileChange}/>
                  <FormControl.Feedback />
                </FormGroup>
                <Button type="submit">Upload</Button>
                <FormGroup controlId="search">
                  <ControlLabel>Search</ControlLabel>
                  <FormControl type="input" placeholder="Title or Brand" onChange={this.handleSearch}/>
                  <FormControl.Feedback />
                </FormGroup>
                <Button id="export" bsStyle="success" bsSize="small" href={"/search/export?title="+this.state.search+"&brand="+this.state.search}>Export..</Button>
                <FormGroup controlId="lowcount">
                  <Checkbox id="lowcount" inline onChange={this.handleSearch} checked={this.state.lowcount}>Low count</Checkbox>
                </FormGroup>
              </Form>
              <Button id="new" bsStyle="primary"  bsSize="xsmall" onClick={this.modalOpen}>Create new</Button>
              <Table striped bordered condensed hover>
                  <thead>
                    <tr>
                      <th>Title</th><th>Brand</th><th>Size</th><th>Count</th><th>Price</th><th>External ID</th><th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                      {items}
                  </tbody>
                  <tfoot><tr><td colSpan='7'>
                    <Pagination prev next first last ellipsis boundaryLinks
                        items={~~(this.state.total / this.state.pageSize) + 1}
                        maxButtons={5}
                        activePage={this.state.activePage}
                        onSelect={this.handlePageSelect} />
                  </td></tr></tfoot>
              </Table>
              <Modal show={this.state.showModal} onHide={this.modalClose} onSubmit={this.handleSubmit}>
                  <Modal.Header closeButton>
                      <Modal.Title>{this.state.currentItem.id ? 'Edit item' : 'Create new item'}</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    <Form onSubmit={this.handleEdit}>
                      <FormGroup controlId="extId">
                        <ControlLabel>External ID</ControlLabel>
                        <FormControl ref={(input) => { this.extIdInput = input; }} type="input"
                          placeholder="External ID" defaultValue={this.state.currentItem.extId} onChange={this.handleChange}/>
                        <FormControl.Feedback />
                      </FormGroup>
                      <FormGroup
                        controlId="title">
                        <ControlLabel>Title</ControlLabel>
                        <FormControl type="input" placeholder="Title" defaultValue={this.state.currentItem.title} onChange={this.handleChange}/>
                        <FormControl.Feedback />
                      </FormGroup>
                      <FormGroup
                        controlId="count">
                        <ControlLabel>Count</ControlLabel>
                        <FormControl type="input" placeholder="Count" defaultValue={this.state.currentItem.count} onChange={this.handleChange}/>
                        <FormControl.Feedback />
                      </FormGroup>
                      <FormGroup controlId="brand">
                        <ControlLabel>Brand</ControlLabel>
                        <FormControl componentClass="select" placeholder="Select brand" defaultValue={this.state.currentItem.br_title ? this.state.currentItem.br_id : 0}
                          onChange={this.handleChange} >
                          <option value="">...</option>
                          {brands}
                        </FormControl>
                      </FormGroup>
                      <FormGroup
                        controlId="size">
                        <ControlLabel>Size</ControlLabel>
                        <FormControl type="input" placeholder="SIze" defaultValue={this.state.currentItem.size} onChange={this.handleChange}/>
                        <FormControl.Feedback />
                      </FormGroup>
                      <FormGroup controlId="price"><ControlLabel>Price</ControlLabel>
                        <InputGroup>
                          <InputGroup.Addon>$</InputGroup.Addon>
                            <FormControl type="input" placeholder="Price" defaultValue={this.state.currentItem.price} onChange={this.handleChange}/>
                            <FormControl.Feedback />
                        </InputGroup>
                      </FormGroup>
                      <Button type="submit">Submit</Button>  <Button onClick={this.modalClose}>Close</Button>
                    </Form>
                  </Modal.Body>
                  <Modal.Footer>
                  </Modal.Footer>
              </Modal>
          </div>
        )
    }
}

export default MainPage;
