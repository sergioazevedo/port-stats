import { fetchVessels, fetchSchedule } from "./portChainAPIClient";
import {
  buildPortStatsList,
  fivePortsWithMostAndFewestPortCalls,
  portCallDurationStatsByPort,
} from "./portStatsReport";
import { PortCallsByPortList, PortCallDurationByPortList, PortStatsList, Vessel, VesselSchedule, VesselScheduleList } from "./types";

const BASE_URL = "https://import-coding-challenge-api.portchain.com/api/v2";

export const main = async (): Promise<void> => {
  const vessels = await fetchVessels(BASE_URL);
  const promiseList: Array<Promise<VesselSchedule | undefined>> = vessels.map((vessel: Vessel) =>
    fetchSchedule(BASE_URL, vessel.imo)
  );
  const scheduleList: VesselScheduleList = (await Promise.all(promiseList)).filter(
    (value: VesselSchedule | undefined) => !!value
  );
  const stats: PortStatsList = buildPortStatsList(scheduleList);
  const [topFive, bottomFive] = fivePortsWithMostAndFewestPortCalls(stats);
  const portDurationReport: PortCallDurationByPortList = portCallDurationStatsByPort(stats);
  console.log(" ---------------------------------- Port Stats Results ------------------------------------- ");
  console.log("--> The 5 ports with most port calls");
  console.table(topFive);
  console.log("--> The 5 ports with fewest port Calls");
  console.table(bottomFive);
  console.log("--> Port call durations per Port");
  console.table(portDurationReport);
};

main();
