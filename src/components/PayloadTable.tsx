import React from 'react';
import {Mission, MissionArray} from './PayloadCard';

let truncate = (s: string) => s.length < 10 ? s : s.substring(0,10)+" ...";

export const legendColorCircle = (color: string) => (
  <svg width="10px" height="10px" viewBox="0 0 10 10" className="m-1">
    <circle className="legendColorCircle"
      cx="5" cy="7" r="1.591549430918954"
      fill={color} stroke={color} strokeWidth="3"/>
  </svg>)

interface PayloadTableProps {
  missions: MissionArray
}

interface PayloadTableState {
  sortBy?: string,
  sortDir?: string
}

// for the purposes of this exercise i implemented the sorting but in production would not re-invent something that is likely well-solved in a react table component library
export default class PayloadTable extends React.Component<PayloadTableProps, PayloadTableState> {
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
    <tr key={mission.id+"_row"} className="border-b-2">
      <td key={mission.id+"_name"} className="p-3">
        <span className='inline-flex'>
        {legendColorCircle(color)}
        {truncate(mission.name)}
        </span>
      </td>
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
        <tr className="text-left">
          <th onClick={() => this.updateSort("name")}>
            <span className="inline-flex">
              <h3>MISSION</h3>{this.sortIcon("name")}
            </span>
          </th>
          <th onClick={() => this.updateSort("payload_total")}>
            <span className="inline-flex">
              <h3>TOTAL PAYLOAD MASS</h3>{this.sortIcon("payload_total")}
            </span>
          </th>
        </tr>
      </thead>
      <tbody>
        {missions.map((mission, i) => this.missionRow(mission, mission.color || ''))}
      </tbody>
    </table>);
  };
};