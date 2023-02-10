import { describe, it, expect } from "vitest";
import { getHost } from "./utils.js";

// The two tests marked with concurrent will be run in parallel
describe("Utils", () => {
  let location;
  it("should getHost on localhost", () => {
    location = {
      ancestorOrigins: {},
      href: "http://localhost:3000/",
      origin: "http://localhost:3000",
      protocol: "http:",
      host: "localhost:3000",
      hostname: "localhost",
      port: "3000",
      pathname: "/",
      search: "",
      hash: "",
    };
    const host = getHost(location);
    expect(host).toBe("arweave.dev");
  });
  it("should getHost on g8way.io", () => {
    location = {
      ancestorOrigins: {},
      href: "https://now.g8way.io/",
      origin: "https://now.g8way.io",
      protocol: "https:",
      host: "now.g8way.io",
      hostname: "now.g8way.io",
      port: "",
      pathname: "/",
      search: "",
      hash: "",
    };
    const host = getHost(location);
    expect(host).toBe("g8way.io");
  });
  it("should getHost on arweave.dev", () => {
    location = {
      ancestorOrigins: {},
      href: "https://now.arweave.dev/",
      origin: "https://now.arweave.dev",
      protocol: "https:",
      host: "now.arweave.dev",
      hostname: "now.arweave.dev",
      port: "",
      pathname: "/",
      search: "",
      hash: "",
    };
    const host = getHost(location);
    expect(host).toBe("arweave.dev");
  });
});
