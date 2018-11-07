var make_dendro_tooltip = require('./make_dendro_tooltip');

module.exports = function show_d3_tip(params){

  var cat_breakdown;
  var mouseover = params.interact.mouseover;

  console.log(params.tooltip.tooltip_type)
  console.log(mouseover)

  if (params.tooltip.tooltip_type === 'matrix-cell'){

    var full_string = mouseover.row.name + ' and ' +
                      mouseover.col.name + ' <br> ' +
                      'value: ' + mouseover.value.toFixed(3);

    params.tooltip_fun.show('tooltip');
    d3.select(params.tooltip_id)
      .html(full_string);

  } else if (params.tooltip.tooltip_type === 'row-label'){

    params.tooltip_fun.show('tooltip');
    d3.select(params.tooltip_id)
      .html(mouseover.row.name);

  } else if (params.tooltip.tooltip_type === 'col-label'){

    params.tooltip_fun.show('tooltip');
    d3.select(params.tooltip_id)
      .html(mouseover.col.name);

  } else if (params.tooltip.tooltip_type === 'col-dendro'){

    make_dendro_tooltip(params, 'col');

  } else if (params.tooltip.tooltip_type === 'row-dendro') {

    make_dendro_tooltip(params, 'row');

  } else if (params.tooltip.tooltip_type.indexOf('-cat-') > 0){

    var inst_axis = params.tooltip.tooltip_type.split('-')[0];
    var inst_index = params.tooltip.tooltip_type.split('-')[2];

    console.log('\n**************************')
    console.log('CATEGORY', inst_axis, inst_index)

    var full_string = mouseover[inst_axis].cats[inst_index]

    params.tooltip_fun.show('tooltip');
    d3.select(params.tooltip_id)
      .html(full_string);
  }


  // position tooltip
  var d3_tip_width = parseFloat(d3.select(params.tooltip_id)
                               .style('width')
                               .replace('px',''));

  var d3_tip_height = parseFloat(d3.select(params.tooltip_id)
                               .style('height')
                               .replace('px',''));

  // this is necessary to offset hte tooltip correctly, probably due to the
  // padding in the tooltip or some related paramters
  var magic_x_offset = 22;

  params.d3_tip_width = d3_tip_width

  d3.select(params.tooltip_id)
    .style('margin-left', function(){
      var total_x_offset = params.zoom_data.x.cursor_position - d3_tip_width + 22;
      return total_x_offset + 'px'
    })
    .style('margin-top', function(){
      var total_y_offset = params.zoom_data.y.cursor_position - d3_tip_height;
      return total_y_offset + 'px'
    });

}