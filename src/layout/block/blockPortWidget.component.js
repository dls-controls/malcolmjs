import React from 'react';
import Radium from 'radium';
import { BaseWidget } from 'storm-react-diagrams';
import Typography from 'material-ui/Typography';

const styles = {
  container: {
    display: 'flex',
    alignItems: 'center',
  },
  port: {
    width: 16,
    height: 16,
    borderRadius: 8,
    ':hover': {
      background: 'rgb(192,255,0)',
    },
  },
  portIn: {
    marginRight: 3,
  },
  portOut: {
    marginLeft: 3,
  },
};

class BlockPortWidget extends BaseWidget {
  constructor(props) {
    super('malcolm-port', props);
    this.state = {
      selected: false,
    };
  }

  getClassName() {
    return `port ${super.getClassName()}${
      this.state.selected ? this.bem('--selected') : ''
    }`;
  }

  render() {
    const portStyle = {
      ...styles.port,
      ...(this.props.port.in ? styles.portIn : styles.portOut),
      background: this.props.portColour,
    };

    const port = (
      <div
        onMouseEnter={() => {
          this.setState({ selected: true });
        }}
        onMouseLeave={() => {
          this.setState({ selected: false });
        }}
        style={portStyle}
      />
    );
    const label = <Typography>{this.props.port.label}</Typography>;

    return (
      <div
        {...this.getProps()}
        style={styles.container}
        data-name={this.props.port.name}
        data-nodeid={this.props.port.getParent().getID()}
      >
        {this.props.port.in ? port : label}
        {this.props.port.in ? label : port}
      </div>
    );
  }
}

export default Radium(BlockPortWidget);
