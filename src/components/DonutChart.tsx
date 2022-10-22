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
    return data.map((d, i) => {
      let strokeDasharray = `${d.percentage} ${100-d.percentage}`
      let segment = (
          <circle className="donut-segment" key={d.label}
          data-tip data-for={d.label}          
          cx="35" cy="35" r="15.91549430918954"
          fill="transparent" stroke={d.color} strokeWidth="3"
          strokeDasharray={strokeDasharray} strokeDashoffset={`${100-offset}`}
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

  return <>
    <svg width="35vw" height="100%" viewBox="0 0 85 85" className="donut">
      {segements(props.data)}
    </svg>
    {/* Tooltip for each segment must be mounted outside svg tag */}
    {props.data.map((d) => segmentTooltip(d, d.color))}
  </>;
};

export default DonutChart;