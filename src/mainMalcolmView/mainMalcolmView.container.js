import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import DrawerContainer from '../drawerContainer/drawerContainer.component';
import BlockDetails from '../blockDetails/blockDetails.component';
import MiddlePanelContainer from './middlePanel.container';
import Palette from '../layout/palette/palette.component';
// eslint-disable-next-line import/no-named-as-default
import InfoDetails from '../infoDetails/infoDetails.component';
import NavTypes from '../malcolm/NavTypes';

const blockDetailsUrl = (rootUrl, blockPath) =>
  `${rootUrl}/details/${blockPath}`;

const popOutFunction = (rootUrl, width, blockPath) =>
  window.open(
    blockDetailsUrl(rootUrl, blockPath),
    blockPath,
    `width=${width},height=${window.innerHeight}`
  );

const childPanelSelector = props => {
  if (props.showPalette) {
    return <Palette />;
  } else if (props.showInfo) {
    return <InfoDetails />;
  }
  return <BlockDetails />;
};

const MainMalcolmView = props => (
  <div>
    <DrawerContainer
      parentTitle={props.parentBlockTitle}
      parentMRI={props.parentBlock}
      popOutAction={popOutFunction}
      childTitle={props.childBlockTitle}
      childMRI={props.childBlock}
    >
      <BlockDetails parent />
      <MiddlePanelContainer />
      {childPanelSelector(props)}
    </DrawerContainer>
  </div>
);

const mapStateToProps = state => {
  const parentBlock = state.malcolm.parentBlock
    ? state.malcolm.blocks[state.malcolm.parentBlock]
    : undefined;

  const childBlock = state.malcolm.childBlock
    ? state.malcolm.blocks[state.malcolm.childBlock]
    : undefined;

  const { navigationLists } = state.malcolm.navigation;
  const matchingNavItem = navigationLists.find(
    nav => nav.path === state.malcolm.childBlock
  );
  const navType = matchingNavItem ? matchingNavItem.navType : undefined;
  const showPalette = navType === NavTypes.Palette;
  const showInfo = navType === NavTypes.Info;

  let parentBlockTitle = parentBlock ? parentBlock.name : '';
  if (parentBlock && parentBlock.label) {
    parentBlockTitle = parentBlock.label;
  }

  let childBlockTitle = childBlock ? childBlock.name : '';
  if (childBlock && childBlock.label) {
    childBlockTitle = childBlock.label;
  }
  if (showPalette) {
    childBlockTitle = 'Palette';
  } else if (showInfo) {
    childBlockTitle = 'Info';
  }

  return {
    parentBlock: state.malcolm.parentBlock,
    parentBlockTitle,
    childBlock: state.malcolm.childBlock,
    childBlockTitle,
    showPalette,
    showInfo,
  };
};

const mapDispatchToProps = () => ({});

MainMalcolmView.propTypes = {
  parentBlockTitle: PropTypes.string,
  childBlockTitle: PropTypes.string,
  parentBlock: PropTypes.string,
  childBlock: PropTypes.string,
};

childPanelSelector.propTypes = {
  showPalette: PropTypes.bool.isRequired,
  showInfo: PropTypes.bool.isRequired,
};

MainMalcolmView.defaultProps = {
  parentBlockTitle: '',
  childBlockTitle: '',
  parentBlock: '',
  childBlock: '',
};

export default connect(mapStateToProps, mapDispatchToProps)(MainMalcolmView);
