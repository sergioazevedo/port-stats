export interface Vessel {
  imo: number,
  name: string
}

export type VesselList = Array<Vessel>

export interface Port {
  id: string,
  name: string
}

export interface PortCall {
  arrival: string,
  departure: string,
  isOmitted: boolean,
  port: Port
}

export type PortCallList = Array<PortCall>

export interface VesselSchedule{
   portCalls: PortCallList
}

export type VesselScheduleList = Array<VesselSchedule>

export interface PortStats {
  port : Port
  totalPortCalls: number
  durations: Array<number>
}

export type PortStatsList = Array<PortStats>

export interface PortCallsByPort {
  portName: string,
  totalPortCalls: number
}

export type PortCallsByPortList = Array<PortCallsByPort>

export interface PortCallDurationByPort {
  portName: string,
  pct5 : string,
  pct20: string,
  pct50: string,
  pct75: string,
  pct90: string
}

export type PortCallDurationByPortList = Array<PortCallDurationByPort>

