const request = require("supertest");
const studentService = require("../../services/StudentService");
const applicationRepository = require('../../repositories/ApplicationRepository')

beforeEach(() => {
  jest.clearAllMocks();
});

describe('browserApplicationStudent', () => {
  const applications = {
    id_application: 1,
    title: 'a thesis title',
    supervisor_name: 'Luca',
    supervisor_surname: 'Azzurro',
    status: 1,
    type: 'Abroad',
    groups: 'group1',
    description: 'none',
    knowledge: 'none',
    note: 'none',
    level: 1,
    keywords: 'softeng',
    expiration_date: '2024-10-10',
    cds: 'ingInf',
    path_cv: './path/to/the/file',
    application_data: '2023-10-10'
  }

  const mockIdStudent = 1;
  test('case1: success', async () => {
    jest.spyOn(applicationRepository, "getByStudentId").mockResolvedValue(applications)

    const mockRes = await studentService.browserApplicationStudent(mockIdStudent);
    expect(mockRes).toBe(applications);
  })

  test('case2: error', async () => {
    jest.spyOn(applicationRepository, "getByStudentId").mockRejectedValue({ error: 'error in DB' })

    try {
      await studentService.browserApplicationStudent(mockIdStudent);
    }
    catch (error) {
      expect(error).toEqual({ error: "error in DB" });

    }
  })
})