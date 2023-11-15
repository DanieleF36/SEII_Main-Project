import { alignPropType } from "react-bootstrap/esm/types";

const URL = 'http://localhost:3001';

async function listApplication(id_professor) { 
    const response = await fetch(URL+ `/professor/${id_professor}/applications`);
    const application = await response.json();
    if (response.ok) {
       return application.map((a) => ({
                id_application: a.id_application,
                id_student: a.id_student,
                id_thesis: a.id_thesis,
                data: a.data,
                path_cv: a.path_cv,
                status: a.status,
            }));
    } else {
      throw services;  // mi aspetto che sia un oggetto json fornito dal server che contiene l'errore
    }
  }

async function insertProposal(thesis) {
    thesis.status = 1;
    thesis.cosupervisor = thesis.cosupervisor === '' ? [''] : thesis.cosupervisor
  let response = await fetch(URL + '/thesis', {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(thesis)
  
  })
  let risposta = await response.json();
  if (response.ok) {
    return true;
  } else {
    throw response.error;
  }
}

async function advancedSearchThesis(params){
  let ur="/thesis?";
  if(params.page && params.page !== "")
    ur+="page="+params.page;
  else
  ur+="page=1";
  if(params.title && params.title !== ""){
    //console.log("API title "+params.title);
    ur+="&title="+params.title;
  }
  if(params.supervisor && params.supervisor != "")
    ur+="&supervisor="+params.supervisor;
  if(params.cosupervisor && params.cosupervisor != "")
    params.cosupervisor.forEach((e, i, a)=>{
      ur+="&coSupervisor="+a[i];
  });
  if(params.expDate && params.expDate != "")
    ur+="&expiration_date="+params.expDate;
  if(params.keywords && params.keywords != "")
    params.keywords.forEach((e, i, a)=>{
      ur+="&keyword="+a[i];
  });
  if(params.type && params.type != "")
    params.type.forEach((e, i, a)=>{
      ur+="&type="+a[i];
  });
  if(params.groups && params.groups != "")
    ur+="&groups="+params.groups;
  if(params.know && params.know != "")
    ur+="&knowledge="+params.know;
  if(params.cds && params.cds != "")
    ur+="&cds="+params.cds;
  if(params.creatDate && params.creatDate != "")
    ur+="&creation_date="+params.creatDate;
  if(params.orderby && params.orderby != ""){
    switch(params.orderby){
      case "expDate": ur+="&order=expiration_date"+params.order;break;
      case "title": ur+="&order=title"+params.order;break;
      case "supervisor": ur+="&order=supervisor"+params.order;break;
    }
  }
  const response = await fetch(URL+ur);
  if(response.status==200){
    const res = await response.json();
    return [res.nPage, res.thesis.map((e)=>({
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

async function acceptApplication(status,id_professor,id_application) { 
  const response = await fetch(URL+ `/professor/${id_professor}/applications/${id_application}`,{
                        method: "PUT",

                        body: status});              
  const application = await response.json();
  if (response.ok) {
    //console.log("ciao");
    //console.log(application);
    return application;/*application.map((a) => ({
              id_student: a.id_student,
              id_thesis: a.id_thesis,
              data: a.data,
              path_cv: a.path_cv,
              status: a.status,
              id_teacher: a.id_teacher
          ,}));*/
  } else {
    throw services;  // mi aspetto che sia un oggetto json fornito dal server che contiene l'errore
  }
}

async function applyForProposal(application) { 
    const formData = new FormData();
    formData.append('cv', application.cv);
    const response = await fetch(URL+ `/thesis/${application.id_thesis}/applications`,{
        method: "POST",
        body: formData
    });
    console.log("Prima")
    console.log(response);
    const app = await response.json();
    console.log("dopo")
    if (response.status==201) {
        return true;
    }
    else if(response.status==400 || response.status==404){
        return{error: app.error}
    }
}

const API = {listApplication, insertProposal, advancedSearchThesis, acceptApplication, applyForProposal};

export default API;