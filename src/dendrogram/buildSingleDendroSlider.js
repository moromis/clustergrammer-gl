// TODO: fix invalid this usage
import * as d3 from "d3";
import custom_round from "../utils/customRound";
import change_groups from "./changeGroups";

export default function build_single_dendro_slider(regl, state, axis) {
  const slider_length = 100;
  const rect_height = slider_length + 20;
  const rect_width = 20;
  const text_color = "#47515b";
  let round_level;
  if (state.dendro.precalc_linkage) {
    round_level = 3;
  } else {
    round_level = -1;
  }
  const drag = d3
    .drag()
    .on("drag", dragging)
    .on("end", function () {
      change_groups(state, axis, state[axis + "_dendro_slider_value"]);
      state.is_slider_drag = false;
    });
  const slider_group = d3
    .select(
      state.visualization.rootElementId + " ." + axis + "_dendro_slider_svg"
    )
    .append("g")
    .classed(axis + "_slider_group", true)
    .attr("transform", function () {
      const inst_translation =
        "translate(" + rect_width / 2 + ", " + rect_height / 10 + ")";
      return inst_translation;
    });
  slider_group
    .append("rect")
    .classed(axis + "_slider_background", true)
    .attr("height", rect_height + "px")
    .attr("width", rect_width + "px")
    .attr("fill", "red")
    .attr("transform", function () {
      const translate_string = "translate(-10, -5)";
      return translate_string;
    })
    .attr("opacity", 0);
  slider_group
    .append("line")
    .attr("stroke-width", slider_length / 7 + "px")
    .attr("stroke", "black")
    .attr("stroke-linecap", "round")
    .attr("opacity", 0.0)
    .attr("y1", 0)
    .attr("y2", function () {
      return slider_length - 2;
    })
    .on("click", click_dendro_slider);
  const offset_triangle = -slider_length / 40;
  slider_group
    .append("path")
    .attr("fill", "black")
    .attr("transform", "translate(" + offset_triangle + ", 0)")
    .attr("d", function () {
      // up triangle
      const start_x = 0;
      const start_y = 0;
      const mid_x = 0;
      const mid_y = slider_length;
      const final_x = slider_length / 10;
      const final_y = 0;
      const output_string =
        "M" +
        start_x +
        "," +
        start_y +
        " L" +
        mid_x +
        ", " +
        mid_y +
        " L" +
        final_x +
        "," +
        final_y +
        " Z";
      return output_string;
    })
    .attr("opacity", 0.35)
    .on("click", click_dendro_slider);
  const default_opacity = 0.35;
  const high_opacity = 0.6;
  slider_group
    .append("circle")
    .classed(axis + "_group_circle", true)
    .attr("r", slider_length * 0.08)
    .attr("transform", function () {
      return "translate(0, " + slider_length / 2 + ")";
    })
    .attr("fill", "blue")
    .attr("opacity", default_opacity)
    .on("mouseover", function () {
      d3.select(this).attr("opacity", high_opacity);
    })
    .on("mouseout", function () {
      d3.select(this).attr("opacity", default_opacity);
    })
    .call(drag);
  // add dendrogram level text
  // /////////////////////////////
  if (state.dendro.precalc_linkage) {
    slider_group
      .append("text")
      .classed("dendro_level_text", true)
      .text(state.dendro.default_link_level)
      .attr("transform", "translate(0, 90) rotate(90)")
      .attr("font-family", '"Helvetica Neue", Helvetica, Arial, sans-serif')
      .attr("font-weight", 400)
      .attr("font-size", 15)
      .attr("text-anchor", "middle")
      .attr("stroke", text_color)
      .attr("alignment-baseline", "middle")
      .attr("letter-spacing", "2px")
      .attr("cursor", "default");
  }
  // Add Increment Buttons
  if (state.dendro.increment_buttons) {
    // increment up button
    slider_group
      .append("path")
      .attr("d", function () {
        // up triangle
        const start_x = 0;
        const start_y = 10;
        const mid_x = 10;
        const mid_y = 0;
        const final_x = 20;
        const final_y = 10;
        const output_string =
          "M" +
          start_x +
          "," +
          start_y +
          " L" +
          mid_x +
          ", " +
          mid_y +
          " L" +
          final_x +
          "," +
          final_y +
          " Z";
        return output_string;
      })
      .attr("transform", function () {
        return "translate(-10, -13)";
      })
      .attr("fill", "blue")
      .attr("opacity", default_opacity)
      .on("mouseover", function () {
        d3.select(this).attr("opacity", high_opacity);
      })
      .on("mouseout", function () {
        d3.select(this).attr("opacity", default_opacity);
      });
    // increment down button
    slider_group
      .append("path")
      .attr("d", function () {
        // up triangle
        const start_x = 0;
        const start_y = 0;
        const mid_x = 10;
        const mid_y = 10;
        const final_x = 20;
        const final_y = 0;
        const output_string =
          "M" +
          start_x +
          "," +
          start_y +
          " L" +
          mid_x +
          ", " +
          mid_y +
          " L" +
          final_x +
          "," +
          final_y +
          " Z";
        return output_string;
      })
      .attr("transform", function () {
        return "translate(-10, " + slider_length + ")";
      })
      .attr("fill", "blue")
      .attr("opacity", default_opacity)
      .on("mouseover", function () {
        d3.select(this).attr("opacity", high_opacity);
      })
      .on("mouseout", function () {
        d3.select(this).attr("opacity", default_opacity);
      });
  }
  function dragging() {
    state.is_slider_drag = true;
    let slider_pos = d3.event.y;
    if (slider_pos < 0) {
      slider_pos = 0;
    }
    if (slider_pos > slider_length) {
      slider_pos = slider_length;
    }
    if (this.nextSibling) {
      this.parentNode.appendChild(this);
    }
    slider_pos = custom_round(slider_pos, round_level);
    // var slider_value = 10 - slider_pos/10;
    const slider_value = get_slider_value(
      slider_pos,
      state.dendro.precalc_linkage
    );
    d3.select(this).attr("transform", "translate(0, " + slider_pos + ")");
    // changing too quickly for large datasets
    // change_groups(cgm, axis, slider_value);
    state[axis + "_dendro_slider_value"] = slider_value;
  }
  function click_dendro_slider() {
    const clicked_line_position = d3.mouse(this);
    const rel_pos = custom_round(clicked_line_position[1], round_level);
    d3.select(
      state.visualization.rootElementId + " ." + axis + "_group_circle"
    ).attr("transform", "translate(0, " + rel_pos + ")");
    const slider_value = get_slider_value(
      rel_pos,
      state.dendro.precalc_linkage
    );
    state[axis + "_dendro_slider_value"] = slider_value;
    change_groups(state, axis, slider_value);
  }
  // convert from position along slider to a value that will be used to set
  // the group level
  function get_slider_value(slider_position, precalc_linkage) {
    let slider_value;
    if (precalc_linkage) {
      slider_value = 1 - slider_position / 100;
    } else {
      slider_value = 10 - slider_position / 10;
    }
    return slider_value;
  }
}
