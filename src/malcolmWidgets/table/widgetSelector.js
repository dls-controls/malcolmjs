import PropTypes from 'prop-types';
import { withTheme } from '@material-ui/core/styles';
import { selectorFunction } from '../attributeDetails/attributeSelector/attributeSelector.component';

export const getTableWidgetTags = meta => {
  if (meta && meta.elements) {
    return Object.keys(meta.elements).map(label => {
      const { tags } = meta.elements[label];
      const widgetTagIndex = tags.findIndex(
        t => t.indexOf('widget:') !== -1 || t.indexOf('info:') !== -1
      );
      if (widgetTagIndex !== -1) {
        return tags[widgetTagIndex];
      }
      return -1;
    });
  } else if (meta && meta.tags) {
    const widgetTagIndex = meta.tags.findIndex(
      t => t.indexOf('widget:') !== -1 || t.indexOf('info:') !== -1
    );
    if (widgetTagIndex !== -1) {
      return [meta.tags[widgetTagIndex]];
    }
    return [-1];
  }
  return [-1];
};

const TableWidgetSelector = props => {
  const isDisabled = !props.columnMeta.writeable;
  const isErrorState = false;
  const isDirty = false;
  const forceUpdate = false;
  const continuousSend = true;
  return selectorFunction(
    props.columnWidgetTag,
    props.rowPath,
    props.value instanceof Object &&
    Object.prototype.hasOwnProperty.call(props.value, 'label')
      ? props.value.label
      : props.value,
    props.rowChangeHandler,
    {
      isDisabled,
      isErrorState,
      isDirty,
    },
    props.setFlag,
    props.theme.palette.primary.light,
    { ...props.columnMeta, insideArray: true },
    forceUpdate,
    continuousSend,
    props.value !== undefined &&
    props.value !== null &&
    props.value.action instanceof Function
      ? () => props.value.action(props.rowPath)
      : undefined
  );
};

TableWidgetSelector.propTypes = {
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.bool,
    PropTypes.shape({
      label: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
        PropTypes.bool,
      ]),
      action: PropTypes.func,
    }),
  ]).isRequired,
  columnWidgetTag: PropTypes.string.isRequired,
  theme: PropTypes.shape({
    palette: PropTypes.shape({
      primary: PropTypes.shape({
        light: PropTypes.string,
      }),
      secondary: PropTypes.shape({
        main: PropTypes.string,
      }),
    }),
  }).isRequired,
  rowChangeHandler: PropTypes.func.isRequired,
  rowPath: PropTypes.shape({
    label: PropTypes.string,
    row: PropTypes.number,
  }).isRequired,
  columnMeta: PropTypes.shape({}).isRequired,
  setFlag: PropTypes.func.isRequired,
};

export default withTheme()(TableWidgetSelector);
