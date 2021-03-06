import React from 'react';
import PropTypes from 'prop-types';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import NavigationClose from '@material-ui/icons/Close';
import OpenInNew from '@material-ui/icons/OpenInNew';

const styles = {
  toolbar: {
    minWidth: 320,
    display: 'flex',
    padding: '0 8px',
  },
  title: {
    flexGrow: 1,
  },
};

const DrawerHeader = props => (
  <div>
    <AppBar position="static">
      <Toolbar style={styles.toolbar}>
        <IconButton onClick={props.closeAction} data-cy="closedrawer">
          <NavigationClose />
        </IconButton>
        <Typography variant="subheading" color="inherit" style={styles.title}>
          {props.title}
        </Typography>
        <IconButton onClick={props.popOutAction}>
          <OpenInNew />
        </IconButton>
      </Toolbar>
    </AppBar>
  </div>
);

DrawerHeader.propTypes = {
  title: PropTypes.string.isRequired,
  closeAction: PropTypes.func.isRequired,
  popOutAction: PropTypes.func.isRequired,
};

export default DrawerHeader;
