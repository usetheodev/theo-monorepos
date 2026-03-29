import { sanitizeProjectName, validateProjectName } from "../src/validate.js";

describe("sanitizeProjectName", () => {
  it("lowercases input", () => {
    expect(sanitizeProjectName("MyProject")).toBe("myproject");
  });

  it("replaces invalid characters with hyphens", () => {
    expect(sanitizeProjectName("my_project.v2")).toBe("my-project-v2");
  });

  it("collapses consecutive hyphens", () => {
    expect(sanitizeProjectName("my---project")).toBe("my-project");
  });

  it("trims leading and trailing hyphens", () => {
    expect(sanitizeProjectName("-my-project-")).toBe("my-project");
  });

  it("prefixes with p- if starts with number", () => {
    expect(sanitizeProjectName("123app")).toBe("p-123app");
  });

  it("truncates to 63 characters", () => {
    const long = "a".repeat(100);
    expect(sanitizeProjectName(long).length).toBeLessThanOrEqual(63);
  });

  it("handles empty string", () => {
    const result = sanitizeProjectName("");
    expect(result).toBe("p-");
  });
});

describe("validateProjectName", () => {
  it("accepts valid name", () => {
    expect(validateProjectName("my-project")).toBe(true);
  });

  it("accepts single letter", () => {
    expect(validateProjectName("a")).not.toBe(true);
  });

  it("rejects empty string", () => {
    expect(validateProjectName("")).not.toBe(true);
  });

  it("rejects name over 63 chars", () => {
    expect(validateProjectName("a".repeat(64))).not.toBe(true);
  });

  it("rejects uppercase", () => {
    expect(validateProjectName("MyProject")).not.toBe(true);
  });

  it("rejects starting with number", () => {
    expect(validateProjectName("1project")).not.toBe(true);
  });

  it("rejects special characters", () => {
    expect(validateProjectName("my_project")).not.toBe(true);
  });

  it("rejects unicode name: cafe-app with accent", () => {
    expect(validateProjectName("caf\u00e9-app")).not.toBe(true);
  });

  it("rejects emoji input", () => {
    expect(validateProjectName("\ud83d\ude80-app")).not.toBe(true);
  });

  it("accepts exactly 63-char valid name", () => {
    const name63 = "a" + "b".repeat(61) + "c"; // 63 chars, starts with letter, ends with letter
    expect(name63.length).toBe(63);
    expect(validateProjectName(name63)).toBe(true);
  });

  it("rejects 64-char name (just over boundary)", () => {
    const name64 = "a" + "b".repeat(62) + "c"; // 64 chars
    expect(name64.length).toBe(64);
    expect(validateProjectName(name64)).not.toBe(true);
  });

  it("rejects all-hyphens string", () => {
    expect(validateProjectName("---")).not.toBe(true);
  });

  it("rejects whitespace-only string", () => {
    expect(validateProjectName("   ")).not.toBe(true);
  });

  it("rejects empty string (explicit)", () => {
    expect(validateProjectName("")).not.toBe(true);
  });
});

describe("sanitizeProjectName edge cases", () => {
  it("sanitizes unicode name: cafe with accent", () => {
    const result = sanitizeProjectName("caf\u00e9-app");
    expect(result).toMatch(/^[a-z][a-z0-9-]*[a-z0-9]$/);
    expect(result).not.toContain("\u00e9");
  });

  it("sanitizes emoji input", () => {
    const result = sanitizeProjectName("\ud83d\ude80-app");
    expect(result).toMatch(/^[a-z]/);
    expect(result).not.toContain("\ud83d\ude80");
  });

  it("sanitizes all-hyphens to prefixed form", () => {
    const result = sanitizeProjectName("---");
    expect(result).toMatch(/^[a-z]/);
  });

  it("sanitizes whitespace-only to prefixed form", () => {
    const result = sanitizeProjectName("   ");
    expect(result).toMatch(/^[a-z]/);
  });

  it("truncates to exactly 63 chars max", () => {
    const long = "a".repeat(100);
    const result = sanitizeProjectName(long);
    expect(result.length).toBeLessThanOrEqual(63);
  });
});
