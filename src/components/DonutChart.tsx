import React from "react";
import ReactTooltip from 'react-tooltip';
import {MissionArray} from "./PayloadCard";
import {legendColorCircle} from "./PayloadTable";

interface DonutChartProps {
  data: {label: string, value: number, percentage: number, color?: string}[]
}

export const getDonutChartData = (missions: MissionArray, all_missions_total_payload_kg: number) => {
  return missions.map((mission) => {
    return {
      label: mission.name,
      value: mission.payload_total || 0,
      percentage: (mission.payload_total || 0)/all_missions_total_payload_kg*100,
      color: mission.color
    }
  });
}

const DonutChart: React.FC<DonutChartProps> = (props: DonutChartProps) => {
  const segements = (data: {label: string, value: number, percentage: number, color?: string}[]) => {
    let offset = 0;
    let roundedLineFactor = data.length > 1 ? 3 : 0
    let circumference = 100+(roundedLineFactor*data.length)
    let r = (circumference)/(2*Math.PI)
    return data.map((d, i) => {
      let strokeDasharray = `${d.percentage} ${circumference-d.percentage}`
      let strokeDashOffset = circumference -offset -roundedLineFactor*i
      let segment = (
          <circle className="donut-segment" key={d.label}
          data-tip data-for={d.label}          
          cx="30" cy="35" r={`${r}`}
          fill="transparent" stroke={d.color} strokeWidth="2"
          strokeLinecap="round"
          strokeDasharray={strokeDasharray} strokeDashoffset={`${strokeDashOffset}`}
          />
      )
      offset = offset + d.percentage
      return segment;
    }
    );
  }

  const segmentTooltip = (d: {label: string, value: number, percentage: number}, color?: string) => {
    return <ReactTooltip id={d.label} key={`${d.label}-segment-tooltip`}>
      <span>
        {legendColorCircle(color || '')}
        {`${d.label} ${d.value} KG`}
      </span>
    </ReactTooltip>
  }

  // I would use a different approach for the donut chart in the future
  // for the following reason: 
  // react-tooltip doesnt play very well with svg donut chart
  // because the box for each segment in the DOM is larger
  // than the segment appears so when you hover outside
  // the segment you still get a tooltip and it also causes
  // overlapping between segment toolitp areas.
  return <>
    <svg width="35vw" height="100%" viewBox="0 0 80 70" className="donut">
      {segements(props.data)}
    </svg>
    {/* Tooltip for each segment must be mounted outside svg tag */}
    {props.data.map((d) => segmentTooltip(d, d.color))}
  </>;
};

export default DonutChart;