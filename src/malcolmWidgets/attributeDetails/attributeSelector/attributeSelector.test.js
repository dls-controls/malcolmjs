import React from 'react';
import { createShallow, createMount } from '@material-ui/core/test-utils';
import configureStore from 'redux-mock-store';
import AttributeSelector, {
  selectorFunction,
  getDefaultFromType,
  Widget,
} from './attributeSelector.component';
import navigationActions from '../../../malcolm/actions/navigation.actions';
import { parentPanelTransition } from '../../../viewState/viewState.actions';

jest.useFakeTimers();

jest.mock('../../../malcolm/actions/navigation.actions');

describe('AttributeSelector', () => {
  let shallow;
  let mockStore;
  let mount;

  beforeEach(() => {
    navigationActions.navigateToAttribute.mockImplementation(
      (blockName, attribute) => ({
        type: 'TEST',
        blockName,
        attribute,
      })
    );

    mockStore = configureStore();
    shallow = createShallow({ dive: true });
    mount = createMount();
  });

  const buildAttribute = (widget, value, choices) => {
    const tag = widget ? `widget:${widget}` : 'notAWidget';
    if (choices) {
      return {
        raw: {
          meta: {
            tags: [tag],
            writeable: true,
            choices,
          },
          value,
        },
        calculated: {
          path: ['test1', 'attr'],
          name: 'attribute1',
        },
      };
    }
    return {
      raw: {
        meta: {
          tags: [tag],
          writeable: true,
        },
        value,
      },
      calculated: {
        path: ['test1', 'attr'],
        name: 'attribute1',
      },
    };
  };

  const buildState = (attribute, isGrandchild = false) => ({
    malcolm: {
      blocks: {
        PANDA1: {
          attributes: [attribute],
        },
      },
      childBlock: isGrandchild ? 'PANDA1' : undefined,
    },
  });

  const runSelectorTest = attribute => {
    const wrapper = shallow(
      <AttributeSelector
        blockName="PANDA1"
        attributeName="attribute1"
        store={mockStore(buildState(attribute))}
        forceOpen
      />
    );
    expect(wrapper.dive()).toMatchSnapshot();
  };

  it('shows a bug icon if the widget is not handled', () => {
    const attribute = buildAttribute('unknown', {});
    runSelectorTest(attribute);
  });

  it('selects an LED correctly', () => {
    const attribute = buildAttribute('led', true);
    runSelectorTest(attribute);
  });

  it('selects a checkbox correctly', () => {
    const attribute = buildAttribute('checkbox', true);
    runSelectorTest(attribute);
  });

  it('selects an textUpdate correctly', () => {
    const attribute = buildAttribute('textupdate', '1.23456');
    runSelectorTest(attribute);
  });

  it('selects a comboBox correctly', () => {
    const attribute = buildAttribute('combo', '1', ['1', '2', '3']);
    runSelectorTest(attribute);
  });

  it('selects a buttonAction correctly for layout', () => {
    const attribute = buildAttribute('flowgraph', {});
    runSelectorTest(attribute);
  });

  it('selects a buttonAction correctly for table', () => {
    const attribute = buildAttribute('table', {});
    runSelectorTest(attribute);
  });

  it('selects a textInput correctly', () => {
    const attribute = buildAttribute('textinput', {});
    runSelectorTest(attribute);
  });

  it('renders empty on no widget tag', () => {
    const attribute = buildAttribute(null, {});
    runSelectorTest(attribute);
  });

  it('dispatches change and pending on click correctly for checkbox', () => {
    const testStore = mockStore(buildState(buildAttribute('checkbox', true)));
    const wrapper = mount(
      <AttributeSelector
        blockName="PANDA1"
        attributeName="attribute1"
        store={testStore}
      />
    );
    wrapper.find('input').simulate('change');
    const pendingAction = {
      payload: {
        path: ['test1', 'attr'],
        flagType: 'pending',
        flagState: true,
      },
      type: 'malcolm:attributeflag',
    };
    const putAction = {
      payload: {
        path: ['test1', 'attr'],
        typeid: 'malcolm:core/Put:1.0',
        value: true,
      },
      type: 'malcolm:send',
    };
    expect(testStore.getActions()[0]).toEqual(pendingAction);
    expect(testStore.getActions()[1]).toEqual(putAction);
  });

  it('dispatches change and pending on click correctly for combobox', () => {
    const testStore = mockStore(
      buildState(buildAttribute('combo', '2', ['1', '2', '3']))
    );
    const wrapper = mount(
      <AttributeSelector
        blockName="PANDA1"
        attributeName="attribute1"
        store={testStore}
        forceOpen
      />
    );
    wrapper
      .find('Typography')
      .last()
      .simulate('click');
    const pendingAction = {
      payload: {
        path: ['test1', 'attr'],
        flagType: 'pending',
        flagState: true,
      },
      type: 'malcolm:attributeflag',
    };
    const putAction = {
      payload: {
        path: ['test1', 'attr'],
        typeid: 'malcolm:core/Put:1.0',
        value: '3',
      },
      type: 'malcolm:send',
    };
    expect(testStore.getActions()[0]).toEqual(pendingAction);
    expect(testStore.getActions()[1]).toEqual(putAction);
  });

  const runButtonActionTest = attributeType => {
    const testStore = mockStore(buildState(buildAttribute(attributeType)));
    const wrapper = mount(
      <AttributeSelector
        blockName="PANDA1"
        attributeName="attribute1"
        store={testStore}
      />
    );
    wrapper
      .find('button')
      .first()
      .simulate('click');

    const actions = testStore.getActions();
    expect(actions[0].type).toEqual('TEST');
    expect(actions[0].blockName).toEqual('test1');
    expect(actions[0].attribute).toEqual('attr');
  };

  it('dispatches path change on table button click', () => {
    runButtonActionTest('table');
  });

  it('dispatches path change on flowgraph button click', () => {
    runButtonActionTest('flowgraph');
  });

  it('dispatches path change and transition actions on button click if is in child pane', () => {
    const testStore = mockStore(buildState(buildAttribute('table'), true));
    const wrapper = mount(
      <AttributeSelector
        blockName="PANDA1"
        attributeName="attribute1"
        store={testStore}
      />
    );
    wrapper
      .find('button')
      .first()
      .simulate('click');

    jest.runAllTimers();

    const actions = testStore.getActions();
    expect(actions.length).toEqual(3);
    expect(actions[0]).toEqual(parentPanelTransition(true));
    expect(actions[1].type).toEqual('TEST');
    expect(actions[1].blockName).toEqual('test1');
    expect(actions[1].attribute).toEqual('attr');
    expect(actions[2]).toEqual(parentPanelTransition(false));
  });

  it('dispatches dirty on focus for textipnut', () => {
    const testStore = mockStore(buildState(buildAttribute('textinput', {})));
    const wrapper = mount(
      <AttributeSelector
        blockName="PANDA1"
        attributeName="attribute1"
        store={testStore}
      />
    );
    wrapper.find('input').simulate('focus');
    const dirtyAction = {
      payload: {
        path: ['test1', 'attr'],
        flagType: 'dirty',
        flagState: true,
      },
      type: 'malcolm:attributeflag',
    };
    expect(testStore.getActions()[0]).toEqual(dirtyAction);
  });

  it('selector Function errors on no widget tag', () => {
    expect(() => selectorFunction('notAWidget')).toThrow(
      Error('no widget tag supplied!')
    );
  });

  it('selector function returns info:button and renders correctly', () => {
    const component = selectorFunction(
      Widget.i_BUTTON,
      [''],
      'testButton',
      () => {},
      { isDisabled: true },
      () => {},
      '#fff',
      {},
      false,
      false,
      () => {}
    );
    const wrapper = shallow(component);
    expect(wrapper).toMatchSnapshot();
  });

  it('selector function returns info:multiline and renders correctly', () => {
    const component = selectorFunction(
      Widget.i_MULTILINE,
      [''],
      'test value',
      () => {},
      {},
      () => {},
      '#fff',
      {},
      false,
      false,
      () => {}
    );
    const wrapper = shallow(component);
    expect(wrapper).toMatchSnapshot();
  });

  it('info:button hooks up click handler correctly', () => {
    const clickHandler = jest.fn();
    const component = selectorFunction(
      Widget.i_BUTTON,
      [''],
      'testButton',
      () => {},
      { isDisabled: false },
      () => {},
      '#fff',
      {},
      false,
      false,
      clickHandler
    );
    const wrapper = mount(component);
    wrapper
      .find('button')
      .first()
      .simulate('click');
    expect(clickHandler).toHaveBeenCalledTimes(1);
  });

  it('getDefaultFromType returns correctly', () => {
    expect(
      getDefaultFromType({ typeid: 'malcolm:core/BooleanMeta:1.0' })
    ).toEqual(false);
    expect(
      getDefaultFromType({ typeid: 'malcolm:core/StringMeta:1.0' })
    ).toEqual('');
    expect(
      getDefaultFromType({ typeid: 'malcolm:core/NumberMeta:1.0' })
    ).toEqual(0);
    expect(
      getDefaultFromType({ typeid: 'malcolm:core/BooleanArrayMeta:1.0' })
    ).toEqual(false);
    expect(
      getDefaultFromType({ typeid: 'malcolm:core/StringArrayMeta:1.0' })
    ).toEqual('');
    expect(
      getDefaultFromType({ typeid: 'malcolm:core/NumberArrayMeta:1.0' })
    ).toEqual(0);
  });
});
