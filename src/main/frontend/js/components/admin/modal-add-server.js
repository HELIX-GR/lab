import React from "react";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import ServerForm from './server-form';
import { addNewServer } from '../../ducks/admin';


class ModalAddServer extends React.Component {
  constructor(props) {
    super(props);

    this.handleShow = this.handleShow.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.state = {
      show_modal: false,
      data: null
    };
  }


  handleClose() {
    this.setState({ show_modal: false });
  }

  handleShow() {
    this.setState({ show_modal: true });
  }
  handleChange(data) {
    this.setState({ data });
  }
  handleSubmit(data) {
    console.log(this.state.data);
    this.props.addNewServer(data)
      .then(this.setState({ show_modal: false }));

  }

  render() {
    return (
      <div>
        <Button onClick={this.handleShow}>Add Server </Button>
        <Dialog
          open={this.state.show_modal}
          onClose={this.handleClose}
        >

        <DialogTitle id="alert-dialog-title">{"Add a new server"}</DialogTitle>
          <DialogContent>
            <ServerForm finish={this.handleSubmit} onClose={this.handleClose} />
          </DialogContent>
          
        </Dialog>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
  };
}
const mapDispatchToProps = (dispatch) => bindActionCreators({ addNewServer }, dispatch);



export default ModalAddServer = connect(mapStateToProps, mapDispatchToProps)(ModalAddServer);