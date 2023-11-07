import dayjs from "dayjs";

const URL = 'http://localhost:3001/api';

async function listApplication() { 
    const response = await fetch(URL+ `/professor/${id_professor}/applications`);
    const application = await response.json();
    if (response.ok) {
      return application.map((a) => ({
                id_student: a.id_student,
                id_thesis: a.id_thesis,
                data: a.data,
                path_cv: a.path_cv,
                status: a.status,
                id_teacher: a.id_teacher
            ,}));
    } else {
      throw services;  // mi aspetto che sia un oggetto json fornito dal server che contiene l'errore
    }
  }

const API = {listApplication};

export default API;