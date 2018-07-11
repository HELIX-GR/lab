import React from "react";
import LoginForm from './login-form';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import {  Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';


const styles = theme => ({
  paper: {
    position: 'absolute',
    width: theme.spacing.unit * 50,
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing.unit * 4,
  },
});
class ModalLogin extends React.Component {
  constructor(props) {
    super(props);

    this.handleShow = this.handleShow.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.state = {
      show_login: false
    };
  }
  componentWillMount() {
    this.state.show_login = this.props.show_login;
  }

  handleClose() {
    this.props.showIt(!this.state.show_login);

  }

  handleShow() {
    this.props.showIt(true);
  }


  render() {
    const { classes } = this.props;

    if (this.props.show_login) {
      this.state.show_login = true;
    } else {
      this.state.show_login = false;
    }
    return (
      <Modal
        isOpen={this.state.show_login}
        toggle={this.handleClose}
      >
        <ModalHeader toggle={this.handleClose}>Login </ModalHeader>
        <ModalBody>
          <LoginForm />
        </ModalBody>

      </Modal>
    );
  }
}
ModalLogin.propTypes = {
  classes: PropTypes.object.isRequired,
};

function mapStateToProps(state) {
  return {
    show_login: state.user.show_login
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(Object.assign({}, {}), dispatch)
  };
}


ModalLogin = connect(mapStateToProps, mapDispatchToProps)(ModalLogin);

ModalLogin = withStyles(styles)(ModalLogin);

export default ModalLogin;