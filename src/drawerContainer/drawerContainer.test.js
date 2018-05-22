import React from 'react';
import { createShallow } from 'material-ui/test-utils';
import configureStore from 'redux-mock-store';
import DrawerContainer from './drawerContainer.component';

const mockStore = configureStore();
const dispatch = jest.fn();

describe('DrawerContainer', () => {
  let shallow;

  beforeEach(() => {
    shallow = createShallow({ dive: true });
  });

  it('renders correctly', () => {
    const state = {
      viewState: {
        openParentPanel: true,
        openChildPanel: true,
      },
    };

    const wrapper = shallow(
      <DrawerContainer
        store={mockStore(state)}
        dispatch={dispatch}
        parentTitle="Parent"
        childTitle="Child"
      >
        <div>Left</div>
        <div>Middle</div>
        <div>Right</div>
      </DrawerContainer>
    );
    expect(wrapper.dive()).toMatchSnapshot();
  });
});
