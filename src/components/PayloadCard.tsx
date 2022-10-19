import React from 'react';

interface Payload {
  id: string; payload_mass_kg: (number | null); nationality: string
}

interface PayloadArray extends Array<(Payload | null)>{}

interface Mission {
  id: string, name: string, payloads: PayloadArray, payload_total?: number
}

interface MissionArray extends Array<Mission>{}

export interface PayloadCardProps {
  data: {missions: MissionArray}
}

let truncate = (s: string) => s.length < 12 ? s : s.substring(0,12)+"...";

interface PayloadTableProps {
  missions: MissionArray
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

  missionRow = (mission: Mission) => (
    <tr key={mission.id+"_row"}>
      <td key={mission.id+"_name"}>{truncate(mission.name)}</td>
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
    // TODO use real icons
    if (columnName !== this.state.sortBy) return;
    switch(this.state.sortDir) {
      case "asc":
        return (<>V</>);
      case "des":
        return (<>^</>);
      default:
        return;
    }
  }

  render() {
    console.log(this.state)
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
        {missions.map((mission) => this.missionRow(mission))}
      </tbody>
    </table>);
  };
};

const PayloadCard: React.FC<PayloadCardProps> = (props: PayloadCardProps) => {
  let getPayloadTotal = (mission: Mission): number => {
    return mission.payloads.reduce((total, payload) => {
      // TODO Create a set of unique nationality values for filtering
      if (payload == null) return total;
      return total + (payload.payload_mass_kg == null ? 0 : payload.payload_mass_kg);
    }, 0);
  };
  let { missions }  = props.data;
  missions.forEach((mission) => {mission.payload_total = getPayloadTotal(mission)});
  // TODO create separate components for donutchart, table, filter, and put them all together here
  return (<><PayloadTable missions={missions}/></>);
};

export default PayloadCard;
