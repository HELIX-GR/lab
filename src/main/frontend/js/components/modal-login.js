import React from "react";
import LoginForm from './login-form';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';


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
    this.props.showIt(false);

  }

  handleShow() {
    this.props.showIt(true);
  }


  render() {
     if (this.props.show_login){
      this.state.show_login=true;
     }else{
      this.state.show_login=false;
     }
    return (
      <Dialog
        title="Sign In"
        //actions={actions}
        modal={false}
        open={this.state.show_login}
        onRequestClose={this.handleClose}
      >
        <div>
          <LoginForm />
        </div>
      </Dialog>
    );
  }
}

function mapStateToProps(state) {
  return {
    show_login: state.users.show_login
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(Object.assign({}, {}), dispatch)
  };
}


export default ModalLogin = connect(mapStateToProps, mapDispatchToProps)(ModalLogin);