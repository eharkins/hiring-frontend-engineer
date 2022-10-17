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
const PayloadCard: React.FC<PayloadCardProps> = (props: PayloadCardProps) => {

  function getPayloadTotal (mission: Mission): number {
    return mission.payloads.reduce((acc, payload) => {
      // TODO Create a set of unique nationality values for filtering
      if (payload == null) return acc;
      return acc + (payload.payload_mass_kg == null ? 0 : payload.payload_mass_kg);
    }, 0);
  }
  
  let { missions }  = props.data;
  for (let i = 0; i < missions.length; i++) {
    missions[i].payload_total = getPayloadTotal(missions[i]);
  }
  // TODO create separate components for donutchart, table, filter, and put them all together here
  let card = <ul>{missions.map((mission) => (<li key={mission.id}>{mission.name}: {mission.payload_total}</li>)) }</ul>;

  return card;
};

export default PayloadCard;
