var m3 = require('./../draws/mat3_transform');

module.exports = function make_row_text_args(regl, params, zoom_function){

  // // prevent text from getting too large when zooming
  // params.text_scale.row = d3.scale.linear()
  //     .domain([1, 20])
  //     .range( [1, 20/params.allowable_zoom_factor.row]);


  // smaller scale_text -> larger text
  // var limited_scaling = params.text_scale.row(total_zoom);

  // var scale_text = params.text_zoom.row.scaled_num * params.text_scale.row(params.zoom_data.y.total_zoom);
  // var scale_text = params.text_zoom.row.scaled_num * params.zoom_data.y.total_zoom;

  // // prevent text from getting too large when zooming
  // // 17.5, lowering makes larger text
  // params.text_scale.row = d3.scale.linear()
  //     .domain([1, params.max_zoom])
  //     .range( [1, params.num_row]);
  // var inst_increase_font_size = params.text_scale.row(params.zoom_data.y.total_zoom);


  var scale_text = params.num_row// * params.zoom_data.y.total_zoom ; /// inst_increase_font_size;

  var webgl_fs = (1/params.num_row) * params.zoom_data.y.total_zoom;

  var max_webgl_fs = params.text_zoom.row.max_webgl_fs;

  var scale_down_fs;
  if (webgl_fs > max_webgl_fs){
    scale_down_fs = webgl_fs/max_webgl_fs;
    // console.log('too large webgl text', scale_down_fs)

    scale_text = scale_text * scale_down_fs;
  }

  // if (scale_text < 37){
  //   scale_text = 37;
  // }

  // console.log('scale_text', (1/params.num_row) * params.zoom_data.y.total_zoom )

  var mat_rotate = m3.rotation(Math.PI/2);

  var x_offset = params.mat_size.x + 0.02;

  var vert_arg = `
      precision mediump float;
      attribute vec2 position;
      uniform mat4 zoom;
      uniform vec2 offset;
      uniform float x_offset;
      uniform float scale_text;
      uniform float total_zoom;
      uniform mat3 mat_rotate;
      uniform float heat_size;
      varying float x_position;
      varying float y_position;
      uniform float shift_heat;

      // vec3 tmp = vec3(1,1,1);

      // last value is a sort-of zoom
      void main () {

        // reverse y position to get words to be upright

        // the x position is constant for all row labels
        //------------------------------------------------------
        // total_zoom stretches out row labels horizontally
        // then text is offset to the left side of the heatmap
        //------------------------------------------------------
        x_position = position.x/scale_text * total_zoom - x_offset;

        // the y position varies for all row labels
        //------------------------------------------------------
        // shift by offset and then uniformly shift down by s
        // shift_heat
        //------------------------------------------------------
        y_position = -position.y/scale_text + 2.0 * heat_size * offset[1] - shift_heat ;

        gl_Position = zoom *
                      vec4(x_position,
                           y_position,
                           0.50,
                           1.0);
      }`;

  var frag_arg =  `
      precision mediump float;
      void main () {
        gl_FragColor = vec4(0.2, 0.2, 0.2, 1.0);
      }`;

  var args = {
    vert: vert_arg,
    frag: frag_arg,
    attributes: {
      position: regl.prop('positions')
    },
    elements: regl.prop('cells'),
    uniforms: {
      zoom: zoom_function,
      offset: regl.prop('offset'),
      scale_text: scale_text,
      x_offset: x_offset,
      heat_size: params.heat_size.y,
      shift_heat: params.mat_size.y - params.heat_size.y,
      total_zoom: params.zoom_data.y.total_zoom,
      mat_rotate: mat_rotate
    },
    depth: {
      enable: true,
      mask: true,
      func: 'less',
      // func: 'greater',
      range: [0, 1]
    },
  };

  return args;

};