import "fetch-mock-jest"
import { fetchVessels, fetchSchedule } from "../portChainAPIClient"

jest.mock("node-fetch", () => require("fetch-mock-jest").sandbox())
const fetchMock = require("node-fetch")

const BASE_URL = "https://some-domain.com/api/v2"

const MOCK_VESSELS_PAYLOAD = [
  {
    imo: 9303807,
    name: "ABIDJAN EXPRESS",
  },
  {
    imo: 9314935,
    name: "AS CAROLINA",
  },
]

const MOCK_SCHEDULE_PAYLOAD = {
  vessel: {
    imo: 9757187,
    name: "MILANO BRIDGE",
  },
  portCalls: [
    {
      arrival: "2018-12-30T08:00:00+00:00",
      departure: "2018-12-31T03:00:00+00:00",
      createdDate: "2018-11-15T14:58:44.813629+00:00",
      isOmitted: true,
      service: "East Coast Loop 4",
      port: {
        id: "HKHKG",
        name: "Hong Kong",
      },
      logEntries: [
        {
          updatedField: "departure",
          arrival: null,
          departure: "2018-12-31T03:00:00+00:00",
          isOmitted: null,
          createdDate: "2018-11-15T14:58:44.813629+00:00",
        },
        {
          updatedField: "arrival",
          arrival: "2018-12-30T08:00:00+00:00",
          departure: null,
          isOmitted: null,
          createdDate: "2018-11-15T14:58:44.813629+00:00",
        },
        {
          updatedField: "isOmitted",
          arrival: null,
          departure: null,
          isOmitted: true,
          createdDate: "2018-11-20T22:07:59.573723+00:00",
        },
      ],
    },
  ],
}

describe("fetchVessels", () => {
  beforeEach(() => {
    fetchMock.reset()
  })

  it("returns an empty list if the request is unsuccessfull", async () => {
    fetchMock.get(
      "https://some-domain.com/api/v2/vessels",
      Promise.resolve({ body: JSON.stringify("Server Error"), status: 503 })
    )

    const result = await fetchVessels(BASE_URL)

    expect(result.length).toEqual(0)
  })

  it("returns an Vessel List if the request is successfull", async () => {
    fetchMock.get(
      "https://some-domain.com/api/v2/vessels",
      Promise.resolve({ body: JSON.stringify(MOCK_VESSELS_PAYLOAD), status: 200 })
    )

    const result = await fetchVessels(BASE_URL)

    expect(result).toBeInstanceOf(Array)
    expect(result.length).toEqual(2)
    expect(Object.keys(result[0])).toEqual(["imo", "name"])
  })
})

describe("fetchSchedule", () => {
  beforeEach(() => {
    fetchMock.reset()
  })

  it("returns undefined if the request is unsuccessfull", async () => {
    fetchMock.get(
      "https://some-domain.com/api/v2/schedule/1",
      Promise.resolve({ body: JSON.stringify("Server Error"), status: 503 })
    )

    const result = await fetchSchedule(BASE_URL, 1)

    expect(result).toBeUndefined
  })

  it("returns an Vessel Schedule if the request is successfull", async () => {
    fetchMock.get(
      "https://some-domain.com/api/v2/schedule/1",
      Promise.resolve({ body: JSON.stringify(MOCK_SCHEDULE_PAYLOAD), status: 200 })
    )
    const result = (await fetchSchedule(BASE_URL, 1))!

    expect(result).not.toBeUndefined
    expect(Object.keys(result)).toContain("portCalls")
  })
})
