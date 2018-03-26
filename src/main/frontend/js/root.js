const React = require('react');
const ReactDOM = require('react-dom');



class Root extends React.Component {

	constructor(props) {
		super(props);
		this.state = {employees: []};
	}


	render() {
		return (
			<h1> Hello world</h1>
		)
	}
}



ReactDOM.render(
	<Root />,
	document.getElementById('root')
)