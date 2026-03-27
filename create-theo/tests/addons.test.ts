import {
  getAvailableAddons,
  resolveAddonDependencies,
  supportsAddons,
  listAddonIds,
  getAddon,
} from "../src/addons.js";

describe("addons registry", () => {
  it("lists all addon ids", () => {
    expect(listAddonIds()).toEqual(["redis", "auth", "queue"]);
  });

  it("gets addon by id", () => {
    expect(getAddon("redis")?.name).toBe("Redis");
    expect(getAddon("auth")?.name).toBe("Auth (JWT)");
    expect(getAddon("queue")?.name).toBe("Queue (BullMQ)");
    expect(getAddon("unknown")).toBeUndefined();
  });

  it("supportsAddons returns true for api and worker", () => {
    expect(supportsAddons("api")).toBe(true);
    expect(supportsAddons("worker")).toBe(true);
  });

  it("supportsAddons returns false for frontend, fullstack, monorepo", () => {
    expect(supportsAddons("frontend")).toBe(false);
    expect(supportsAddons("fullstack")).toBe(false);
    expect(supportsAddons("monorepo")).toBe(false);
  });

  it("getAvailableAddons returns redis and auth for api/node", () => {
    const addons = getAvailableAddons("api", "node");
    const ids = addons.map((a) => a.id);
    expect(ids).toContain("redis");
    expect(ids).toContain("auth");
    expect(ids).toContain("queue");
  });

  it("getAvailableAddons returns redis but not auth for worker/node", () => {
    const addons = getAvailableAddons("worker", "node");
    const ids = addons.map((a) => a.id);
    expect(ids).toContain("redis");
    expect(ids).not.toContain("auth");
    expect(ids).toContain("queue");
  });

  it("getAvailableAddons excludes queue for go", () => {
    const addons = getAvailableAddons("api", "go");
    const ids = addons.map((a) => a.id);
    expect(ids).toContain("redis");
    expect(ids).toContain("auth");
    expect(ids).not.toContain("queue");
  });

  it("getAvailableAddons returns nothing for frontend", () => {
    expect(getAvailableAddons("frontend", "node")).toHaveLength(0);
  });

  it("resolveAddonDependencies adds redis when queue is selected", () => {
    expect(resolveAddonDependencies(["queue"])).toEqual(["redis", "queue"]);
  });

  it("resolveAddonDependencies does not duplicate redis", () => {
    expect(resolveAddonDependencies(["redis", "queue"])).toEqual(["redis", "queue"]);
  });

  it("resolveAddonDependencies passes through non-queue addons", () => {
    expect(resolveAddonDependencies(["auth"])).toEqual(["auth"]);
  });
});
