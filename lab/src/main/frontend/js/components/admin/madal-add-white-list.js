import React from "react";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import WhiteListForm from './white-list-form';
import { addWhiteList } from '../../ducks/admin';
import Button from '@material-ui/core/Button';



class ModalAddWhiteList extends React.Component {
  constructor(props) {
    super(props);

    this.handleShow = this.handleShow.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.state = {
      open: false,
      
    };
  }
  componentWillMount() {
    this.state.show_login = this.props.show_login;
  }

  handleClose() {
    this.setState({ open: false });
  }

  handleShow() {
    this.setState({ open: true });
  }


  handleSubmit(userInfo) {
    this.props.addWhiteList(userInfo);
  }

  render() {

    return (
      <div>
        <Button onClick={this.handleShow}>Whitelist a User</Button>
        <Modal className="modal-dialog-centered"
          isOpen={this.state.open}
          toggle={this.handleClose}
        >
          <ModalHeader toggle={this.handleClose}> Users White List </ModalHeader>
          <ModalBody>
            <WhiteListForm finish={this.handleSubmit} onClose={this.handleClose}/>

          </ModalBody>

        </Modal>
      </div>
    );
  }
}


function mapStateToProps(state) {
  return {

  };
}

const mapDispatchToProps = (dispatch) => bindActionCreators({ addWhiteList, }, dispatch);



export default ModalAddWhiteList = connect(mapStateToProps, mapDispatchToProps)(ModalAddWhiteList);


