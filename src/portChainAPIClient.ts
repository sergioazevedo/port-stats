import fetch from "node-fetch"
import { VesselList, VesselSchedule } from './types';

export const fetchVessels = async (baseUrl: string) : Promise<VesselList> => {
  const url = buildURL(baseUrl, 'vessels')
  const options = {
    method: 'GET',
    headers: {accept: 'application/json'}
  };

  const response : fetch.Response = await fetch(url, options)
  if (!response.ok) {
    return []
  }

  return await response.json()
}

export const fetchSchedule = async (baseUrl: string, vesselImo: number) : Promise<VesselSchedule | undefined> => {
  const url = buildURL(baseUrl, `schedule/${vesselImo}`)
  const options = {
    method: 'GET',
    headers: {accept: 'application/json'}
  };

  const response : fetch.Response = await fetch(url, options)
  if (!response.ok) {
    return Promise.resolve(undefined)
  }

  const schedule : VesselSchedule = await response.json()

  return schedule
}

const buildURL = (baseUrl: string, resource: string) : URL => {
  return new URL(`${baseUrl}/${resource}`);
}
