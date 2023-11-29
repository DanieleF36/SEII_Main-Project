import { alignPropType } from "react-bootstrap/esm/types";

const URL = 'http://localhost:3001';

async function login(){
  window.location.assign(URL+"/login");
}

async function userAuthenticated(){
  const res = await fetch(URL+ `/session/current`,{credentials:'include'});
  const user = await res.json();
    console.log(user)
  if(res.ok){
    return user;
  }
  else{
    return {error: "Unauthorized"}
  }
}

async function logout(){
  window.location.assign(URL+"/logout", {credentials:'include'});
}

async function listApplication(id_professor) { 
    const response = await fetch(URL+ `/professor/${id_professor}/applications`,{credentials:'include'});
    const application = await response.json();
    if (response.ok) {
       return application.map((a) => ({
                id_application: a.id_application,
                id_student: a.id_student,
                id_thesis: a.id_thesis,
                data: a.data,
                path_cv: a.path_cv,
                status: a.status,
                title: a.title,
                name: a.name,
                surname: a.surname
            }));
    } else {
      throw application;  // mi aspetto che sia un oggetto json fornito dal server che contiene l'errore
    }
  }

function insertProposal(thesis) {
  
  thesis.status = 1;
  thesis.cosupervisor = thesis.cosupervisor === '' ? [''] : thesis.cosupervisor
  console.log(thesis)
  return getJson(fetch(URL + '/thesis', {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials:'include',
    body: JSON.stringify(thesis)

  })).then(json => {
    return json
  })

}

function updateProposal(id_thesis, thesis) {
  thesis.cds = Array.isArray(thesis.cds) ? thesis.cds : thesis.cds.split(',').map((k) =>k.trim());
  thesis.knowledge = Array.isArray(thesis.knowledge) ? thesis.knowledge : thesis.knowledge.split(',').map((k) =>k.trim());
  thesis.type = Array.isArray(thesis.type) ? thesis.type : thesis.type.split(',').map((k) =>k.trim());
  thesis.groups = Array.isArray(thesis.groups) ? thesis.groups : thesis.groups.split(',').map((k) =>k.trim());
  thesis.keywords = Array.isArray(thesis.keywords) ? thesis.keywords : thesis.keywords.split(',').map((k) =>k.trim());
  thesis.level = thesis.level === 1 ? "Master" : "Bachelor"
  thesis.cosupervisor = []
  console.log(thesis)

  return getJson(fetch(URL + `/thesis/${id_thesis}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: 'include',
    body: JSON.stringify(thesis)

  })).then(json => {
    return json
  })

}

function getJson(httpResponsePromise) {
  // server API always return JSON, in case of error the format is the following { error: <message> } 
  return new Promise((resolve, reject) => {
    httpResponsePromise
      .then((response) => {
        if (response.ok) {

          // the server always returns a JSON, even empty {}. Never null or non json, otherwise the method will fail
          response.json()
            .then(json => resolve(json))
            .catch(err => reject({ error: "Cannot parse server response" }))

        } else {
          // analyzing the cause of error
          response.json()
            .then(obj =>
              reject(obj)
            ) // error msg in the response body
            .catch(err => reject({ error: "Cannot parse server response" })) // something else
        }
      })
      .catch(err =>
        reject({ error: "Cannot communicate" })
      ) // connection error
  });
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
  const response = await fetch(URL+ur, {
    credentials:'include'
  });
  if(response.status==200){
    const res = await response.json();
    console.log(res.thesis);
    return [res.nPage, res.thesis.map((e)=>({
      id:e.id,
      title:e.title,
      supervisor:e.supervisor,
      cosupervisor:e.co_supervisor,
      keywords: e.keywords ,
      type:e.type ,
      groups:e.groups ,
      description:e.description ,
      know:e.knowledge ,
      note:e.note ,
      expDate:e.expiration_date ,
      level:e.level ,
      cds:e.cds ,
      creatDate:e.creation_date ,
      status:e.status, 
      nPage:e.nPage
    }))]
  }
  else {
    throw res;
  }
}

async function acceptApplication(status,id_professor,id_application) { 
  try {
    const response = await fetch(URL + `/professor/${id_professor}/applications/${id_application}`,{
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials:'include',
        body: JSON.stringify({status}),
    });
    //const responsedata = await response.json();
    if (response.ok) {
      return response.json();
    } else {
      const message = await response.text();
      throw new Error(message);
    }
  }catch (error) {
    throw new Error(error.message, { cause: error });
  }
}


async function applyForProposal(application) { 
    const formData = new FormData();
    formData.append('cv', application.cv);
    return getJson(fetch(URL+ `/thesis/${application.id_thesis}/applications`,{
        method: "POST",
        credentials: "include",
        body: formData
    })).then(json => {return json});
}

async function browserApplicationStudent(id_student) {
  try {
    const response = await fetch(URL + `/student/${id_student}/applications`, {credentials:'include'});
    const application = await response.json();
    if (response.ok) {
      return application.map((a) => ({
        id_application: a.id_application,
        title: a.title,
        supervisor_name: a.supervisor_name,
        supervisor_surname: a.supervisor_surname,
        status: a.status,
        type: a.type,
        groups: a.groups,
        description: a.description,
        knowledge: a.knowledge,
        note: a.note,
        level: a.level,
        keywords: a.keywords,
        expiration_date: a.expiration_date,
        cds: a.cds,
        path_cv: a.path_cv,
        application_data: a.application_data,
      }));
    } else {
      const message = await response.text();
      throw new Error(message);
    }
  } catch (error) {
    throw new Error(error.message, { cause: error });
  }
}

function browseProposal() {
  return getJson(fetch(URL + '/professor/thesis', {
    credentials:'include'
  }))
  .then(res => {
    return res
  })
}

// =================== Virtual clock API ===================

function vc_set(date) {
  console.log(date);
  return getJson(fetch(URL + '/testing/vc/set', {
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify({value: date})
    
    
  }))
  .then(res => {
    return res
  })
}

function vc_get() {
  return getJson(fetch(URL + '/testing/vc/get', {
    method: "GET"
  }))
  .then(res => {
    return res
  })
}


function vc_restore() {
  return getJson(fetch(URL + '/testing/vc/restore', {
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify({value: 1}) }))
  .then(res => {
    return res
  })
}
const API = { listApplication, insertProposal, advancedSearchThesis, updateProposal, acceptApplication, browserApplicationStudent, applyForProposal, browseProposal, vc_set, vc_restore, vc_get, userAuthenticated, login, logout };

export default API;