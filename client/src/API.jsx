
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
    thesis.status=1;
    console.log( JSON.stringify(thesis))
  let response = await fetch(URL + '/thesis', {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(thesis)
  
  })
  

  if (response.ok) {
    console.log("ciao")
      let risposta = await response.json();
      console.log(risposta)

    
    return true;
    
  } else {
    console.log("ciao");
    console.log(response.error);
    throw response.error;
  }
}

async function advancedSearchThesis(params){
  let ur="/thesis?";
  if(params.page)
    ur+="page="+params.page;
  else
  ur+="page=1";
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

async function acceptApplication() { 
  const response = await fetch(URL+ `/professor/${id_professor}/applications/${id_application}`);
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

async function applyForProposal(application) { 
    const formData = new FormData();
    formData.append('cv', application.cv);
    const response = await fetch(URL+ `/thesis/${application.id_thesis}/applications`,{
        method: "POST",
        headers: {
        "Content-Type": "multipart/form-data",
        },
        body: formData
    });
    const app = await response.json();
    if (response.status==201) {
        return app.map((a) => ({
                id_student: a.id_student,
                id_thesis: a.id_thesis,
                data: a.data,
                path_cv: a.path_cv,
                status: a.status,
                id_teacher: a.id_teacher
            ,}));
    }
    else if(response.status==400 || response.status==404){
        return{error: app.error}
    }
}

const API = {listApplication, insertProposal, advancedSearchThesis, acceptApplication, applyForProposal};

export default API;