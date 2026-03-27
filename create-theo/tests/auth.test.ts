import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import { scaffold } from "../src/scaffold.js";
import { getTemplate } from "../src/templates.js";

function createTempDir(): string {
  return fs.mkdtempSync(path.join(os.tmpdir(), "create-theo-auth-"));
}

function cleanup(dir: string): void {
  fs.rmSync(dir, { recursive: true, force: true });
}

describe("scaffold with auth", () => {
  let tempDir: string;

  beforeEach(() => { tempDir = createTempDir(); });
  afterEach(() => { cleanup(tempDir); });

  it("adds auth middleware to node-express", () => {
    const template = getTemplate("node-express")!;
    const targetDir = path.join(tempDir, "auth-express");

    scaffold({ projectName: "auth-express", template, targetDir, addons: ["auth"], skipInstall: true, skipGit: true });

    expect(fs.existsSync(path.join(targetDir, "src", "middleware", "auth.js"))).toBe(true);
    const auth = fs.readFileSync(path.join(targetDir, "src", "middleware", "auth.js"), "utf-8");
    expect(auth).toContain("jwt.verify");
    expect(auth).toContain("generateToken");

    const pkg = JSON.parse(fs.readFileSync(path.join(targetDir, "package.json"), "utf-8"));
    expect(pkg.dependencies.jsonwebtoken).toBeDefined();

    const env = fs.readFileSync(path.join(targetDir, ".env"), "utf-8");
    expect(env).toContain("JWT_SECRET");
  });

  it("adds auth plugin to node-fastify", () => {
    const template = getTemplate("node-fastify")!;
    const targetDir = path.join(tempDir, "auth-fastify");

    scaffold({ projectName: "auth-fastify", template, targetDir, addons: ["auth"], skipInstall: true, skipGit: true });

    expect(fs.existsSync(path.join(targetDir, "src", "plugins", "auth.js"))).toBe(true);
    const auth = fs.readFileSync(path.join(targetDir, "src", "plugins", "auth.js"), "utf-8");
    expect(auth).toContain("fastify-plugin");
    expect(auth).toContain("fastify.decorate");

    const pkg = JSON.parse(fs.readFileSync(path.join(targetDir, "package.json"), "utf-8"));
    expect(pkg.dependencies["fastify-plugin"]).toBeDefined();
  });

  it("adds auth guard to node-nestjs", () => {
    const template = getTemplate("node-nestjs")!;
    const targetDir = path.join(tempDir, "auth-nestjs");

    scaffold({ projectName: "auth-nestjs", template, targetDir, addons: ["auth"], skipInstall: true, skipGit: true });

    expect(fs.existsSync(path.join(targetDir, "src", "guards", "auth.guard.ts"))).toBe(true);
    const guard = fs.readFileSync(path.join(targetDir, "src", "guards", "auth.guard.ts"), "utf-8");
    expect(guard).toContain("@Injectable");
    expect(guard).toContain("CanActivate");

    const pkg = JSON.parse(fs.readFileSync(path.join(targetDir, "package.json"), "utf-8"));
    expect(pkg.devDependencies["@types/jsonwebtoken"]).toBeDefined();
  });

  it("adds auth to go-api", () => {
    const template = getTemplate("go-api")!;
    const targetDir = path.join(tempDir, "auth-go");

    scaffold({ projectName: "auth-go", template, targetDir, addons: ["auth"], skipInstall: true, skipGit: true });

    expect(fs.existsSync(path.join(targetDir, "internal", "auth", "auth.go"))).toBe(true);
    const goMod = fs.readFileSync(path.join(targetDir, "go.mod"), "utf-8");
    expect(goMod).toContain("golang-jwt");
  });

  it("adds auth to python-fastapi", () => {
    const template = getTemplate("python-fastapi")!;
    const targetDir = path.join(tempDir, "auth-py");

    scaffold({ projectName: "auth-py", template, targetDir, addons: ["auth"], skipInstall: true, skipGit: true });

    expect(fs.existsSync(path.join(targetDir, "auth.py"))).toBe(true);
    const auth = fs.readFileSync(path.join(targetDir, "auth.py"), "utf-8");
    expect(auth).toContain("HTTPBearer");
    expect(auth).toContain("jwt.decode");

    const reqs = fs.readFileSync(path.join(targetDir, "requirements.txt"), "utf-8");
    expect(reqs).toContain("pyjwt");
  });
});
