import React from 'react';

export class ButtonElement extends React.Component {

  render() {
    const {text, type, onClick} = this.props;

    return (
      <button className={'btn ' + type || 'btn-default'} onClick={onClick}>
        {text}
      </button>
    );
  }
}
