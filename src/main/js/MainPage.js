'use strict';

const client = require('./client');
const React = require('react');
const Table = require('react-bootstrap/lib/Table')
const FormGroup = require('react-bootstrap/lib/FormGroup')
const Form = require('react-bootstrap/lib/Form')
const FormControl = require('react-bootstrap/lib/FormControl')
const ControlLabel = require('react-bootstrap/lib/ControlLabel')
const HelpBlock = require('react-bootstrap/lib/HelpBlock')
const Button = require('react-bootstrap/lib/Button')
const ButtonGroup = require('react-bootstrap/lib/ButtonGroup')
const ButtonToolbar = require('react-bootstrap/lib/ButtonToolbar')
const Pagination = require('react-bootstrap/lib/Pagination')
const Modal = require('react-bootstrap/lib/Modal')

class MainPage extends React.Component {

    constructor(props) {
        super(props);
        this.state = {items: [], attributes: [], file: {}, activePage: 1, pageSize: 20, total: 0, currentItem: {}, showModal: false};
        this.handleUpload = this.handleUpload.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handlePageSelect = this.handlePageSelect.bind(this);
        this.modalClose = this.modalClose.bind(this);
        this.modalOpen = this.modalOpen.bind(this);
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

    loadFromServer(activePage) {
        activePage = activePage ? activePage : this.state.activePage;
        client({
              method: 'GET', path: '/api/items/', params: {
                  max: this.state.pageSize,
                  offset: (activePage-1) * this.state.pageSize
              }
        }).done(response => {
            console.log(response);
            this.setState({items: response.entity, total: response.entity.itemCount});
        });
    }

    componentDidMount() {
        this.loadFromServer();
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
                              headers: {
                                  'Content-Type': 'multipart/form-data'
                              }
                        };
            client(request).done(() => {
                  this.loadFromServer(this.state.pageSize);
            });
        }
    }

    handleChange(event) {
        event.preventDefault();
        this.setState({file: event.target.files[0]})
    }

    handleSubmit(event) {
        event.preventDefault();
        this.modalClose();
    }

    handlePageSelect(eventKey) {
        event.preventDefault();
        this.setState({activePage: eventKey });
        this.loadFromServer(eventKey);
    }

    handleDelete(event){
        event.preventDefault();
        client({
              method: 'DELETE', path: '/api/items/'+event.target.id
        }).done(response => {
            console.log(response);
            this.loadFromServer(this.state.activePage);
        });
    }

    render() {
        let items = this.state.items.map(item =>
          <tr key={item.id}>
            <td>{item.title}</td>
            <td>{item.brand.id}</td>
            <td>{item.size}</td>
            <td>{item.count}</td>
            <td>{item.price}</td>
            <td>{item.extId}</td>
            <td>
              <ButtonToolbar>
                <ButtonGroup>
                  <Button id={item.id} type="button" bsSize="xsmall" bsStyle="info" placeholder="Edit item" onClick={this.modalOpen}>E</Button>
                </ButtonGroup>
                <ButtonGroup>
                  <Button id={item.id} type="button" bsSize="xsmall" bsStyle="warning" placeholder="Delete item" onClick={this.handleDelete}>x</Button>
                </ButtonGroup>
              </ButtonToolbar>
            </td>
          </tr>
        );
        return (
          <div>
              <Form inline onSubmit={this.handleUpload}>
                <FormGroup
                  controlId="formFile">
                  <ControlLabel>Import data from csv/xls</ControlLabel>
                  <FormControl
                    type="file"
                    placeholder="Upload csv/xsl file.."
                    onChange={this.handleChange}
                  />
                  <FormControl.Feedback />
                </FormGroup>
                <Button type="submit">Upload</Button>
              </Form>
              <Button
                  id="new"
                  bsStyle="primary"
                  bsSize="xsmall"
                  onClick={this.modalOpen}>
                  Create new
              </Button>
              <Table striped bordered condensed hover>
                  <thead>
                    <tr>
                      <th>Title</th>
                      <th>Brand</th>
                      <th>Size</th>
                      <th>Count</th>
                      <th>Price</th>
                      <th>External ID</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                      {items}
                  </tbody>
              </Table>
              <Pagination prev next first last ellipsis boundaryLinks
                  items={20}
                  maxButtons={5}
                  activePage={this.state.activePage}
                  onSelect={this.handlePageSelect} />
              <Modal show={this.state.showModal} onHide={this.modalClose} onSubmit={this.handleSubmit}>
                  <Modal.Header closeButton>
                      <Modal.Title>{this.state.currentItem.id ? 'Edit item' : 'Create new item'}</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    <Form onSubmit={this.handleEdit}>
                      <FormGroup
                        controlId="formItem">
                        <ControlLabel>Title</ControlLabel>
                        <FormControl type="input" placeholder="Title" defaultValue={this.state.currentItem.title}/>
                        <FormControl.Feedback />
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
