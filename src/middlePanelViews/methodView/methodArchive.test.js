import React from 'react';
import { createShallow } from '@material-ui/core/test-utils';
import MockCircularBuffer from '../../malcolm/reducer/attribute.reducer.mocks';
import MethodArchive from './methodArchive.container';

describe('MethodArchive', () => {
  let shallow;
  let testArchive;

  beforeEach(() => {
    shallow = createShallow();
    testArchive = {
      value: new MockCircularBuffer(5),
      timeStamp: new MockCircularBuffer(5),
      alarmState: new MockCircularBuffer(5),
    };
    testArchive.value.push({
      took: { test1: 0 },
      returned: { test2: 1 },
    });
    testArchive.timeStamp.push({
      runTime: new Date(0),
      returnTime: new Date(1000),
    });
    testArchive.alarmState.push({ alarm: 0 });
  });

  it('renders table correctly for input param', () => {
    const wrapper = shallow(
      <MethodArchive
        methodArchive={testArchive}
        openPanels={{}}
        selectedParam={['takes', 'test1']}
      />
    );
    expect(wrapper).toMatchSnapshot();
  });

  it('renders table correctly for return param', () => {
    const wrapper = shallow(
      <MethodArchive
        methodArchive={testArchive}
        openPanels={{}}
        selectedParam={['returns', 'test2']}
      />
    );
    expect(wrapper).toMatchSnapshot();
  });

  it('renders 2nd tab correctly', () => {
    const wrapper = shallow(
      <MethodArchive
        methodArchive={testArchive}
        openPanels={{}}
        defaultTab={1}
        selectedParam={['takes', 'test1']}
      />
    );
    expect(wrapper).toMatchSnapshot();
  });
});
