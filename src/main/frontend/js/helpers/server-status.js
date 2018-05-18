import React from "react";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import FlatButton from 'material-ui/FlatButton';

import Paper from 'material-ui/Paper';
import  { getUserInfoAction }  from '../ducks/app';


class ServerStatus extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      value: 1,
    };
    

  }
componentWillMount = () => {
  this.props.getUserInfoAction();
}


  render() {
    let a;
    if (this.props.status && this.props.status.server){
      a=this.props.status.server;
    }
    else {
      a = "no active server";
    }
    
    return (
      <div>
      <Paper style={{
            height: 30,
            width: 200,
            margin: 10,
            textAlign: 'center',
            display: 'inline-block',
            float: 'right',
          }} zDepth={3}> 
          {a} 
          <FlatButton onClick={this.props.getUserInfoAction}><i className="fa fa-refresh" aria-hidden="true"></i></FlatButton>
          
          </Paper >
      </div>);
  }

}
/*ServerStatus.propTypes = {
  onclick: PropTypes.func.isRequired,
  table_path: PropTypes.string.isRequired,
  selected_file: PropTypes.string.isRequired,
  target: PropTypes.string.isRequired,
};*/


function mapStateToProps(state) {
  return {
    status: state.app.status,
    target: state.app.target,
  };
}


const mapDispatchToProps = (dispatch) => bindActionCreators( { getUserInfoAction, }, dispatch);



export default ServerStatus = connect(mapStateToProps, mapDispatchToProps)(ServerStatus);