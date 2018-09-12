var run_reorder = require('./../reorders/run_reorder');

module.exports = function build_control_panel(regl, cgm){


  console.log('building control panel')

// Add control panel to the top
  ///////////////////////////////////////

  var control_container = d3.select(cgm.params.container).select('#control-container')[0][0];
  var inst_height = 150;
  var inst_width = 1000;

  var control_svg = d3.select(control_container)
    .style('height',inst_height + 'px')
    .style('width',inst_width+'px')
    .append('svg')
    .style('height',inst_height + 'px')
    .style('width',inst_width+'px');

  control_svg
    .append('rect')
    .style('height',inst_height + 'px')
    .style('width',inst_width+'px')
    .style('position', 'absolute')
    .style('fill', '  #778899')
    .style('opacity', 0.5)
    .attr('id', 'control-panel-background');

  var button_dim = {};
  button_dim.height = 30;
  button_dim.width = 100;

  var button_offset

  var button_group = control_svg
    .selectAll('g')
    .data(['Clust', 'Sum'])
    .enter( )
    .append('g')
    .attr('transform', function(d, i){
      var x_offset = 115 * i + 25;
      return 'translate('+ x_offset  +', '+ 25 +')';
    })
    .on('click', function(){
      run_reorder(regl, cgm);
    })

  button_group
    .append('rect')
    .style('height', button_dim.height)
    .style('width', button_dim.width)
    .style('fill', '  #778899')
    .style('rx', 10)
    .style('ry', 10);

  button_group
    .append('text')
    .classed('cat_graph_title', true)
    .text(function(d){
      return d;
    })
    .style('font-family', '"Helvetica Neue", Helvetica, Arial, sans-serif')
    // .style('font-weight',  500)
    .style('font-size', 15)
    .style('text-anchor', 'middle')
    .style('alignment-baseline', 'middle')
    .style('cursor', 'default')
    .attr('transform', 'translate('+ button_dim.width/2 +', '+ button_dim.height/2 +')');

      // <rect x="20" y="20" width="50" height="50" rx="5" ry="5" stroke='red' stroke-width="2" fill="white"/>


};