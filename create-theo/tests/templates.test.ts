import {
  templates,
  templateCategories,
  getTemplate,
  getTemplatesByType,
  listTemplateIds,
} from "../src/templates.js";

describe("templates registry", () => {
  it("has 19 templates", () => {
    expect(templates).toHaveLength(19);
  });

  it("each template has required fields", () => {
    for (const t of templates) {
      expect(t.id).toBeTruthy();
      expect(t.name).toBeTruthy();
      expect(t.description).toBeTruthy();
      expect(["node", "go", "python", "rust", "java", "ruby", "php"]).toContain(t.language);
      expect(["api", "frontend", "fullstack", "monorepo", "worker"]).toContain(
        t.type,
      );
    }
  });

  it("getTemplate returns correct template", () => {
    const t = getTemplate("node-express");
    expect(t).toBeDefined();
    expect(t!.id).toBe("node-express");
  });

  it("getTemplate returns undefined for unknown", () => {
    expect(getTemplate("nonexistent")).toBeUndefined();
  });

  it("listTemplateIds returns all ids", () => {
    const ids = listTemplateIds();
    expect(ids).toContain("node-express");
    expect(ids).toContain("node-fastify");
    expect(ids).toContain("node-nextjs");
    expect(ids).toContain("go-api");
    expect(ids).toContain("python-fastapi");
    expect(ids).toContain("monorepo-turbo");
    expect(ids).toContain("fullstack-nextjs");
    expect(ids).toContain("node-nestjs");
    expect(ids).toContain("node-worker");
    expect(ids).toContain("rust-axum");
    expect(ids).toContain("java-spring");
    expect(ids).toContain("ruby-sinatra");
    expect(ids).toContain("monorepo-go");
    expect(ids).toContain("monorepo-python");
    expect(ids).toContain("monorepo-rust");
    expect(ids).toContain("monorepo-java");
    expect(ids).toContain("monorepo-ruby");
    expect(ids).toContain("monorepo-php");
    expect(ids).toContain("php-slim");
  });

  it("no duplicate template ids", () => {
    const ids = listTemplateIds();
    expect(new Set(ids).size).toBe(ids.length);
  });
});

describe("template categories", () => {
  it("has 5 categories", () => {
    expect(templateCategories).toHaveLength(5);
  });

  it("every template belongs to a valid category", () => {
    const categoryIds = templateCategories.map((c) => c.id);
    for (const t of templates) {
      expect(categoryIds).toContain(t.type);
    }
  });

  it("getTemplatesByType filters correctly", () => {
    const apis = getTemplatesByType("api");
    expect(apis.length).toBeGreaterThanOrEqual(8);
    expect(apis.every((t) => t.type === "api")).toBe(true);

    const workers = getTemplatesByType("worker");
    expect(workers).toHaveLength(1);
    expect(workers[0].id).toBe("node-worker");

    const monorepos = getTemplatesByType("monorepo");
    expect(monorepos).toHaveLength(7);
  });

  it("every category has at least one template", () => {
    for (const cat of templateCategories) {
      const filtered = getTemplatesByType(cat.id);
      expect(filtered.length).toBeGreaterThanOrEqual(1);
    }
  });
});
