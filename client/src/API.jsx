import dayjs from "dayjs";
import { title } from "process";

const URL = 'http://localhost:3001';

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

async function advancedResearchThesis(params){
  let ur="/thesis?";
  Object.entries(params).forEach(([key, value], index, a) => {
    if(!(value instanceof Array))
      if(index!=a.length-1)
        ur+=key+"="+value+"&";
      else
      ur+=key+"="+value;
    else
      value.forEach((e, i, array)=>{
        if(i!=array.length-1)
          ur+=key+"="+e+"&";
        else
          ur+=key+"="+e;  
      });
  });
  const response = await fetch(URL+ur);
  if(response.status==200){
    const res = await response.json();

    return [res[0], res[1].map((e)=>({
      id:e.id,
      title:e.title,
      supervisor:e.supervisor,
      co_supervisor:e.co_supervisor,
      keyword:e.keyword ,
      type:e.type ,
      groups:e.groups ,
      description:e.description ,
      knowledge:e.knowledge ,
      note:e.note ,
      expiration_date:e.expiration_date ,
      level:e.level ,
      cds:e.cds ,
      creation_date:e.creation_date ,
      status:e.status, 
      nPage:e.nPage
    }))]
  }
  else{
    throw res;
  }
}

const API = {listApplication, insertProposal, advancedResearchThesis};

export default API;