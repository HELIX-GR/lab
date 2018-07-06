import * as React from 'react';



class CardLab extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {

    return (
      <div className="card lab-card animated fadeIn">
        <div style={{ height: 120 + 'px', width: 120 + 'px', marginLeft: 'auto', marginRight: 'auto' }} >
          <img className="card-img-top" style={{ height: 120 + 'px', width: 120 + 'px', marginLeft: 'auto', marginRight: 'auto' }} src={this.props.imagesrc} alt="Card image cap" />
        </div>
        <div className="card-body">
          <h4 className="card-title">{this.props.title}</h4>
          <p className="card-text">{this.props.text}</p>
          <a href="#" className="btn btn-primary">Explore</a>
        </div>
      </div>);
  }
}
export default CardLab;