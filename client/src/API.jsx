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

async function insertProposal(thesis) {
  const response = await fetch(URL + '/thesis', {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(thesis)
  })
  if (response.ok) {
    return response.map( item => ({
              title: item.title,
              supervisor: item.supervisor,
              keywords: item.keywords,
              type: item.type,
              groups: item.groups,
              description: item.description,
              knowledge: item.knowledge,
              note: item.note,
              expiration_date: item.expiration_date,
              level: item.level,
              cds: item.cds,
              status: item.status
          ,}));
  } else {
    throw response.msg;
  }
}

const API = {listApplication, insertProposal};

export default API;