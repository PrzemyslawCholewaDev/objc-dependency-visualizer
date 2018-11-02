import accessorFn from 'accessor-fn';
import Kapsule from 'kapsule';

export default Kapsule({
  props: {
    strength: { default: 1 },   // accessor: number > 0
    direction: { default: 90 }, // accessor: angle in degrees (0: right, 90: down (svg coords))
    zAngle: { default: 0 }      // accessor: angle with the 2-dimensional xy plane in degrees (positive: close, negative: far (WebGL coords)). Values of -90/90 cancel motion in xy plane. Values above 90 inverse direction.
  },
  methods: {
    initialize(state, nodes, numDimensions = 2) {  // called by engine to pass node objects and numDimensions
      state.nodes = nodes;
      state.nDim = numDimensions;
    }
  },
  init(alpha, state) { // called at each tick

    const strength = accessorFn(state.strength);
    const direction = accessorFn(state.direction);
    const zAngle = accessorFn(state.zAngle);

    state.nodes.forEach(node => {
      const { x: xydv, y: zdv } = polar2Cart(alpha * strength(node), zAngle(node));
      const { x: xdv, y: ydv } = polar2Cart(xydv, direction(node));

      node.vx += xdv;
      if (state.nDim > 1) node.vy += ydv;
      if (state.nDim > 2) node.vz += zdv;
    });

    //

    function polar2Cart(d, a) {
      const rad = deg2rad(a);
      return {
        x: d * Math.cos(rad),
        y: d * Math.sin(rad)
      };

      //

      function deg2rad(deg) {
        return deg * Math.PI / 180;
      }
    }
  }
});