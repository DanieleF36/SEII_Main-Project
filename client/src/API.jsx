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

async function advancedSearchThesis(params){
  let ur="/thesis";
  if(params)
    ur+="?";
    if(params.page)
    ur+="page="+params.page;
  if(params.title)
    ur+="&title="+params.title;
  if(params.supervisor)
    ur+="&supervisor="+params.supervisor;
  if(params.cosupervisor)
    params.cosupervisor.forEach((e, i, a)=>{
      ur+="&coSupervisor="+a[i];
  });
  if(params.expDate)
    ur+="&expiration_date="+params.expDate;
  if(params.keywords)
    params.keywords.forEach((e, i, a)=>{
      ur+="&keyword="+a[i];
  });
  if(params.type)
    if(params.type)
    params.type.forEach((e, i, a)=>{
      ur+="&type="+a[i];
  });
  if(params.groups)
    ur+="&groups="+params.groups;
  if(params.know)
    ur+="&knowledge="+params.know;
  if(params.cds)
    ur+="&cds="+params.cds;
  if(params.creatDate)
    ur+="&creation_date="+params.creatDate;
  if(params.ordeBy)
    switch(ordeBy){
      case "expDate": ur+="&order=expiration_date"+params.order;break;
      case "title": ur+="&order=title"+params.order;break;
      case "supervisor": ur+="&order=supervisor"+params.order;break;
    }
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