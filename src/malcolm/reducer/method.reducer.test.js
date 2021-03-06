import MethodReducer from './method.reducer';
import blockUtils from '../blockUtils';
import {
  MalcolmUpdateMethodInputType,
  MalcolmReturn,
  MalcolmMethodReturn,
  MalcolmArchiveMethodRun,
  MalcolmFlagMethodInputType,
} from '../malcolm.types';
import MockCircularBuffer from './attribute.reducer.mocks';
import { malcolmTypes } from '../../malcolmWidgets/attributeDetails/attributeSelector/attributeSelector.component';

describe('method reducer', () => {
  const testMessage = {
    id: 2,
    typeid: 'malcolm:core/Post:1.0',
    path: ['block1', 'attr1'],
    senderLookupID: 0,
  };
  let state;

  beforeEach(() => {
    state = {
      blocks: {
        block1: {
          attributes: [
            {
              calculated: {
                name: 'attr1',
                inputs: { input1: { value: 'test', flags: { test: true } } },
              },
              raw: {
                meta: {
                  takes: {
                    elements: {
                      input1: {
                        typeid: malcolmTypes.string,
                      },
                      input2: {
                        typeid: malcolmTypes.stringArray,
                      },
                    },
                  },
                  returns: {
                    elements: {},
                  },
                },
              },
            },
          ],
        },
      },
      blockArchive: {
        block1: {
          attributes: [
            {
              name: 'attr1',
              timeStamp: new MockCircularBuffer(5),
              value: new MockCircularBuffer(5),
              alarmState: new MockCircularBuffer(5),
            },
          ],
        },
      },
      messagesInFlight: {
        2: testMessage,
      },
    };
  });

  const runReducer = (actionType, payload, returnElement = 'attribute') => {
    const action = {
      type: actionType,
      payload,
    };

    const updatedState = MethodReducer(state, action);
    const attribute = blockUtils.findAttributeIndex(
      updatedState.blocks,
      'block1',
      'attr1'
    );
    if (returnElement === 'state') {
      return { updatedState, attribute };
    } else if (returnElement === 'archive') {
      return updatedState.blockArchive.block1.attributes[attribute];
    }
    return updatedState.blocks.block1.attributes[attribute];
  };

  it('updateMethodInput should update the input on a method', () => {
    const payload = {
      path: ['block1', 'attr1'],
      name: 'input1',
      value: 123,
    };

    const attribute = runReducer(MalcolmUpdateMethodInputType, payload);
    expect(attribute.calculated.inputs.input1).toEqual({
      flags: { test: true },
      value: 123,
    });
  });

  it('updateMethodInput should initialise the input on a method if not already done', () => {
    const payload = {
      path: ['block1', 'attr1'],
      name: 'input2',
      value: '456',
    };

    const attribute = runReducer(MalcolmUpdateMethodInputType, payload);
    expect(attribute.calculated.inputs.input2).toEqual({
      flags: {},
      value: '456',
    });
  });

  it('updateMethodInput should delete the input on a method', () => {
    const payload = {
      path: ['block1', 'attr1'],
      name: 'input1',
      delete: true,
    };

    const attribute = runReducer(MalcolmUpdateMethodInputType, payload);
    expect(attribute.calculated.inputs.input1).not.toBeDefined();
  });

  it('setFlag should flag an input on a method correctly', () => {
    const payload = {
      path: ['block1', 'attr1'],
      name: 'input1',
      flagType: 'testFlag',
      flagState: true,
    };

    const attribute = runReducer(MalcolmFlagMethodInputType, payload);
    expect(attribute.calculated.inputs.input1.flags.testFlag).toBeTruthy();
    expect(attribute.calculated.inputs.input1.value).toEqual('test');
  });

  it('updateMethodInput should update dirty state of an input on a method', () => {
    state.blocks.block1.attributes[0].calculated.dirtyInputs = {
      input1: false,
    };

    const payload = {
      path: ['block1', 'attr1'],
      name: 'input1',
      flagType: 'dirty',
      flagState: true,
    };

    const attribute = runReducer(MalcolmFlagMethodInputType, payload);
    expect(attribute.calculated.dirtyInputs.input1).toBeTruthy();
    expect(attribute.calculated.inputs.input1.flags).toBeTruthy();
  });

  it('updateMethodInput should initialise an array input', () => {
    const payload = {
      path: ['block1', 'attr1'],
      name: 'input2',
      doInitialise: true,
    };

    const attribute = runReducer(MalcolmUpdateMethodInputType, payload);
    expect(attribute.calculated.inputs.input2).toEqual({
      flags: { rows: [] },
      meta: { typeid: malcolmTypes.stringArray },
      value: [],
    });
  });

  it('updateMethodInput should overewrite value only on updating an array input', () => {
    const payload = {
      path: ['block1', 'attr1'],
      name: 'input2',
      value: [123],
    };

    state.blocks.block1.attributes[0].calculated.inputs.input2 = {
      flags: { rows: [] },
      meta: { typeid: 'malcolm:core/StringArrayMeta:1.0' },
    };
    const attribute = runReducer(MalcolmUpdateMethodInputType, payload);
    expect(attribute.calculated.inputs.input2).toEqual({
      flags: { rows: [] },
      meta: { typeid: malcolmTypes.stringArray },
      value: [123],
    });
  });

  it('archiveMethodRun stores input parameters on post', () => {
    const payload = {
      path: ['block1', 'attr1'],
      parameters: { a: { value: 2 }, c: { value: 'd' } },
    };
    const attribute = runReducer(MalcolmArchiveMethodRun, payload, 'archive');
    expect(attribute.timeStamp.toarray().length).toEqual(1);
    expect(
      attribute.timeStamp.toarray()[0].runTime instanceof Date
    ).toBeTruthy();
    expect(attribute.value.toarray().length).toEqual(1);
    expect(attribute.value.toarray()[0].took).toEqual({
      a: 2,
      c: 'd',
    });
  });

  it('handleMethodReturn should update the output on a method and push to the archive with return map', () => {
    state.blocks.block1.attributes[0].raw.meta.returns = {
      elements: { output1: {} },
    };
    state.blockArchive.block1.attributes[0].timeStamp.push({
      runTime: new Date(0),
    });
    state.blockArchive.block1.attributes[0].value.push({ took: {} });
    state.blockArchive.block1.attributes[0].alarmState.push({});

    const payload = {
      typeid: 'malcolm:core/Return:1.0',
      id: 2,
      value: { output1: 456 },
    };

    const test = runReducer(MalcolmMethodReturn, payload, 'state');
    const attribute =
      test.updatedState.blocks.block1.attributes[test.attribute];
    const archive =
      test.updatedState.blockArchive.block1.attributes[test.attribute];
    expect(attribute.calculated.outputs.output1).toEqual({ value: 456 });
    expect(archive.timeStamp.toarray().length).toEqual(1);
    expect(archive.timeStamp.toarray()[0].runTime instanceof Date).toBeTruthy();
    expect(
      archive.timeStamp.toarray()[0].returnTime instanceof Date
    ).toBeTruthy();
    expect(
      archive.timeStamp.toarray()[0].returnTime -
        archive.timeStamp.toarray()[0].runTime
    ).not.toEqual(0);
    expect(archive.value.toarray().length).toEqual(1);
    expect(archive.value.toarray()[0].returned).toEqual({
      output1: 456,
    });
    expect(archive.value.toarray()[0].returnStatus).toEqual('Run success');
    expect(archive.alarmState.toarray().length).toEqual(1);
  });

  it('handleMethodReturn should update the output on a method with return unpacked', () => {
    state.blocks.block1.attributes[0].raw.meta.returns = {
      elements: { output1: {} },
    };
    state.blocks.block1.attributes[0].raw.meta.tags = [
      'method:return:unpacked',
    ];

    state.blockArchive.block1.attributes[0].timeStamp.push({
      runTime: new Date(0),
    });
    state.blockArchive.block1.attributes[0].value.push({ took: {} });
    state.blockArchive.block1.attributes[0].alarmState.push({});

    const payload = {
      typeid: 'malcolm:core/Return:1.0',
      id: 2,
      value: 456,
    };

    const test = runReducer(MalcolmMethodReturn, payload, 'state');
    expect(
      test.updatedState.blocks.block1.attributes[test.attribute].calculated
        .outputs.output1
    ).toEqual({ value: 456 });
  });

  it('handleMethodReturn should do nothing if original request wasnt a post', () => {
    state.blocks.block1.attributes[0].raw.meta.returns = {
      elements: { output1: {} },
    };
    state.blocks.block1.attributes[0].raw.meta.tags = [
      'method:return:unpacked',
    ];

    state.messagesInFlight = {
      2: {
        id: 2,
        typeid: 'malcolm:core/Put:1.0',
        path: ['block1', 'attr1'],
      },
    };

    const payload = {
      typeid: 'malcolm:core/Return:1.0',
      id: 2,
      value: 456,
    };

    const action = {
      type: MalcolmReturn,
      payload,
    };

    const updatedState = MethodReducer(state, action);
    expect(updatedState).toEqual(state);
  });

  it('handleMethodReturn should set errorState if return map is missing an output', () => {
    state.blocks.block1.attributes[0].raw.meta.returns = {
      elements: { output1: {}, output2: {} },
    };

    state.blockArchive.block1.attributes[0].timeStamp.push({
      runTime: new Date(0),
    });
    state.blockArchive.block1.attributes[0].value.push({ took: {} });
    state.blockArchive.block1.attributes[0].alarmState.push({});
    const payload = {
      typeid: 'malcolm:core/Return:1.0',
      id: 2,
      value: { output1: 456 },
    };

    const attribute = runReducer(MalcolmMethodReturn, payload);
    expect(attribute.calculated.errorState).toBeTruthy();
  });
});
