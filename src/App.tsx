import React from "react";
import PayloadCard from "./components/PayloadCard";

// this doesnt work without a workaround to allow imports from outside src dir
// see link below for potential solution to be implemented later:

// pasting the data in here for now
// import missionsResult from "../dataset/missions.json";

let missionsResult = {
  "data": {
    "missions": [
      {
        "id": "9D1B7E0",
        "name": "Thaicom",
        "payloads": [
          {
            "id": "Thaicom 6",
            "payload_mass_kg": 3325,
            "nationality": "Thailand"
          },
          {
            "id": "Thaicom 8",
            "payload_mass_kg": 3100,
            "nationality": "Thailand"
          }
        ]
      },
      {
        "id": "F4F83DE",
        "name": "Telstar",
        "payloads": [
          {
            "id": "Telstar 19V",
            "payload_mass_kg": 7076,
            "nationality": "Canada"
          },
          {
            "id": "Telstar 18V",
            "payload_mass_kg": 7060,
            "nationality": "Canada"
          }
        ]
      },
      {
        "id": "F3364BF",
        "name": "Iridium NEXT",
        "payloads": [
          {
            "id": "Iridium NEXT 1",
            "payload_mass_kg": 9600,
            "nationality": "United States"
          },
          {
            "id": "Iridium NEXT 2",
            "payload_mass_kg": 9600,
            "nationality": "United States"
          },
          {
            "id": "Iridium NEXT 3",
            "payload_mass_kg": 9600,
            "nationality": "United States"
          },
          {
            "id": "Iridium NEXT 4",
            "payload_mass_kg": 9600,
            "nationality": "United States"
          },
          {
            "id": "Iridium NEXT 5",
            "payload_mass_kg": 9600,
            "nationality": "United States"
          },
          {
            "id": "Iridium NEXT 6",
            "payload_mass_kg": 4300,
            "nationality": "United States"
          },
          {
            "id": "Iridium NEXT 7",
            "payload_mass_kg": 9600,
            "nationality": "United States"
          },
          {
            "id": "Iridium NEXT 8",
            "payload_mass_kg": 9600,
            "nationality": "United States"
          }
        ]
      },
      {
        "id": "EE86F74",
        "name": "Commercial Resupply Services",
        "payloads": [
          {
            "id": "Dragon Qualification Unit",
            "payload_mass_kg": null,
            "nationality": "United States"
          },
          {
            "id": "COTS Demo Flight 1",
            "payload_mass_kg": null,
            "nationality": "United States"
          },
          {
            "id": "COTS Demo Flight 2",
            "payload_mass_kg": 525,
            "nationality": "United States"
          },
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null
        ]
      },
      {
        "id": "6C42550",
        "name": "SES",
        "payloads": [
          {
            "id": "SES-8",
            "payload_mass_kg": 3170,
            "nationality": "Luxembourg"
          },
          {
            "id": "SES-9",
            "payload_mass_kg": 5271,
            "nationality": "Luxembourg"
          },
          {
            "id": "SES-10",
            "payload_mass_kg": 5300,
            "nationality": "Luxembourg"
          },
          null,
          null,
          {
            "id": "SES-12",
            "payload_mass_kg": 5383.85,
            "nationality": "Luxembourg"
          }
        ]
      },
      {
        "id": "FE3533D",
        "name": "JCSAT",
        "payloads": [
          {
            "id": "JCSAT-2B",
            "payload_mass_kg": 4696,
            "nationality": "Japan"
          },
          {
            "id": "JCSAT-16",
            "payload_mass_kg": 4600,
            "nationality": "Japan"
          }
        ]
      },
      {
        "id": "593B499",
        "name": "AsiaSat",
        "payloads": [
          {
            "id": "AsiaSat 8",
            "payload_mass_kg": 4535,
            "nationality": "Hong Kong"
          },
          {
            "id": "AsiaSat 6",
            "payload_mass_kg": 4428,
            "nationality": "Hong Kong"
          }
        ]
      },
      {
        "id": "CE91D46",
        "name": "Orbcomm OG2",
        "payloads": [
          {
            "id": "CRS-1",
            "payload_mass_kg": 400,
            "nationality": "United States"
          },
          {
            "id": "Orbcomm-OG2-M1",
            "payload_mass_kg": 1316,
            "nationality": "United States"
          },
          {
            "id": "Orbcomm-OG2-M2",
            "payload_mass_kg": 2034,
            "nationality": "United States"
          }
        ]
      },
      {
        "id": "2CF444A",
        "name": "ABS",
        "payloads": [
          {
            "id": "ABS-3A",
            "payload_mass_kg": 1954,
            "nationality": "Hong Kong"
          },
          null
        ]
      },
      {
        "id": "F7709F2",
        "name": "Eutelsat",
        "payloads": [
          {
            "id": "ABS-3A",
            "payload_mass_kg": 1954,
            "nationality": "Hong Kong"
          },
          {
            "id": "ABS-2A",
            "payload_mass_kg": 1800,
            "nationality": "Hong Kong"
          }
        ]
      }
    ]
  }
};

function App() {
  return (
    <div className="mx-10">
      <PayloadCard {...missionsResult}/>
    </div>
  );
}

export default App;
