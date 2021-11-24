import e from "express";
import supertest from "supertest";
import app from "../src/app";
import { Language } from "../src/entity/Language";

const request = supertest(app);

describe("GET /v1/languages", () => {
  const LANGUAGES = [
    { name: "english", priority: 2 },
    { name: "marathi", priority: 3 },
    { name: "hindi", priority: 1 },
  ];
  beforeEach(async () => {
    for (let i = 0; i < LANGUAGES.length; i++) {
      const element = LANGUAGES[i];
      const lang = await Language.create({
        name: element.name,
        priority: element.priority,
      }).save();
    }
  });

  test("should return status 200", async () => {
    const res = await request.get("/v1/languages");
    expect(res.statusCode).toBe(200);
  });

  test("should return content type json", async () => {
    const res = await request.get("/v1/languages");
    expect(res.headers["content-type"]).toEqual(
      expect.stringContaining("json")
    );
  });

  test("should return data", async () => {
    const res = await request.get("/v1/languages");

    expect(res.body.data.languages).toBeDefined();
  });

  test("should return array of books", async () => {
    const res = await request.get("/v1/languages");

    expect(Array.isArray(res.body.data.languages)).toBe(true);
  });

  test("should return proper array of objects", async () => {
    const res = await request
      .get("/v1/languages")
      .query({ order: "+priority" });

    expect(res.body.data.languages).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          name: expect.any(String),
          priority: expect.any(Number),
        }),
      ])
    );
  });

  test("should return language in ascending order when given '+' order priority ", async () => {
    const res = await request
      .get("/v1/languages")
      .query({ order: "+priority" });

    expect(
      res.body.data.languages.map((e) => ({
        name: e.name,
        priority: e.priority,
      }))
    ).toEqual(LANGUAGES.sort((a, b) => a.priority - b.priority));
  });

  test("should return language in ascending order when given '-' order priority ", async () => {
    const res = await request
      .get("/v1/languages")
      .query({ order: "-priority" });

    expect(
      res.body.data.languages.map((e) => ({
        name: e.name,
        priority: e.priority,
      }))
    ).toEqual(LANGUAGES.sort((a, b) => b.priority - a.priority));
  });
});
