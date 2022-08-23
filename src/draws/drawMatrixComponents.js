import interp_fun from "./interpFun";

export default (function draw_matrix_components(
  regl,
  state,
  cameras,
  reglProps
) {
  /* Matrix */
  cameras.mat.draw(() => {
    /*
          Disabling this, prevents the screen from flashing when working with very
          large datasets
        */
    // regl.clear({color: [0, 0, 0, 0]});
    /*
          Filter and regenerate args is slow
        */
    /*
        Reordering Matrix Plan
        ------------------------
        I will only re-calculate the matrix_args once for the final position.
        Since matrix reordering happens to entire rows/cols at once, I will calculate
        an offset to shift rows/columns to transition from the initial to the final
        state, then I will replace the current position array with the final
        position array
        */
    regl(reglProps)({
      interp_prop: interp_fun(state),
      run_animation: state.animation.running,
    });
  });
});
