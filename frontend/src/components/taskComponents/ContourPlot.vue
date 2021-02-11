<template>
  <div class="contourPlot"></div>
</template>

<script>
import { onMounted, computed } from "vue";
import * as contour from "d3-contour";
import * as d3 from "d3";
import * as hsv from "d3-hsv";

export default {
  props: {
    componentID: Number,
    storeObject: Object,
  },
  setup(props) {
    const { getProperty } = props.storeObject;
    const currentNode = computed(() => getProperty("currentNode"));

    const dependencyPath = getProperty(`nodes__${currentNode.value}__components__${props.componentID}__dependency`);
    const dependency = computed(() => {
      const dependency = getProperty(`${dependencyPath.ContourPlot}`);
      return dependency;
    });

    onMounted(() => {
      const contours = d3.contours().size([dependency.value.length, dependency.value.length]);
      const path = d3.geoPath();

      const interpolateTerrain = () => {
        const i0 = hsv.interpolateHsvLong(hsv.hsv(120, 1, 0.65), hsv.hsv(60, 1, 0.9));
        const i1 = hsv.interpolateHsvLong(hsv.hsv(60, 1, 0.9), hsv.hsv(0, 0, 0.95));
        return (t) => (t < 0.5 ? i0(t * 2) : i1((t - 0.5) * 2));
      };

      const color = d3.scaleSequential(interpolateTerrain).domain(d3.extent(dependency.value)).nice();

      const thresholds = [90, 95, 100, 105, 110, 115, 120, 125, 130, 135, 140, 145, 150, 155, 160, 165];
      const width = 20;
      const height = 20;

      const genSvg = function () {
        const svg = d3
          .select(".contourPlot")
          .append("svg")
          .attr("viewBox", [0, 0, width, height])
          .style("display", "block")
          .style("margin", "0 -14px")
          .style("width", "calc(100% + 28px)")
          .style("height", "auto");

        const g = svg
          .append("g")
          .attr(
            "transform",
            `
            rotate(90 ${width / 2},${height / 2})
            translate(${(width - height) / 2},${(width - height) / 2})
          `
          )
          .attr("stroke", "white")
          .attr("stroke-width", 0.03);

        for (const threshold of thresholds) {
          console.log(contours.contour(dependency.value, threshold));
          console.log(color(threshold));
          g.append("path")
            .attr("d", path(contours.contour(dependency.value, threshold)))
            .attr("fill", color(threshold));
        }
        return svg.node();
      };

      genSvg();
    });

    return {
      matrix: dependency,
    };
  },
};
</script>

<style scoped></style>
