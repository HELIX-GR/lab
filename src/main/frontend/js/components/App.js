import React from "react";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { LabHeader } from './header';
import  CardLab  from '../helpers/cardLab';
import { ModalLogin, ModalLoginBtn } from './modal-login';
import LoginForm from './login';

class App extends React.Component {
  constructor(props) {
		super(props);
		this.state = {
      success: null,
      error: null,
      loading: null,
      statistics: null};
	}
  render() {
    return   (
    <div >
      <LabHeader/>
      <div id="carouselExampleIndicators" className="carousel slide "  data-ride="carousel">
        <ol className="carousel-indicators" >
          <li data-target="#carouselExampleIndicators" data-slide-to="0"
            className="active"></li>
          <li data-target="#carouselExampleIndicators" data-slide-to="1"></li>
        </ol>
        <div className="carousel-inner">
          <div className="carousel-item active">
            <img className="d-block w-50 centered" src="images/helix.png" alt="First slide"/>
          </div>
        <div className="carousel-item">
          <img className="d-block w-50" src="images/helix.png" alt="Second slide"/>
        </div>
      </div>
      <a className="carousel-control-prev" href="#carouselExampleIndicators"
        role="button" data-slide="prev">
        <span className="carousel-control-prev-icon" aria-hidden="true"></span>
        <span className="sr-only">Previous</span>
      </a>
      <a className="carousel-control-next" href="#carouselExampleIndicators"
        role="button" data-slide="next">
        <span className="carousel-control-next-icon" aria-hidden="true"></span>
        <span className="sr-only">Next</span>
      </a>
    </div>
    <div className="jumbotron text-align-center">
      <div>
        <h1 className="display-4">Welcome to Helix Lab!</h1>
        <p className="lead">Interactive coding in your browser|</p>
        <hr className="my-4"/>
        <p>Free, in the cloud, powered by Jupyter</p>
        <p className="lead">
          <a className="btn btn-primary btn-lg" data-toggle="modal" data-target="#exampleModalCenter" role="button">Start Now</a>
        </p>

        <ModalLogin />

      </div> 
    </div>  
    <div/>
    <div className="card-deck container centered">
        <CardLab title='Introduction to Python 2.7' text='Learn the basics of Python 3 in Lab Notebooks. Learn Python syntax, standard data types, as well as how to write a simple program.' imagesrc='https://upload.wikimedia.org/wikipedia/commons/thumb/c/c3/Python-logo-notext.svg/480px-Python-logo-notext.svg.png'/>
        <CardLab title='Introduction to R' text='Get a brief introduction to charting and graphing capabilities of R in the Jupyter Notebook. You will learn how to make line charts, pie charts and scatter plots.' imagesrc='https://www.r-project.org/logo/Rlogo.png' />
        <CardLab title='Introduction to  Python3.5' text='Learn the basics of Python 3 in Lab Notebooks. Learn Python syntax, standard data types, as well as how to write a simple program.' imagesrc ='https://upload.wikimedia.org/wikipedia/commons/thumb/c/c3/Python-logo-notext.svg/480px-Python-logo-notext.svg.png'/>
        <CardLab title='Introduction to  Julia' text='Learn the basics of Julia in Lab Notebooks. Julia is a high-level, high-performance dynamic programming language for numerical computing.' imagesrc ='https://raw.githubusercontent.com/JuliaGraphics/julia-logo-graphics/master/images/three-balls.png'/>
      </div>
  <footer className="text-muted bg-dark">
      <div className="container">
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
    success: state.success,
    error: state.error,
    datasetAction: state.datasetAction,
    loading: state.loading,
    statistics: state.statistics
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions : bindActionCreators(Object.assign({}, {}) , dispatch)
  };
}




export default connect(mapStateToProps, mapDispatchToProps)(App);