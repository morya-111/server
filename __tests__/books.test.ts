import faker from "faker";
import supertest from "supertest";
import app from "../src/app";
import { Book } from "../src/entity/Book";
import { Image } from "../src/entity/Image";
import { Language } from "../src/entity/Language";
import { User } from "../src/entity/User";
import { Auth } from "../src/entity/Auth";
const request = supertest(app);

describe("GET /v1/books", () => {
  beforeEach(async () => {
    const user = await User.create({
      first_name: faker.name.firstName(),
      last_name: faker.name.lastName(),
      email: faker.internet.email(),
      role: "INDIVIDUAL",
    }).save();
    const lang = await Language.create({ name: faker.lorem.word() }).save();
    const GENRE = [
      "action and adventure",
      "classics",
      "comic book or graphic novel",
    ];
    for (let i = 0; i < 30; i++) {
      const img = await Image.create({
        url: faker.internet.url(),
      }).save();
      const book = await Book.create({
        name: faker.lorem.words(6),
        author: faker.name.firstName(),
        genre: GENRE[Math.floor(Math.random() * GENRE.length)],
        language: lang,
        publisher: faker.lorem.word(),
        image: img,
        user,
      }).save();
    }
  });

  test("should return status 200", async () => {
    const res = await request.get("/v1/books");
    expect(res.statusCode).toBe(200);
  });

  test("should return content type json", async () => {
    const res = await request.get("/v1/books");
    expect(res.headers["content-type"]).toEqual(
      expect.stringContaining("json")
    );
  });

  test("should return data", async () => {
    const res = await request.get("/v1/books");

    expect(res.body.data.books).toBeDefined();
  });

  test("should return array of books", async () => {
    const res = await request.get("/v1/books");

    expect(Array.isArray(res.body.data.books)).toBe(true);
  });

  test("should return same number of books as limit", async () => {
    const limit = 15;

    const res = await request.get("/v1/books").query({
      limit,
      page: 1,
    });
    expect(res.body.data.books.length).toBe(limit);
  });

  test("should have all data on each book", async () => {
    const res = await request.get("/v1/books");

    const books = res.body.data.books;

    const randomBook = books[Math.floor(Math.random() * books.length)];

    expect(randomBook).toMatchObject({
      name: expect.any(String),
      genre: expect.any(String),
      author: expect.any(String),
      publisher: expect.any(String),
      language: {
        name: expect.any(String),
      },
      image: expect.objectContaining({ url: expect.any(String) }),
    });
  });

  describe("pagination", () => {
    test("info should be returned", async () => {
      const res = await request.get("/v1/books").query({
        limit: 10,
        page: 1,
      });

      expect(res.body.data.pagination).toBeDefined();

      expect(res.body.data.pagination).toMatchObject({
        page: expect.any(Number),
        limit: expect.any(Number),
        isPrevious: expect.any(Boolean),
        isNext: expect.any(Boolean),
      });
    });

    test("should not have previous when on first page", async () => {
      const res = await request.get("/v1/books").query({
        limit: 10,
        page: 1,
      });

      expect(res.body.data.pagination).toMatchObject({
        page: 1,
        limit: 10,
        isPrevious: false,
      });
    });

    test("should have previous page on second page", async () => {
      const res = await request.get("/v1/books").query({
        limit: 10,
        page: 2,
      });

      expect(res.body.data.pagination).toMatchObject({
        page: 2,
        limit: 10,
        isPrevious: true,
        previousPage: 1,
      });
    });

    test("should not have next page on last page", async () => {
      const res = await request.get("/v1/books").query({
        limit: 10,
        page: 3,
      });

      expect(res.body.data.pagination).toMatchObject({
        page: 3,
        limit: 10,
        isPrevious: true,
        previousPage: 2,
        isNext: false,
      });
    });

    test("should have next page on first page", async () => {
      const res = await request.get("/v1/books").query({
        limit: 10,
        page: 1,
      });

      expect(res.body.data.pagination).toMatchObject({
        page: 1,
        limit: 10,
        isPrevious: false,
        nextPage: 2,
        isNext: true,
      });
    });

    test("should have total pages", async () => {
      const res = await request.get("/v1/books").query({
        page: 1,
      });

      expect(res.body.data.pagination).toMatchObject({
        page: 1,
        limit: 25,
        isPrevious: false,
        nextPage: 2,
        isNext: true,
        pages: 2,
      });
    });
  });
});

describe("GET /v1/books/:id", () => {
  let book;
  beforeEach(async () => {
    const lang = await Language.create({ name: faker.lorem.word() }).save();
    const GENRE = [
      "action and adventure",
      "classics",
      "comic book or graphic novel",
    ];
    for (let i = 0; i < 30; i++) {
      const img = await Image.create({
        url: faker.internet.url(),
      }).save();
      book = await Book.create({
        name: faker.lorem.words(6),
        author: faker.name.firstName(),
        genre: GENRE[Math.floor(Math.random() * GENRE.length)],
        language: lang,
        publisher: faker.lorem.word(),
        image: img,
      }).save();
    }
  });

  test("should return status 200", async () => {
    const res = await request.get(`/v1/books/${book.id}`);
    expect(res.statusCode).toBe(200);
  });

  test("should return content type json", async () => {
    const res = await request.get(`/v1/books/${book.id}`);
    expect(res.headers["content-type"]).toEqual(
      expect.stringContaining("json")
    );
  });

  test("should return data", async () => {
    const res = await request.get(`/v1/books/${book.id}`);

    expect(res.body.data.book).toBeDefined();
  });

  test("should have all data of book", async () => {
    const res = await request.get(`/v1/books/${book.id}`);

    const returnedBook = res.body.data.book;

    expect(returnedBook).toMatchObject({
      name: expect.any(String),
      genre: expect.any(String),
      author: expect.any(String),
      publisher: expect.any(String),
      language: {
        name: expect.any(String),
      },
      image: expect.objectContaining({ url: expect.any(String) }),
    });
  });
});

describe("GET /v1/books/mybooks", () => {
  const loginData = {
    email: faker.internet.email(),
    password: faker.internet.password(8),
    cookie: null,
  };

  beforeEach(async () => {
    const user = User.create({
      first_name: faker.name.firstName(8),
      last_name: faker.name.lastName(8),
      email: loginData.email,
      role: "INDIVIDUAL",
    });
    await user.save();
    const auth = Auth.create({
      password: loginData.password,
      user: user,
    });
    auth.save();

    const authedUser = await request
      .post("/v1/user/login")
      .send({ email: loginData.email, password: loginData.password });

    const cookie = authedUser.headers["set-cookie"][0];
    loginData.cookie = cookie;

    const lang1 = await Language.create({ name: faker.lorem.word() }).save();
    const lang2 = await Language.create({ name: faker.lorem.word() }).save();
    const GENRE = [
      "action and adventure",
      "classics",
      "comic book or graphic novel",
    ];
    const languages = [lang1, lang2];
    for (let i = 0; i < 5; i++) {
      const book = await Book.create({
        name: faker.lorem.words(6),
        description: faker.lorem.paragraph(3),
        author: faker.name.firstName(),
        genre: GENRE[Math.floor(Math.random() * GENRE.length)],
        publisher: faker.lorem.word(),
        language: languages[Math.floor(Math.random() * languages.length)],
        user: user,
      }).save();
    }
  });

  test("should return data", async () => {
    const res = await request
      .get(`/v1/books/mybooks`)
      .set("Cookie", [loginData.cookie]);

    expect(res.body.data.books).toBeDefined();
  });
  test("should be protected", async () => {
    const bookRes = await request.get("/v1/books/mybooks");
    expect(bookRes.statusCode).toBe(401);
  });

  test("should return array of books", async () => {
    const bookRes = await request
      .get("/v1/books/mybooks")
      .set("Cookie", [loginData.cookie]);

    expect(Array.isArray(bookRes.body.data.books)).toBe(true);
  });

  test("should return in total 5 books ", async () => {
    const bookRes = await request
      .get("/v1/books/mybooks")
      .set("Cookie", [loginData.cookie]);

    expect(bookRes.body.data.books.length).toBe(5);
  });

  test("All books should be valid Books", async () => {
    const bookRes = await request
      .get("/v1/books/mybooks")
      .set("Cookie", [loginData.cookie]);

    bookRes.body.data.books.forEach((b) => {
      expect(b).toMatchObject({
        id: expect.any(Number),
        name: expect.any(String),
        description: expect.any(String),
        genre: expect.any(String),
        author: expect.any(String),
        publisher: expect.any(String),
        language: {
          name: expect.any(String),
        },
      });
    });
  });

  test("should return content type json", async () => {
    const res = await request
      .get(`/v1/books/mybooks`)
      .set("Cookie", [loginData.cookie]);

    expect(res.headers["content-type"]).toEqual(
      expect.stringContaining("json")
    );
  });
  test("should return 404 if there are no books by that user", async () => {
    const loginDataLocal = {
      email: faker.internet.email("shreyas"),
      password: faker.internet.password(8),
      cookie: null,
    };
    const user2 = User.create({
      first_name: faker.name.firstName(8),
      last_name: faker.name.lastName(8),
      email: loginDataLocal.email,
      role: "INDIVIDUAL",
    });
    await user2.save();
    const auth2 = Auth.create({
      password: loginDataLocal.password,
      user: user2,
    });
    auth2.save();

    const authedUser2 = await request
      .post("/v1/user/login")
      .send({ email: loginDataLocal.email, password: loginDataLocal.password });

    const cookie = authedUser2.headers["set-cookie"][0];
    loginDataLocal.cookie = cookie;

    const res = await request
      .get(`/v1/books/mybooks`)
      .set("Cookie", [loginDataLocal.cookie]);

    expect(res.statusCode).toBe(404);
  });
});
