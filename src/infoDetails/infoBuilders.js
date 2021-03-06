/* eslint no-underscore-dangle: 0 */
import { AlarmStates } from '../malcolmWidgets/attributeDetails/attributeAlarm/attributeAlarm.component';
import { sinkPort } from '../malcolm/malcolmConstants';
import {
  malcolmTypes,
  isArrayType,
  Widget,
} from '../malcolmWidgets/attributeDetails/attributeSelector/attributeSelector.component';

// eslint-disable-next-line import/prefer-default-export
export const buildAttributeInfo = props => {
  let value;
  const info = {};
  const { attribute } = props;
  if (
    attribute &&
    attribute.raw &&
    attribute.raw.meta &&
    !attribute.calculated.isMethod
  ) {
    if (props.subElement === undefined) {
      info.path = {
        label: 'Attribute path',
        value: `${props.attribute.calculated.path[0]}, ${
          props.attribute.calculated.path[1]
        }`,
        inline: true,
      };
      info.meta = {
        label: 'Meta Data',
        malcolmType: {
          valuePath: 'raw.meta.typeid',
          label: 'Type ID',
          inline: true,
        },
        description: {
          valuePath: 'raw.meta.description',
          label: 'Description',
          inline: true,
        },
        writeable: {
          valuePath: 'raw.meta.writeable',
          label: 'Writeable?',
          inline: true,
          tag: Widget.LED,
        },
      };
      if (attribute.raw.meta.display) {
        info.meta = {
          ...info.meta,
          ...attribute.raw.meta.display,
        };
      }
      info.malcolmAlarm = {
        label: 'Alarm',
      };
      Object.keys(attribute.raw.alarm).forEach(key => {
        info.malcolmAlarm[key] = {
          label: key,
          inline: true,
          valuePath: `raw.alarm.${key}`,
        };
        if (key === 'severity') {
          info.malcolmAlarm[key].alarmStatePath = 'calculated.alarms.rawAlarm';
        }
      });

      info.malcolmAlarm.message = {
        label: 'message',
        inline: true,
        valuePath: 'raw.alarm.message',
      };

      info.timeStamp = {
        label: 'Time Stamp',
        time: {
          label: 'time',
          inline: true,
          valuePath: 'calculated.timeStamp',
        },
      };
      Object.keys(attribute.raw.timeStamp).forEach(key => {
        info.timeStamp[key] = {
          label: key,
          inline: true,
          valuePath: `raw.timeStamp.${key}`,
        };
      });
      info.errorState = {
        label: 'Last Put Status',
        valuePath: 'calculated.errorMessage',
        inline: true,
        alarmStatePath: 'calculated.alarms.errorState',
      };
      if (props.clearError) {
        info.acknowledgeError = {
          showLabel: false,
          label: 'Acknowledge Error',
          value: 'Acknowledge Error',
          disabledPath: 'NOT.calculated.errorState',
          inline: true,
          tag: Widget.i_BUTTON,
          functions: {
            clickHandler: () => props.clearError(attribute.calculated.path),
          },
        };
      }
      if (
        attribute.raw.meta.tags.some(a =>
          [Widget.TABLE, Widget.TEXTINPUT, Widget.FLOWGRAPH].includes(a)
        )
      ) {
        info.localState = {
          label: 'Discard Local State',
          value: 'Discard Local State',
          showLabel: false,
          disabledPath: 'NOT.calculated.dirty',
          inline: true,
          tag: Widget.i_BUTTON,
          alarmStatePath: 'calculated.alarms.dirty',
        };
        if (props.revertHandler) {
          info.localState.functions = {
            clickHandler: () => {
              props.revertHandler(props.attribute.calculated.path);
            },
          };
        }
        if (
          attribute.raw.meta.tags.some(a => a === Widget.TEXTINPUT) &&
          !isArrayType(attribute.raw.meta)
        ) {
          info.remoteState = {
            label: 'Remote state',
            value: attribute.raw.value,
            tag: Widget.TEXTINPUT,
            inline: true,
          };
        }
      }
      ({ value } = attribute.raw);
      if (attribute.raw.meta.typeid === malcolmTypes.table) {
        info.columnHeadings = {
          label: 'Columns',
          value: JSON.stringify(Object.keys(attribute.raw.meta.elements)),
          inline: true,
        };
      }
    } else if (
      (attribute.raw.meta.typeid === malcolmTypes.table ||
        isArrayType(attribute.raw.meta)) &&
      attribute.localState
    ) {
      if (props.subElement[0] === 'row') {
        const row = parseInt(props.subElement[1], 10);
        const rowFlags = attribute.localState.flags.rows[row];
        const isNewRow = isArrayType(attribute.raw.meta)
          ? row >= attribute.raw.value.length
          : row >= attribute.raw.value[attribute.localState.labels[0]].length;
        info.localState = {
          label: 'Row local state',
          showLabel: false,
          value: 'Discard row local state',
          disabled: !(rowFlags._dirty || rowFlags._isChanged) || isNewRow,
          inline: true,
          tag: Widget.i_BUTTON,
          alarmState:
            rowFlags._dirty || rowFlags._isChanged ? AlarmStates.DIRTY : null,
        };
        const dataRow = {};
        if (!isArrayType(attribute.raw.meta)) {
          attribute.localState.labels.forEach(label => {
            dataRow[label] =
              row < attribute.raw.value[label].length
                ? attribute.raw.value[label][row]
                : 'undefined';
          });
        } else {
          dataRow.value =
            row < attribute.raw.value.length
              ? attribute.raw.value[row]
              : 'undefined';
        }
        if (attribute.localState.flags.table.extendable) {
          info.rowOperations = {
            label: 'Row Operations',
            moveRowUp: {
              label: 'Shift row up',
              value: 'Shift row up',
              showLabel: false,
              disabled: row === 0,
              tag: Widget.i_BUTTON,
            },
            moveRowDown: {
              label: 'Shift row down',
              value: 'Shift row down',
              showLabel: false,
              disabled: row === attribute.localState.value.length - 1,
              tag: Widget.i_BUTTON,
            },
            addRowAbove: {
              label: 'Insert row above',
              value: 'Insert row above',
              showLabel: false,
              tag: Widget.i_BUTTON,
            },
            addRowBelow: {
              label: 'Insert row below',
              value: 'Insert row below',
              showLabel: false,
              tag: Widget.i_BUTTON,
            },
            deleteRow: {
              label: 'Delete row',
              value: 'Delete row',
              inline: true,
              showLabel: false,
              tag: Widget.i_BUTTON,
            },
          };

          if (props.addRow) {
            info.rowOperations.addRowAbove.functions = {
              clickHandler: () => {
                props.addRow(props.attribute.calculated.path, row);
                props.changeInfoHandler(
                  props.attribute.calculated.path,
                  `row.${row + 1}`
                );
              },
            };
            info.rowOperations.addRowBelow.functions = {
              clickHandler: () => {
                props.addRow(props.attribute.calculated.path, row, 'below');
              },
            };
            info.rowOperations.deleteRow.functions = {
              clickHandler: () => {
                if (row >= props.attribute.localState.value.length - 1) {
                  if (row !== 0) {
                    props.changeInfoHandler(
                      props.attribute.calculated.path,
                      `row.${row - 1}`
                    );
                  } else {
                    props.closeInfoHandler(props.attribute.calculated.path);
                  }
                }
                props.addRow(props.attribute.calculated.path, row, 'delete');
              },
            };
          }
          if (props.moveRow) {
            info.rowOperations.moveRowUp.functions = {
              clickHandler: () => {
                props.moveRow(props.attribute.calculated.path, row);
                props.changeInfoHandler(
                  props.attribute.calculated.path,
                  `row.${row - 1}`
                );
              },
            };
            info.rowOperations.moveRowDown.functions = {
              clickHandler: () => {
                props.moveRow(props.attribute.calculated.path, row, 'below');
                props.changeInfoHandler(
                  props.attribute.calculated.path,
                  `row.${row + 1}`
                );
              },
            };
          }
        }
        info.rowValue = {
          label: 'Row remote state',
          ...dataRow,
        };

        if (props.rowRevertHandler) {
          info.localState.functions = {
            clickHandler: () => {
              props.rowRevertHandler(
                props.attribute.calculated.path,
                dataRow,
                row
              );
            },
          };
        }
      } else {
        // column info will go here eventually
        info.columnHeading = {
          label: 'Column',
          value: props.subElement[1],
          inline: true,
        };
        info.columnDescription = {
          label: 'Description',
          value: attribute.raw.meta.elements[props.subElement[1]].description,
          inline: true,
        };
        info.columnType = {
          label: 'Type',
          value: attribute.raw.meta.elements[props.subElement[1]].typeid,
          inline: true,
        };
        info.columnWriteable = {
          label: 'Writeable',
          value: attribute.raw.meta.elements[props.subElement[1]].writeable,
          inline: true,
        };
      }
    }
  } else if (
    attribute &&
    attribute.calculated &&
    attribute.calculated.isMethod
  ) {
    if (props.subElement === undefined) {
      info.path = {
        label: 'Attribute path',
        value: `${attribute.calculated.path[0]}, ${
          attribute.calculated.path[1]
        }`,
        inline: true,
      };
      info.meta = {
        label: 'Meta Data',
        malcolmType: {
          value: attribute.raw.meta.typeid,
          label: 'Type ID',
          inline: true,
        },
        description: {
          value: attribute.raw.meta.description,
          label: 'Description',
          inline: true,
        },
        writeable: {
          value: attribute.raw.meta.writeable,
          label: 'Writeable?',
          inline: true,
          tag: Widget.LED,
        },
      };
      /*
      if (attribute.raw.meta.display) {
        info.meta = {
          ...info.meta,
          ...attribute.raw.meta.display,
        };
      }
      */
      if (Object.keys(attribute.raw.meta.takes.elements).length > 0) {
        info.takes = { label: 'Input parameter types' };
        Object.keys(attribute.raw.meta.takes.elements).forEach(input => {
          info.takes[input] = {
            label: attribute.raw.meta.takes.elements[input].label,
            value: attribute.raw.meta.takes.elements[input].typeid,
            infoPath: {
              root: attribute.calculated.path,
              subElement: `takes.${input}`,
            },
          };
        });
        if (props.clearParamState) {
          info.takes.discardParams = {
            showLabel: false,
            label: 'Discard params',
            value: 'Discard params',
            tag: Widget.i_BUTTON,
            functions: {
              clickHandler: () => {
                Object.keys(attribute.raw.meta.takes.elements).forEach(
                  input => {
                    props.clearParamState(attribute.calculated.path, input);
                  }
                );
              },
            },
          };
        }
      }
      if (Object.keys(attribute.raw.meta.returns.elements).length > 0) {
        info.returns = { label: 'Output parameter types' };
        Object.keys(attribute.raw.meta.returns.elements).forEach(input => {
          info.returns[input] = {
            label: attribute.raw.meta.returns.elements[input].label,
            value: attribute.raw.meta.returns.elements[input].typeid,
            infoPath: {
              root: attribute.calculated.path,
              subElement: `returns.${input}`,
            },
          };
        });
      }
      info.errorState = {
        label: 'Last Post Status',
        inline: true,
        value: attribute.calculated.errorMessage,
        alarmState: attribute.calculated.errorState
          ? AlarmStates.MAJOR_ALARM
          : null,
      };
      if (props.clearError) {
        info.acknowledgeError = {
          showLabel: false,
          label: 'Acknowledge Error',
          value: 'Acknowledge Error',
          disabledPath: 'NOT.calculated.errorState',
          inline: true,
          tag: Widget.i_BUTTON,
          functions: {
            clickHandler: () => props.clearError(attribute.calculated.path),
          },
        };
      }
    } else {
      info.parameterType = {
        label: 'Parameter Type',
        inline: true,
        value: props.subElement[0] === 'takes' ? 'Input' : 'Output',
      };
      info.typeid =
        attribute.raw.meta[props.subElement[0]].elements[
          props.subElement[1]
        ].typeid;
      info.description = {
        label: 'Description',
        inline: true,
        value:
          attribute.raw.meta[props.subElement[0]].elements[props.subElement[1]]
            .description,
      };
      if (props.subElement[0] === 'takes') {
        info.required = {
          label: 'Required?',
          inline: true,
          value: attribute.raw.meta.takes.required.includes(
            props.subElement[1]
          ),
        };
        info.defaultValue = {
          label: 'Default Value',
          inline: true,
          value:
            attribute.raw.meta.defaults[props.subElement[1]] !== undefined
              ? attribute.raw.meta.defaults[props.subElement[1]]
              : 'undefined',
        };
        if (props.clearParamState) {
          info.discardParams = {
            showLabel: false,
            label: 'Discard param',
            value: 'Discard param',
            inline: true,
            tag: Widget.i_BUTTON,
            functions: {
              clickHandler: () => {
                props.clearParamState(
                  attribute.calculated.path,
                  props.subElement[1]
                );
              },
            },
          };
        }
      }
    }
  }
  return { info, value };
};

export const linkInfo = props => {
  const portAttribute = props.attribute;

  if (!portAttribute || !portAttribute.raw.value) {
    return { ...props, info: {}, value: {} };
  }

  const blockMri = props.attribute.calculated.path[0];
  const blockName = props.linkBlockName;
  const portName = props.attribute.calculated.path[1];

  const portNullValue = portAttribute.raw.meta.tags
    .find(t => t.indexOf(sinkPort) > -1)
    .split(':')
    .slice(-1)[0];

  /*
  const layout = props.layoutAttribute.raw.value;
  const sourceIndex = -1;
  const sinkIndex = layout.mri.findIndex(a => a === blockMri);
  */
  const info = {
    sourcePort: {
      label: 'Source',
      valuePath: 'raw.value',
      inline: true,
      tag: portAttribute.raw.meta.choices ? Widget.COMBO : Widget.TEXTINPUT,
      choices: portAttribute.raw.meta.choices,
      disabled: props.isLayoutLocked || !portAttribute.raw.meta.writeable,
      functions: {
        eventHandler: (nullPath, value) =>
          props.eventHandler([blockMri, portName, 'value'], value),
        setFlag: () => {},
      },
    },
    sinkPort: {
      label: 'Sink',
      value: `${blockName}.${portName}`,
      inline: true,
    },
    /*
    showSource: {
      label: '',
      value: 'Show Source',
      inline: true,
      tag: Widget.i_BUTTON,
      showLabel: false,
      disabled:
        layout.visible[sourceIndex] ||
        props.isLayoutLocked ||
        portAttribute.raw.value === portNullValue,
      functions: {
        clickHandler: () => {
          if (sourceIndex !== -1) {
            props.eventHandler(props.layoutAttribute.calculated.path, {
              mri: [layout.mri[sourceIndex]],
              name: [layout.name[sourceIndex]],
              visible: [true],
              x: [layout.x[sinkIndex] - 180],
              y: [layout.y[sinkIndex]],
            });
          }
        },
      },
    },
    */
    deleteLink: {
      label: '',
      value: 'Delete',
      inline: true,
      tag: Widget.i_BUTTON,
      showLabel: false,
      disabled:
        props.isLayoutLocked ||
        !portAttribute.raw.meta.writeable ||
        portAttribute.raw.value === portNullValue,
      functions: {
        clickHandler: () => {
          props.eventHandler([blockMri, portName, 'value'], portNullValue);
          props.unselectLink([blockMri, portName]);
        },
      },
    },
  };
  if (props.badge.attribute) {
    info[props.badge.name] = {
      label: props.badge.attribute.raw.meta.label,
      blockName: props.badge.block,
      attributeName: props.badge.name,
      valuePath: 'raw.value',
      inline: true,
      tag: Widget.TEXTINPUT,
      disabled:
        props.isLayoutLocked || !props.badge.attribute.raw.meta.writeable,
      functions: {
        eventHandler: (nullPath, value) =>
          props.eventHandler(
            [props.badge.block, props.badge.name, 'value'],
            value
          ),
        setFlag: () => {},
      },
    };
  }

  return {
    info,
    value: {},
  };
};
