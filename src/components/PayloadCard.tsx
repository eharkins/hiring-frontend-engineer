import React from 'react';

interface Payload {
  id: string; payload_mass_kg: (number | null); nationality: string
}

interface PayloadArray extends Array<(Payload | null)>{}

interface Mission {
  id: string, name: string, payloads: PayloadArray, payload_total?: number, nationalities?: Set<string>
}

interface MissionArray extends Array<Mission>{}

export interface PayloadCardProps {
  data: {missions: MissionArray}
}

let truncate = (s: string) => s.length < 12 ? s : s.substring(0,10)+" ...";

interface PayloadTableProps {
  missions: MissionArray,
  colorArray: string[]
}

interface PayloadTableState {
  sortBy?: string,
  sortDir?: string
}

// for the purposes of this exercise i implemented the sorting but in production would not re-invent something that is likely well-solved in a react component library
class PayloadTable extends React.Component<PayloadTableProps, PayloadTableState> {
  state: PayloadTableState = {
    sortBy: undefined,
    sortDir: undefined
  };

  updateSort = (sortBy: string) => {
    let newSortDir;
    let changingColumn = sortBy !== this.state.sortBy;
    if (changingColumn) {
      newSortDir = "asc";
    } else {
      if (this.state.sortDir === "asc") newSortDir = "des";
      if (this.state.sortDir === "des") newSortDir = undefined;
      if (this.state.sortDir === undefined) newSortDir = "asc";
    }
    this.setState({
      sortBy,
      sortDir: newSortDir
    })
  };

  missionRow = (mission: Mission, color: string) => (
    <tr key={mission.id+"_row"}>
      <td key={mission.id+"_name"}>
        <svg width="10px" height="10px" viewBox="0 0 10 10">
          <circle className="legendColorCircle"
          cx="5" cy="5" r="1.591549430918954"
          fill={color} stroke={color} strokeWidth="3"/>
        </svg>
        {truncate(mission.name)}</td>
      <td key={mission.id+"_payload"}>{mission.payload_total} KG</td>
    </tr>
  );

  sortCompare = (a: Mission, b: Mission) => {
    // this doesn't scale well to new columns and is redundant but i cant easily figure out how in typescript to index the Mission
    // interface using a variable like sortBy to get the values we are sorting by, hence all these conditionals. :(
    let sortBy = this.state.sortBy;
    if (!a.payload_total || !b.payload_total) return 0;
    if (sortBy === "payload_total") {
      return this.state.sortDir === "asc" ? a.payload_total - b.payload_total : b.payload_total - a.payload_total;
    }
    if (this.state.sortBy === "name") {
      let res = a.name.localeCompare(b.name);
      if (this.state.sortDir === "des") res = -1*res; 
      return res;
    }
    return 0;
  };

  sortIcon = (columnName: string) => {
    if (columnName !== this.state.sortBy) return;
    switch(this.state.sortDir) {
      case "asc":
        return (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                  <path fillRule="evenodd" d="M10 3a.75.75 0 01.75.75v10.638l3.96-4.158a.75.75 0 111.08 1.04l-5.25 5.5a.75.75 0 01-1.08 0l-5.25-5.5a.75.75 0 111.08-1.04l3.96 4.158V3.75A.75.75 0 0110 3z" clipRule="evenodd" />
                </svg>);
      case "des":
        return (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                  <path fillRule="evenodd" d="M10 17a.75.75 0 01-.75-.75V5.612L5.29 9.77a.75.75 0 01-1.08-1.04l5.25-5.5a.75.75 0 011.08 0l5.25 5.5a.75.75 0 11-1.08 1.04l-3.96-4.158V16.25A.75.75 0 0110 17z" clipRule="evenodd" />
                </svg>);
      default:
        return;
    }
  }

  render() {
    let { missions } = this.props;
    // make a copy of the array with spread syntax so it goes back to original order when not sorted
    missions = this.state.sortDir ? [...missions].sort(this.sortCompare): missions;
    return (<table>
      <thead>
        <tr>
          <th onClick={() => this.updateSort("name")}>MISSION {this.sortIcon("name")}</th>
          <th onClick={() => this.updateSort("payload_total")}>TOTAL PAYLOAD MASS {this.sortIcon("payload_total")}</th>
        </tr>
      </thead>
      <tbody>
        {missions.map((mission, i) => this.missionRow(mission, this.props.colorArray[i]))}
      </tbody>
    </table>);
  };
};

interface DonutChartProps {
  data: {label: string, value: number}[]
  colorArray: string[]
}

const DonutChart: React.FC<DonutChartProps> = (props: DonutChartProps) => {
  // TODO Tooltip
  const segements = (data: {label: string, value: number}[]) => {
    let offset = 0;
    return data.map((d, i) => {
      let strokeDasharray = `${d.value} ${100-d.value}`
      let segment = (
        <circle className="donut-segment" key={d.label}
        cx="50" cy="50" r="15.91549430918954"
        fill="transparent" stroke={props.colorArray[i]} strokeWidth="3"
        strokeDasharray={strokeDasharray} strokeDashoffset={`${100-offset}`}/>
      )
      offset = offset + d.value
      return segment;
    }
    );
  }

  return <>
    <svg width="75%" height="75%" viewBox="0 0 100 100" className="donut">
      {segements(props.data)}
    </svg>
  </>;
};

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
  
  donutChartData = (missions: MissionArray, all_missions_total_payload_kg: number) => {
    return missions.map((mission) => {
      return {
        label: mission.name,
        value: (mission.payload_total || 0)/all_missions_total_payload_kg*100
      }
    });
  }

  render() {
    const colors = ['#f44336', '#e91e63', '#9c27b0', '#673ab7', '#3f51b5', '#2196f3', '#03a9f4', '#00bcd4', '#009688', '#4caf50', '#8bc34a', '#cddc39', '#ffeb3b', '#ffc107', '#ff9800', '#ff5722', '#795548', '#607d8b' ];
    let { missions }  = this.props.data
    if(this.state.filterBy) {missions = this.filterMissions(missions)}
    let all_missions_total_payload_kg = 0;
    missions.forEach((mission) => {
      let {payload_total, mission_nationalities} = this.getPayloadData(mission);
      all_missions_total_payload_kg = all_missions_total_payload_kg + payload_total;
      mission.payload_total = payload_total;
      mission.nationalities = mission_nationalities;
    });
    let donutChartData = this.donutChartData(missions, all_missions_total_payload_kg);
  return (
      <div>
      {/* TODO styling */}
      {/* TODO table, select, and chart each get their own files? */}
        <h3>Total Payload Per Mission</h3>
        <select onChange={(e) => this.changeFilterBy("nationality", e)}>
          {Array.from(this.state.all_nationalities).map((v) => 
            <option value={v} key={v}>{v}</option>
          )}
        </select>
        <DonutChart data={donutChartData} colorArray={colors}/>
        <PayloadTable missions={missions} colorArray={colors}/>
      </div>
    )
  }
};

export default PayloadCard;
