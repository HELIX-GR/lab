import React from "react";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import {  Route } from 'react-router-dom';

class Filesystem extends React.Component {
  constructor(props) {
    super(props);
    
		this.state = {
      username:null,
      show_login:false,
    };
  }
  
  

  render() {

    if (!this.props.username){
      var start_now = () => {this.props.modalLoginAction(true)};
    }else{
      var start_now = this.props.startNowAction;
    }
    return   (
    <div >
     
    </div>)
}
}
function mapStateToProps(state) {
  return {
    username: state.users.username,
    show_login: state.users.show_login,
    target: state.app.target,
  };
}


const mapDispatchToProps = (dispatch) => bindActionCreators({ }, dispatch);





export default connect(mapStateToProps, mapDispatchToProps)(Filesystem);