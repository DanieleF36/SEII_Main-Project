const request = require("supertest");
const index_app = require("../index");
const controller = require("../controllers/ThesisController");

describe("/api/thesis", () => {
  test("U1: Missing body", (done) => {
    request(index_app)
      .post(`/thesis`)
      .then((response) => {
        expect(response.status).toBe(400);
        expect(response.error).toBeDefined();
        done();
      })
      .catch((err) => done(err));
  });

  test("U2: Supervisor is missing", (done) => {
    request(index_app)
      .post(`/thesis`)
      .send({ expiration_date: "2052-1-1", level: 1, status: 1 })
      .then((response) => {
        expect(response.status).toBe(400);
        expect(response.error).toBeDefined();
        done();
      })
      .catch((err) => done(err));
  });

  test("U3: Expiration date is missing", async () => {
    request(index_app)
      .post(`/thesis`)
      .send({ supervisor: "Pippo", level: 1, status: 1 })
      .then((response) => {
        expect(response.status).toBe(400);
        expect(response.error).toBeDefined();
        done();
      })
      .catch((err) => done(err));
  });

  test("U4: Level value is not recognized", async () => {
    request(index_app)
      .post(`/thesis`)
      .send({ expiration_date: "2052-1-1", supervisor: "Pippo", status: 1 })
      .then((response) => {
        expect(response.status).toBe(400);
        expect(response.error).toBeDefined();
        done();
      })
      .catch((err) => done(err));
  });

  test("U5: Status value is not recognized or allowed", async () => {
    request(index_app)
      .post(`/thesis`)
      .send({ expiration_date: "2052-1-1", level: 1, supervisor: "Pippo" })
      .then((response) => {
        expect(response.status).toBe(400);
        expect(response.error).toBeDefined();
        done();
      })
      .catch((err) => done(err));
  });

  test("U5: New thesis proposal is inserted correctly", async () => {
    const test_thesis = [
      {
        title: "prova",
        supervisor: "Pippo",
        keywords: "prima prova",
        type: "sperimentale",
        groups: "back-end",
        description: "test tesi",
        knowledge: "test knowledge",
        note: "test note",
        expiration_date: "2053-1-1",
        level: 1,
        cds: "test cds",
        creation_date: "2050-1-1",
        status: 0,
      },
    ];
    jest.spyOn(controller, "addThesis").mockImplementation(() => {
      return test_thesis;
    });
    request(index_app)
      .post(`/thesis`)
      .send({
        expiration_date: "2052-1-1",
        level: 1,
        status: 0,
        supervisor: "Pippo",
      })
      .then((response) => {
        expect(response.status).toBe(201);
        done();
      })
      .catch((err) => done(err));
  });
});
