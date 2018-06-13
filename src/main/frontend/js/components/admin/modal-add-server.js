import React from "react";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import ServerForm from './server-form';
import { addNewServer } from'../../ducks/admin';


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
        <FlatButton onClick={this.handleShow} label="Add Server" />
        <Dialog
          title="Add a new server"
          //actions={actions}
          modal={false}
          open={this.state.show_modal}
          onRequestClose={this.handleClose}
        >
          <div>
            <ServerForm finish={this.handleSubmit} onClose={this.handleClose}/>
          </div>
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