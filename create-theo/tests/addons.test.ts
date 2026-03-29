import {
  getAvailableAddons,
  resolveAddonDependencies,
  supportsAddons,
  listAddonIds,
  getAddon,
} from "../src/addons.js";

describe("addons registry", () => {
  it("lists all addon ids", () => {
    expect(listAddonIds()).toEqual(["redis", "auth-jwt", "auth-oauth", "queue"]);
  });

  it("gets addon by id", () => {
    expect(getAddon("redis")?.name).toBe("Redis");
    expect(getAddon("auth-jwt")?.name).toBe("Auth (JWT)");
    expect(getAddon("auth-oauth")?.name).toBe("Auth (OAuth/OIDC)");
    expect(getAddon("queue")?.name).toBe("Queue");
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

  it("getAvailableAddons returns redis, auth-jwt, auth-oauth, and queue for api/node", () => {
    const addons = getAvailableAddons("api", "node");
    const ids = addons.map((a) => a.id);
    expect(ids).toContain("redis");
    expect(ids).toContain("auth-jwt");
    expect(ids).toContain("auth-oauth");
    expect(ids).toContain("queue");
  });

  it("getAvailableAddons returns redis but not auth for worker/node", () => {
    const addons = getAvailableAddons("worker", "node");
    const ids = addons.map((a) => a.id);
    expect(ids).toContain("redis");
    expect(ids).not.toContain("auth-jwt");
    expect(ids).not.toContain("auth-oauth");
    expect(ids).toContain("queue");
  });

  it("getAvailableAddons includes queue for go and python", () => {
    const goAddons = getAvailableAddons("api", "go");
    const goIds = goAddons.map((a) => a.id);
    expect(goIds).toContain("redis");
    expect(goIds).toContain("auth-jwt");
    expect(goIds).toContain("queue");

    const pyAddons = getAvailableAddons("api", "python");
    const pyIds = pyAddons.map((a) => a.id);
    expect(pyIds).toContain("queue");
  });

  it("getAvailableAddons excludes queue for rust, java, ruby", () => {
    for (const lang of ["rust", "java", "ruby"]) {
      const addons = getAvailableAddons("api", lang);
      const ids = addons.map((a) => a.id);
      expect(ids).toContain("redis");
      expect(ids).toContain("auth-jwt");
      expect(ids).not.toContain("queue");
    }
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
    expect(resolveAddonDependencies(["auth-jwt"])).toEqual(["auth-jwt"]);
  });

  it("resolveAddonDependencies throws on both auth types", () => {
    expect(() => resolveAddonDependencies(["auth-jwt", "auth-oauth"])).toThrow(
      "Cannot select both JWT and OAuth auth",
    );
  });
});
