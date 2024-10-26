import {
  PortCall,
  PortCallDurationByPort,
  PortCallDurationByPortList,
  PortCallsByPort,
  PortCallsByPortList,
  PortStats,
  PortStatsList,
  VesselSchedule,
  VesselScheduleList } from "./types"

import * as hdr from "hdr-histogram-js"
hdr.initWebAssemblySync();

export const fivePortsWithMostAndFewestPortCalls = (stats: PortStatsList) : [PortCallsByPortList, PortCallsByPortList] => {
  const sorted = stats.sort((a: PortStats, b: PortStats) => b.totalPortCalls - a.totalPortCalls)

  const mostCalls: Array<PortCallsByPort> = sorted
    .slice(0, 5)
    .map((stats: PortStats) => ( buildPortCallByPort(stats) )
  )

  const fewerCalls: Array<PortCallsByPort> = sorted
    .slice(-5, undefined)
    .map((stats: PortStats) => ( buildPortCallByPort(stats) )
  )

  return [mostCalls, fewerCalls]
}

const buildPortCallByPort = (stats: PortStats) : PortCallsByPort => {
  return { portName: stats.port.name, totalPortCalls: stats.totalPortCalls } as PortCallsByPort
}

export const portCallDurationStatsByPort = (stats: PortStatsList) : PortCallDurationByPortList => {
  return stats.map((item : PortStats) : PortCallDurationByPort => ( buildPortCallDurationByPort(item) ))
}

const buildPortCallDurationByPort = (item: PortStats) : PortCallDurationByPort => {
  const histogram = hdr.build({useWebAssembly: true})
  try {
    item.durations.forEach((duration: number) => {
      histogram.recordValue(duration);
    })

    const [pct5, pct20, pct50, pct75, pct90] = [5,20,50,75,90].map((pct: number) : string => {
      const millisecDuration = histogram.getValueAtPercentile(pct)
      const durationInHours = Math.ceil(millisecDuration / (1000 * 3600))
      return `${durationInHours} hours`
    })

    return {
      portName: item.port.name,
      pct5 : pct5,
      pct20: pct20,
      pct50: pct50,
      pct75: pct75,
      pct90: pct90
    } as PortCallDurationByPort

  } finally{
    histogram.destroy();
  }
}

export const buildPortStatsList = (schedules: VesselScheduleList) : PortStatsList => {
  const portMap : Map<string, PortStats> = new Map<string, PortStats>()

  schedules.forEach((schedule : VesselSchedule) : void => {
    schedule.portCalls
      .filter(
        (portcall : PortCall) => ( portcall.isOmitted === false )
      )
      .forEach(
        (portCall : PortCall) => ( extractPortCallData(portCall, portMap))
      )
  })
  const statList : PortStatsList = [...portMap].map(([_, stats]) => ( stats ));

  return statList
}

const extractPortCallData = (portCall: PortCall, portMap: Map<String, PortStats>) : void => {
  const arrival: Date = new Date(portCall.arrival)
  const departure: Date = new Date(portCall.departure)
  const duration = departure.valueOf() - arrival.valueOf()

  if (!portMap.has(portCall.port.id)) {
    const stats : PortStats = {
      port: portCall.port,
      totalPortCalls: 1,
      durations: [duration]
    }
    portMap.set(portCall.port.id, stats)
  } else {
    const stats : PortStats = portMap.get(portCall.port.id)!
    stats.durations.push(duration)
    stats.totalPortCalls = stats.totalPortCalls + 1
  }
}
