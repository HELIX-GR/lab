import React from "react";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { LabHeader } from './header';
import CardLab from '../helpers/cardLab';
import ModalLogin from './modal-login';
import LoginForm from './login';
import { modalLoginAction } from '../ducks/users';
import { startNowAction } from '../ducks/app';
import { Carousel } from './landing/carousel';
import { JumpotronLab } from './landing/jumbotron';
import {  Route } from 'react-router-dom';
import  Filesystem  from './filesystem/filesystem';


class App extends React.Component {
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
      <LabHeader username={this.props.username} onclicks={this.props.modalLoginAction} />
      <Route exact={true} path="/" render= {() => (
        <div>
          <Carousel/>
          <JumpotronLab startnow={start_now} target={this.props.target}/>
          <div className="card-deck container-fluid centered">
            <CardLab title='Introduction to Python 2.7' text='Learn the basics of Python 3 in Lab Notebooks. Learn Python syntax, standard data types, as well as how to write a simple program.' imagesrc='https://upload.wikimedia.org/wikipedia/commons/thumb/c/c3/Python-logo-notext.svg/480px-Python-logo-notext.svg.png'/>
            <CardLab title='Introduction to R' text='Get a brief introduction to charting and graphing capabilities of R in the Jupyter Notebook. You will learn how to make line charts, pie charts and scatter plots.' imagesrc='https://www.r-project.org/logo/Rlogo.png' />
            <CardLab title='Introduction to  Python3.5' text='Learn the basics of Python 3 in Lab Notebooks. Learn Python syntax, standard data types, as well as how to write a simple program.' imagesrc ='https://upload.wikimedia.org/wikipedia/commons/thumb/c/c3/Python-logo-notext.svg/480px-Python-logo-notext.svg.png'/>
            <CardLab title='Introduction to  Julia' text='Learn the basics of Julia in Lab Notebooks. Julia is a high-level, high-performance dynamic programming language for numerical computing.' imagesrc ='https://raw.githubusercontent.com/JuliaGraphics/julia-logo-graphics/master/images/three-balls.png'/>
          </div>
        </div>)} />
      <Route  path="/filesystem" render= {() => (
        <div>
         <Filesystem/>
        </div>)}/>
      <ModalLogin showIt={this.props.modalLoginAction}/>
      
     
      

      <footer className="text-muted bg-dark">
        <div>
          <p className="float-right">
            <a href="#">Back to top</a>
          </p>
          <p>This is Helix Lab </p>
          <p>New to Helix Lab? <a href="../../">See our About page</a> or read our <a href="../../getting-started/">getting started guide</a>.</p>
        </div>
      </footer>
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


const mapDispatchToProps = (dispatch) => bindActionCreators({ modalLoginAction , startNowAction }, dispatch);





export default connect(mapStateToProps, mapDispatchToProps)(App);