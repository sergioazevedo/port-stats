import {
  buildPortStatsList,
  fivePortsWithMostAndFewestPortCalls,
  portCallDurationStatsByPort,
} from "../portStatsReport"
import { Port, PortCallDurationByPort, PortCallDurationByPortList, PortCallsByPort, PortCallsByPortList, PortStats, PortStatsList } from "../types"

const buildFakePorts = (qty: number): Array<Port> => {
  const result: Array<Port> = []
  for (let index = 0; index < qty; index++) {
    result.push({
      id: `${index}`,
      name: `Port-${index}`,
    })
  }

  return result
}

const fakeDurations = (qty: number): Array<number> => {
  const result: Array<number> = []
  for (let index = 0; index < qty; index++) {
    const random = Math.floor(Math.random() * (42)) + 1
    const value = new Date().valueOf() - random
    result.push(value)
  }

  return result
}

const buildFakePortStatsList = (
  ports: Array<Port>,
  topFivePorts: Array<number>,
  bottomFivePorts: Array<number>
): PortStatsList => {
  const result: PortStatsList = []
  let portCalls: number
  let durations : Array<number> = []

  ports.forEach((port: Port, index: number) => {
    if (topFivePorts.includes(index)) {
      portCalls = 42
      durations = fakeDurations(42)
    } else if (bottomFivePorts.includes(index)) {
      portCalls = 2
      durations = fakeDurations(2)
    } else {
      portCalls = 10
      durations = fakeDurations(10)
    }

    result.push({
      port: port,
      totalPortCalls: portCalls,
      durations: durations,
    })
  })

  return result
}

describe("buildPortStatsList", () => {
  it("returns an empty list if an empty schedule lists is provided", () => {
    const result = buildPortStatsList([])

    expect(result.length).toEqual(0)
  })

  describe("Given a schedule list wiht one schedule and non-ommited port-calls on 3 ports", () => {
    var portStatusList: PortStatsList
    const scheduleThreePortsNonOmmited = {
      portCalls: [
        {
          arrival: "2018-12-30T08:00:00+00:00",
          departure: "2018-12-31T03:00:00+00:00",
          isOmitted: false,
          port: {
            id: "HKHKG",
            name: "Hong Kong",
          },
        },
        {
          arrival: "2018-12-30T08:00:00+00:00",
          departure: "2018-12-31T03:00:00+00:00",
          isOmitted: false,
          port: {
            id: "CNYTN",
            name: "Yantian Pt",
          },
        },
        {
          arrival: "2018-12-30T08:00:00+00:00",
          departure: "2018-12-31T03:00:00+00:00",
          isOmitted: false,
          port: {
            id: "USNYC",
            name: "New York",
          },
        },
        {
          arrival: "2018-12-30T08:00:00+00:00",
          departure: "2018-12-31T03:00:00+00:00",
          isOmitted: false,
          port: {
            id: "HKHKG",
            name: "Hong Kong",
          },
        },
      ],
    }

    beforeAll(() => {
      portStatusList = buildPortStatsList([scheduleThreePortsNonOmmited])
    })

    it("must contain data of 3 for ports", () => {
      expect(portStatusList.length).toEqual(3)
      expect(portStatusList.map((item) => item.port.name)).toEqual(["Hong Kong", "Yantian Pt", "New York"])
    })

    it("must compute totalPortCalls for all ports in the schedule", () => {
      portStatusList.forEach((portStats: PortStats) => {
        expect(portStats.totalPortCalls).toBeGreaterThan(0)
      })
    })

    it("HongKong port must have 2 port calls computed", () => {
      const hongKongPortStats = portStatusList.find((item: PortStats) => item.port.name === "Hong Kong")

      expect(hongKongPortStats).not.toBeUndefined
      expect(hongKongPortStats?.totalPortCalls).toEqual(2)
    })

    it("must collect all port-call durations by ports from the schedule", () => {
      portStatusList.forEach((portStats: PortStats) => {
        expect(portStats.durations.length).toBeGreaterThan(0)
      })
    })

    it("HongKong port must have 2 durations collected/registered", () => {
      const hongKongPortStats = portStatusList.find((item: PortStats) => item.port.name === "Hong Kong")

      expect(hongKongPortStats).not.toBeUndefined
      expect(hongKongPortStats?.durations.length).toEqual(2)
    })
  })
})

describe("fivePortsWithMostAndFewestPortCalls", () => {
  it("returns a tuple with two empty list if an empty PortStatsList is given", () => {
    const [topFive, bottomFive] = fivePortsWithMostAndFewestPortCalls([])

    expect(topFive.length).toEqual(0)
    expect(bottomFive.length).toEqual(0)
  })

  describe("Given a list of PortStats from 10 different ports", () => {
    var tuple: [PortCallsByPortList, PortCallsByPortList]
    const ports: Array<Port> = buildFakePorts(10)
    const mockPortCallStatsList: PortStatsList = buildFakePortStatsList(ports, [1, 2, 5, 8, 9], [0, 3, 4, 6, 7])

    beforeAll(() => {
      tuple = fivePortsWithMostAndFewestPortCalls(mockPortCallStatsList)
    })

    it("returns a tuple with two non empty PortCallsByPortList", () => {
      expect(tuple.length).toEqual(2)
      expect(tuple[0].length).toEqual(5)
      expect(tuple[1].length).toEqual(5)
    })

    it("must return a list of PortCallsByPort for the 5 ports with most port-calls", () => {
      const topFivePorts: Array<string> = tuple[0].map((item: PortCallsByPort) => item.portName)

      expect(topFivePorts).toEqual(["Port-1","Port-2","Port-5","Port-8","Port-9"])
    })

    it("must return a list of PortCallsByPort for the 5 ports with fewest port-calls", () => {
      const bottomFivePorts: Array<string> = tuple[1].map((item: PortCallsByPort) => item.portName)

      expect(bottomFivePorts).toEqual(["Port-0","Port-3","Port-4","Port-6","Port-7"])
    })

    it("must map PortStats to PortCallsByPort", () => {
      const result : PortCallsByPort = tuple[0][0]
      expect(Object.keys(result)).toEqual(["portName","totalPortCalls"])
    })
  })
})

describe("portCallDurationStatsByPort", () => {
  it("returns am empty list if an empty PortStatsList is given", () => {
    const result = portCallDurationStatsByPort([])

    expect(result.length).toEqual(0)
  })

  describe("Given a list of PortStats from 10 different ports", () => {
    var result: PortCallDurationByPortList
    const ports: Array<Port> = buildFakePorts(10)
    const mockPortCallStatsList: PortStatsList = buildFakePortStatsList(ports, [1, 2, 5, 8, 9], [0, 3, 4, 6, 7])

    beforeAll(() => {
      result = portCallDurationStatsByPort(mockPortCallStatsList)
    })

    it("must return a list of PortCallDurationByPortList with data from 10 ports", () => {
      expect(result.length).toEqual(10)
    })

    it("each element of the PortCallDurationByPortList must contain the following duration percentiles: 5, 20, 50, 75 and 90", () => {
      result.forEach((item: PortCallDurationByPort) => {
        expect(Object.keys(item)).toEqual(['portName','pct5','pct20','pct50','pct75','pct90'])
        expect(item.portName).toBeDefined
        expect(item.pct5).toBeDefined
        expect(item.pct20).toBeDefined
        expect(item.pct50).toBeDefined
        expect(item.pct75).toBeDefined
        expect(item.pct90).toBeDefined
      })
    })
  })
})
