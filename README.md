
# SE-II---Main-Project Group 14 
# THESIS MANAGEMENT

## Table of Contents

1. [Docker Manual Run](#docker)
2. [Docker Compose](#docker-compose)
3. [Client](#client)
4. [API Server](#api_server)
5. [Database Tables](#database-tables)
6. [Users credentials](#users-credentials)


### Docker
A docker container has been provided for the first release so that it can be easily used by someone who
wants to run it having a different environment from the one used for deployment.
##### Pre-requirements
The Docker Desktop app must be installed and configured in the host machine
##### Build the network
Firstly, we need to build an internal network for the communication between the SMTP server and our web application as follows:
```
docker network create --driver=bridge --subnet=192.168.10.0/24 --gateway=192.168.10.1 softengnetwork
```
##### Pull smtp4dev image
```
docker run -d --network softengnetwork --ip=192.168.10.2 -p 25:25/tcp -p 80:80/tcp -p 587:587/tcp -p 2525:2525/tcp rnwood/smtp4dev
```
##### Build a docker image
For building a docker image through the Dockerfile you need to run the following command inside the directory containing it:
```
docker build -t <DockerImageName> .
```
##### Run the container
For running the image in a container just run:
```
docker run -d --network softengnetwork --ip=192.168.10.3 -p 3001:3001/tcp -p 5173:5173/tcp -P <DockerImageName>
```
having defined, respectively, port 5173 for the react application on the client side and port 3001 for the server side. 


### Docker Compose
For this release, a docker-compose.yml file has been provided where you define the configuration for your application. It includes details about the services our app requires. In this case, we run two different containers for the web server and the mail server and as we did for the manual run of the service, we are going to use the rnwood/smtp4dev image. In addition, there is also the option for building just the backend of the Thesis system. 
> NOTE
> Data are not persistet

##### Pre-requirements
For this scenario _docker-compose_ tool __MUST__ be already installed, check through
```docker-compose -v```
otherwise [install](https://docs.docker.com/compose/install/).

##### Run the whole system
> NOTE
> An internal network is going to be created with the name `seii_main-project_softengnetwork`
> having the following configuration:
> - subnet=192.168.10.0/24
> - gateway=192.168.10.1
> If another network exists with the same configuration, these parameters should be changed inside the [Docker compose yml file](./docker-compose.yml)
> or the other network must be deleted using `docker network rm [network_name]`

For building the whole system run inside the root folder:
```docker-compose up -d```
this will start the building for the thesis management service and the email server.

##### Run the Thesis system's server
For building __only__ the Thesis system's server run inside the root folder:
```docker-compose -f docker-compose-server.yml up -d```
this will start the building for the thesis management server and the email server so the client side of the Thesis service is not going to be built.

## CLIENT
### Description of application sections

#### LIKE A PROFESSOR

##### My Proposals
I can see the list of my proposals both published and archived using the switch button. I have also the possibility to edit them. And then we can see the proposals component, which four buttons: copy(blue), edit(yellow), archive(grey), and delete(red).

##### Add Proposal
I can add a new proposal choosing possible cosupervisor from a list or adding them with the plus button.

##### Application List
I can see the list of applications for my proposals. To accept or reject an application I have to click on the application itself.
It's also possible to download a student's CV to evaluate his application.

##### Proposal Requests
I can see the list of request that students have sent to me. I can accept them, reject them or ask for some changes if I do not agree with the description provided by the students

#### LIKE A STUDENT

##### Proposal List
I can see the list of proposals related to my course of study. Once I've clicked on a proposal I can apply for it with the apply button and upload a PDF of my CV.

##### Add Request
I can send a new request of thesis to a professor. I have to add his email and if I need I can add the emails of other cosupervisor. For a valid request I must write a description about the thesis that I want to propose 

##### My Application
I can see the list of my applications and information about the linked proposal. The status of applications can be accepted (in green), pending (in yellow), rejected (in red) or canceled (in grey). I can see my academic career and my CV linked to the application.

#### LIKE A SECRETARY

##### Request From Student
I can see the list of the students' request. I can accept or reject them. Once I have accepted a new thesis request, I automatically send an email and the request to the relevant professor. 

### React Client Application Routes

- Route `/`: welcome page with the login button
- Route `/home`: different homepages for each type of user

## API_SERVER

### Autenticazione
- GET `/login`
- POST `/login/callback`: double api to login with an external identity provider
- GET `/logout`
- POST `/logout/callback`: double api to logout with an external identity provider
- GET `/session/current`: return user info

### Virtual clock

- POST `/testing/vc/restore` : unauthenticated, restore the virtual clock
- GET `/testing/vc/get` : unauthenticated, return the virtual clock
- POST `/testing/vc/set` : unauthenticated, set the virtual clock

### Thesis

- GET `/thesis` : authenticated, list of available thesis for student 
- POST `/thesis` : authenticated, professor add new thesis
- PUT `/thesis/:id` : authenticated, professor modify an existing thesis
- DELETE `/thesis/:id` : authenticated, professor delete a thesis
- POST `/thesis/:id_thesis/applications` : authenticated, student apply for a proposal

### Application
- GET `/applications` : authenticated, list of available thesis for student 
- PUT `/applications/:id_application` : authenticated, professor accept or reject an application for a thesis
- GET `/applications/student_cv/:student_id` : authenticated, return a student cv
- GET `/applications/career/:student_id` : authenticated, return a student career

### Other
- GET `/cosupervisors/email` : authenticated, list of cosupervisors emails
- GET `/supervisors/email` : authenticated, list of supervisors emails 
- PUT `/thesis/secretary/:student_id` : authenticated, secretary handles student request
- GET `/requests` : authenticated, list of request for the professor
- GET `/requests/all` : authenticated, list of request for the secretary clerk
- PUT `/requests/professor` : authenticated, professor handles student request
- POST `/requests` : authenticated, student add new request



## Database Tables
###  *Application*
    This table represents the application of student at one thesis, with all the information needed
- id integer ***primary key***
- id_student integer ***not null***, ***foreign key***
- id_thesis integer ***not null***, ***foreign key***
    - is added to simplify queries
- id_teacher integer ***not null***, ***foreign key***
- data string 
    - format: YYYY-MM-DD
- path_cv string
    - where on file system is saved
- status integer ***not null***
    - say if the application is in a state of:
        - pending: 0
        - accepted: 1
        - rejected: 2
        - cancelled: 3
    
### *Career*
    This table represents one passed exem for that student
- idauto integer ***primary key***
- id integer ***foreign key***
- cod_course integer ***not null***
- title_course integer ***not null***
- cfu integer ***not null***
- grade integer ***not null***
    - it has to be greater equal 18 and lower or equal 31
        - 31 is equal to 30L
- date string ***not null***
    - format: YYYY-MM-DD

### *CoSupervisor*
    This table represents all external cosupervisors
- id integer ***primary key***
- email string ***unique***
- name string
- surname string
- company string

### *CoSupervisorRequest*
    This table represents the relationship between request and cosupervisor.
- id integer ***primary key***
- id_request integer ***not null***, ***foreign key***
- id_cosupervisor integer ***foreign key***

### *CoSupervisorThesis*
    This table represents the relationship between thesis and cosupervisor.
    One between id_cosupervisor and id_teacher has to be null because one row of this table rapresent one co-supervisor for that thesis, so if id_teacher is not null means that co supervisor is internal, in the other case is external
- id integer ***primary key***
- id_thesis integer ***not null***, ***foreign key***
- id_cosupervisor integer ***foreign key***
- id_teacher integer ***foreign key***

### *Degree*
- id integer ***primary key***
- code integer ***not null*** ***unique***
    - it is like LM-32
- title string ***not null*** ***unique***

### *Secretary*
- id integer ***primary key***
- email string ***unique***
- name string
- surname string

### *Student*
- id integer ***primary key***
- email string ***unique***
- name string
- surname string
- gender integr
    - male: 0
    - female: 1
- nationality string
- cod_degree integer ***not null***, ***foreign key***
- enrol_year integr ***not null***

### *Teacher*
- id integer ***primary key***
- email string ***unique***
- name string
- surname string
- code_group integer ***not null***
- cod_dep integer ***not null***

### *Thesis*
    Replication are permitted
    This table represents thesis proposals 
- id integer ***primary key***
- title string
- supervisor integer ***not null***, ***foreign key(teacher.id)***
- keywords array of strings
- type array of strings ***not null***
- groups array of strings ***not null***
- description string
- knowledge array of strings
- note string
- expiration_date string ***not null***
    - format: YYYY-MM-DD
- level integer ***not null***
    - Bachelor: 0
    - Master: 1
- cds string ***not null***
- creation_date string
    - format: YYYY-MM-DD
- status integer ***not null***
    - Archived: 0
    - Public: 1

### *Request*
    This table represents list of request
- id integer ***primary key***
- studentId integer ***not null***, ***foreign key(student.id)***
- supervisorId integer ***not null***, ***foreign key(teacher.id)***
- description string
- statusS integer ***not null***
    - Pending: 0
    - Accepted: 1
    - Rejected: 2
- statusT integer ***not null***
    - Pending: 0
    - Accepted: 1
    - Rejected: 2


## Users Credentials

### Students
- Rossi Giovanni, giovanni.rossi@studenti.polito.it, Password12345
- Altobelli Gianni, gianni.altobelli@studenti.polito.it, Password1234
- Sculli Giuseppe, giuseppe.sculli@studenti.polito.it, Password1234

### Professors
- Azzurro Luca, luca.azzurro@studenti.polito.it, Password1234
- Lucca Francesco, francesco.lucca@studenti.polito.it, Password1234

### Secretaries
- Bianchi Andrea, andrea.bianchi@secretary.polito.it, Password1234
