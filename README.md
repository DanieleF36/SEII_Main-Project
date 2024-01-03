
# SE-II---Main-Project

## Table of Contents

1. [Docker Manual Run](#docker)
2. [Docker Compose](#docker-compose)
3. [Thesis Management Documentation](#thesis-management)
   1. [Professor side](#like-a-professor)
   2. [Student side](#like-a-student)



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
> or the other network must be deleted using `docker networm rm [network_name]`

For building the whole system run inside the root folder:
```docker-compose up -d```
this will start the building for the thesis management service and the email server.

##### Run the Thesis system's server
For building __only__ the Thesis system's server run inside the root folder:
```docker-compose -f docker-compose-server.yml up -d```
this will start the building for the thesis management server and the email server so the client side of the Thesis service is not going to be built.

### THESIS MANAGEMENT

#### LIKE A PROFESSOR

##### My Proposals
I can see the list of my proposals both published and archived using the switch button. I have also the possibility to edit them. And then we can see the proposals component, which four buttons: copy(blue), edit(yellow), archive(grey), and delete(red).

##### Add Proposal
I can add a new proposal choosing possible cosupervisor from a list or adding them with the plus button.

##### Application List
I can see the list of applications for my proposals. To accept or reject an application I have to click on the application itself.
It's also possible to download a student's CV to evaluate his application.

#### LIKE A STUDENT

##### Proposal List
I can see the list of proposals related to my course of study. Once I've clicked on a proposal I can apply for it with the apply button and upload a PDF of my CV.

##### My Application
I can see the list of my applications and information about the linked proposal. The status of applications can be accepted (in green), pending (in yellow), rejected (in red) or canceled (in grey). I can see my academic career and my CV linked to the application.

