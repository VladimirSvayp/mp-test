import { create } from "zustand";
import { sleep } from "../utils/sleep";

export interface Location {
  locationID: number;
  name: string;
}

export interface Environment {
  environmentID: number;
  name: string;
}

export interface Server {
  serverID: number;
  name: string;
  locationID: number;
  environmentID: number;
}

export interface LocationsStore {
  isLoaded: boolean;
  locations: Location[];
  environments: Environment[];
  servers: Server[];

  fetch: () => Promise<void>;
}

export const useLocationsStore = create<LocationsStore>((set) => {
  const fetch = async () => {
    await sleep(3000);

    const { default: data } = await import("./data.json");
    set({
      ...data,
      isLoaded: true,
    });
  };

  return {
    isLoaded: false,
    locations: [],
    environments: [],
    servers: [],
    fetch,
  };
});
