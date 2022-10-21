import React from 'react';
import PayloadTable from "./PayloadTable";
import DonutChart, {getDonutChartData} from "./DonutChart";

interface Payload {
  id: string; payload_mass_kg: (number | null); nationality: string
}

interface PayloadArray extends Array<(Payload | null)>{}

export interface Mission {
  id: string, name: string, payloads: PayloadArray, payload_total?: number, nationalities?: Set<string>, color?:string
}

export interface MissionArray extends Array<Mission>{}

export interface PayloadCardProps {
  data: {missions: MissionArray}
}

interface PayloadCardState {
  filterBy: {key: string, value: string}
  all_nationalities: Set<string>
}

class PayloadCard extends React.Component<PayloadCardProps> {
  state: PayloadCardState = {
    filterBy: {key: "nationality", value: "All Nations"},
    all_nationalities: new Set(["All Nations"])
  };

  getPayloadData = (mission: Mission): {payload_total: number, mission_nationalities: Set<string>} => {
    const mission_nationalities = new Set<string>();
    const payload_total = mission.payloads.reduce((total, payload) => {
      if (payload == null) return total;
      mission_nationalities.add(payload.nationality);
      this.state.all_nationalities.add(payload.nationality);
      return total + (payload.payload_mass_kg == null ? 0 : payload.payload_mass_kg);
    }, 0);
    return {payload_total, mission_nationalities};
  };

  filterMissions = (missions: MissionArray) => {
    if (this.state.filterBy.key === "nationality" && this.state.filterBy.value !== "All Nations") {
     return missions.filter((mission) => mission.nationalities?.has(this.state.filterBy.value))
    }
    return missions;
  }

  changeFilterBy(filterByKey: string, event: React.ChangeEvent<HTMLSelectElement>) {
    this.setState(Object.assign({...this.state}, {filterBy: {key: filterByKey, value: event.target.value}}));
  }

  render() {
    const colors = ['#f44336', '#e91e63', '#9c27b0', '#673ab7', '#3f51b5', '#2196f3', '#03a9f4', '#00bcd4', '#009688', '#4caf50', '#8bc34a', '#cddc39', '#ffeb3b', '#ffc107', '#ff9800', '#ff5722', '#795548', '#607d8b' ];
    let { missions }  = this.props.data
    if(this.state.filterBy) {missions = this.filterMissions(missions)}
    let all_missions_total_payload_kg = 0;
    missions.forEach((mission, i) => {
      let {payload_total, mission_nationalities} = this.getPayloadData(mission);
      all_missions_total_payload_kg = all_missions_total_payload_kg + payload_total;
      mission.payload_total = payload_total;
      mission.nationalities = mission_nationalities;
      mission.color = colors[i];
    });
    let donutChartData = getDonutChartData(missions, all_missions_total_payload_kg);
  return (
      <div className="w-4/5">
        <div className="w-full p-2 inline-flex justify-between border-2 rounded-md drop-shadow-sm">
          <h2 className="p-3 text-xl font-bold">Total Payload Per Mission</h2>
          <select className="p-3 rounded-md text-blue-400 drop-shadow-sm" onChange={(e) => this.changeFilterBy("nationality", e)}>
            {Array.from(this.state.all_nationalities).map((v) => 
              <option value={v} key={v}>{v}</option>
            )}
          </select>
        </div>
        <div className="w-full p-5 flex flex-wrap justify-around border-2 rounded-md drop-shadow-sm">
          <DonutChart data={donutChartData}/>
          <PayloadTable missions={missions}/>
        </div>
      </div>
    )
  }
};

export default PayloadCard;
