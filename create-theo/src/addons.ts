import type { TemplateType } from "./templates.js";

export type AddonId = "redis" | "auth" | "queue";

export interface AddonInfo {
  id: AddonId;
  name: string;
  description: string;
}

export const addons: AddonInfo[] = [
  { id: "redis", name: "Redis", description: "Cache with ioredis" },
  { id: "auth", name: "Auth (JWT)", description: "JWT authentication middleware" },
  { id: "queue", name: "Queue (BullMQ)", description: "Background job queue" },
];

export function getAvailableAddons(
  templateType: TemplateType,
  language: string,
): AddonInfo[] {
  return addons.filter((addon) => {
    switch (addon.id) {
      case "redis":
        return templateType === "api" || templateType === "worker";
      case "auth":
        return templateType === "api";
      case "queue":
        return (
          (templateType === "api" || templateType === "worker") &&
          language === "node"
        );
      default:
        return false;
    }
  });
}

export function supportsAddons(templateType: TemplateType): boolean {
  return templateType === "api" || templateType === "worker";
}

export function resolveAddonDependencies(selected: AddonId[]): AddonId[] {
  const result = [...selected];
  if (result.includes("queue") && !result.includes("redis")) {
    result.unshift("redis");
  }
  return result;
}

export function listAddonIds(): string[] {
  return addons.map((a) => a.id);
}

export function getAddon(id: string): AddonInfo | undefined {
  return addons.find((a) => a.id === id);
}
