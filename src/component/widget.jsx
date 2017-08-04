import React from 'react';
import ReactDomServer from 'react-dom/server';
import ReactDOM from 'react-dom';

import {ButtonElement} from 'element/button.jsx';

export class Widget extends React.Component {

  constructor(props) {
    super(props);

    const {show} = this.props;

    // DEFINE DEFAULT STATE
    this.state = {
      show: show === true,
      counter: 0
    };

    this.clickMe = (e) => this._clickMe(e);
    this.showModal = (e) => this._showModal(e);
  }

  _clickMe() {
    console.log('Event Click');

    this.setState((prevState, props) => {
      return {counter: prevState.counter + props.step};
    });
  }

  _showModal() {
    this.setState({show: true});
  }

  componentWillMount() {
    console.log('Widget.componentWillMount');
  }

  componentDidMount() {
    console.log('Widget.componentDidMount');
  }

  componentWillUpdate() {
    console.log('Widget.componentWillUpdate');
  }

  componentDidUpdate() {
    console.log('Widget.componentDidUpdate');
  }

  render() {
    console.log('Widget.render');
    const {name, age} = this.props;
    const {counter} = this.state;

    return (
      <div className="panel">
        <div className="panel-body">
          <div>Widget {name + ': ' + age}</div>
          <div>Count {counter}</div>
          <div className="btn-group text-center">
            <ButtonElement type="btn-success" text="Count" onClick={this.clickMe} />
            <ButtonElement type="btn-danger" text="Modal" onClick={this.showModal} />
          </div>
        </div>
      </div>
    );
  }
}

Widget.defaultProps = {
  show: false,
  step: 1
};

export function render(data, elm) {
  return ReactDOM.render(<Widget {...data} />, elm);
}

export function renderToString(data) {
  return ReactDomServer.renderToString(<Widget {...data} />);
}