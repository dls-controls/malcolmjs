/* eslint no-console: ["error", { allow: ["info", "error"] }] */
import { malcolmPutAction, malcolmSetFlag } from '../malcolmActionCreators';
import layoutActions from './layout.action';
import { idSeparator } from '../../layout/layout.component';
import { hiddenLinkIdSeparator } from '../reducer/layout/layout.reducer';

const calculateHeight = (layoutEngine, mri) => {
  const zoomFactor = layoutEngine.diagramModel.zoom / 100;
  return (
    layoutEngine.getNodeDimensions(layoutEngine.diagramModel.nodes[mri])
      .height / zoomFactor
  );
};

const getNodePadding = (block, port) => {
  if (block.hasHiddenLink && port.input) {
    return port.value.split(hiddenLinkIdSeparator)[0].length * 10;
  }
  return 12;
};

const runAutoLayout = localOnly => (dispatch, getState) => {
  const state = getState();
  const blocks = state.malcolm.layout.blocks.filter(b => !b.isHiddenLink);
  const { parentBlock, mainAttribute } = state.malcolm;
  const { links } = state.malcolm.layoutEngine.diagramModel;
  const center = state.malcolm.layoutState.layoutCenter;
  const graph = {
    id: 'root',
    layoutOptions: {
      'elk.algorithm': 'layered',
      separateConnectedComponents: true,
      'spacing.componentComponent': 70,
      spacing: 100,
      'spacing.nodeNodeBetweenLayers': 70,
      'elk.edgeRouting': 'SPLINES',
    },
    children: blocks.map(b => ({
      id: b.mri,
      width: 120,
      height: calculateHeight(state.malcolm.layoutEngine, b.mri),
      x: b.position.x,
      y: b.position.y,
      properties: {
        portConstraints: 'FIXED_ORDER',
      },
      ports: b.ports.map((p, i) => ({
        id: `${b.mri}${idSeparator}${p.label}`,
        properties: {
          side: p.input ? 'WEST' : 'EAST',
          index: p.input ? b.ports.length - i : i,
        },
        width: getNodePadding(b, p),
        height: 12,
      })),
    })),
    edges: Object.values(links)
      .filter(link => link.id.split(hiddenLinkIdSeparator)[0] !== 'HIDDEN-LINK')
      .map((link, i) => ({
        id: `e${i}`,
        sources: [link.sourcePort.id],
        targets: [link.targetPort.id],
      })),
  };

  // The JSON graph can be visualised here https://rtsys.informatik.uni-kiel.de/elklive/json.html
  console.info(JSON.stringify(graph));
  console.info(
    `Graph can be visualised at https://rtsys.informatik.uni-kiel.de/elklive/json.html`
  );

  const dispatchAction = localOnly
    ? updatedLayout => {
        dispatch(malcolmSetFlag([parentBlock, mainAttribute], 'dirty', true));
        const newLayout = {
          ...state.malcolm.layout,
          blocks: updatedLayout.mri.map((mri, i) => ({
            ...state.malcolm.layout.blocks[i],
            position: {
              x: updatedLayout.x[i] + center.x,
              y: updatedLayout.y[i] + center.y,
            },
          })),
          custom: true,
        };
        dispatch(layoutActions.localUpdateAction(newLayout));
      }
    : updatedLayout => {
        dispatch(malcolmSetFlag([parentBlock, mainAttribute], 'pending', true));
        dispatch(
          malcolmPutAction([parentBlock, mainAttribute, 'value'], updatedLayout)
        );
      };

  return (
    import('elkjs/lib/elk.bundled')
      .then(ELK => new ELK().layout(graph))
      // return elk
      //  .layout(graph)
      .then(graphLayout => {
        const centerX =
          graphLayout.children.reduce((prev, next) => prev + next.x, 0) /
          graphLayout.children.length;
        const centerY =
          graphLayout.children.reduce((prev, next) => prev + next.y, 0) /
          graphLayout.children.length;

        // we only need to send an update for the visible blocks
        const updatedLayout = {
          name: blocks.map(b => b.name),
          visible: blocks.map(b => b.visible),
          mri: blocks.map(b => b.mri),
          x: blocks
            .map(b => b.mri)
            .map(
              mri => graphLayout.children.find(c => c.id === mri).x - centerX
            ),
          y: blocks
            .map(b => b.mri)
            .map(
              mri => graphLayout.children.find(c => c.id === mri).y - centerY
            ),
        };
        dispatchAction(updatedLayout);
      })
      .catch(err => {
        console.error('error creating auto layout');
        console.error(err);
      })
  );
};

export default {
  runAutoLayout,
};
