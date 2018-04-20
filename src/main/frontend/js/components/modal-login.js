import React from "react";
import LoginForm  from './login';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';



class ModalLogin extends React.Component{
  constructor(props) {
    super(props);

    this.handleShow = this.handleShow.bind(this);
    this.handleClose = this.handleClose.bind(this);
		this.state = {
      show_login: false
    };
  }

  handleClose() {
    this.props.showIt(false);
    
  }

  handleShow() {
    this.props.showIt(true);
  }


  render(){
    if (this.props.show_login){
      return(
        <div className="modal fade show" id="exampleModalCenter" tabIndex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true" style={{display: 'block', paddingRight: 15+'px'}}>
          <div className="modal-dialog modal-dialog-centered" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLongTitle">Sign In</h5>
                <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={this.handleClose}>
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">
              <LoginForm />
              </div>
            </div>
          </div>
        </div>
      );
    }else {
      return (null);
    }
  }
}

function mapStateToProps(state) {
  return {
    show_login: state.users.show_login
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions : bindActionCreators(Object.assign({}, {}) , dispatch)
  };
}


export default connect(mapStateToProps, mapDispatchToProps)(ModalLogin);