# SE-II---Main-Project

### Docker
A docker container has been provided for the first release so that it can be easily used by someone who
wants to run it having a different environment from the one used for deployment.
###### Pre-requirements
The Docker Desktop app must be installed and configured in the host machine
###### Build the network
Firstly, we need to build an internal network for the communication between SMTP server and our web application as follows:
```
docker network create --driver=bridge --subnet=192.168.10.0/24 --gateway=192.168.10.1 softengnetwork
```
###### Pull smtp4dev image
```
docker run -d --network softengnetwork --ip=192.168.10.2 -p 25:25/tcp -p 80:80/tcp -p 587:587/tcp -p 2525:2525/tcp rnwood/smtp4dev
```
###### Build a docker image
For building a docker image through the Dockerfile you need to run the following command inside the directory containing it:
```
docker build -t <DockerImageName> .
```
###### Run the container
For running the image in a container just run:
```
docker run -d --network softengnetwork --ip=192.168.10.3 -p 3001:3001/tcp -p 5173:5173/tcp -P <DockerImageName>
```
having defined, respectively, port 5173 for the react application on the client side and port 3001 for the server side. 
# THESIS MANAGEMENT

## LIKE A PROFESSOR

### My Proposals
I can see the list of my proposals both published and archived. I have also the possibility to edit them.

### Add Proposal
I can add a new proposal choosing possible cosupervisor from a list or adding them with the plus button.

### Application List
I can see the list of applications to my proposals. To accept or reject an application I have to click on the application itself.
It's also possible to download a student's CV to evaluate his application.

## LIKE A STUDENT

### Proposal List
I can see the list of proposals related to my course of study. Once I've clicked on a proposal I can apply for it with the apply button and upload a pdf of my CV.
### My Application
I can see the list of my applications and information about the linked proposal. The status of applications can be accepted (in green), pending (in yellow), rejected (in red) or canceled (in grey).
