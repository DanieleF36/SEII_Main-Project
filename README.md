# SE-II---Main-Project

### Docker
A docker container has been provided for the first release so that it can be easily used by someone who
wants to run it having a different environment from the one used for deployment.
###### Pre-requirements
The Docker Desktop app must be installed and configured in the host machine
###### Build a docker image
For building a docker image through the Dockerfile you need to run the following command inside the directory containing it:
```
docker build -t <DockerImageName> .
```
###### Run the container
For running the image in a container just run:
```
docker run -p 5173:5173 -p 3001:3001 <DockerImageName>
```
having defined, respectively, port 5173 for the react application on the client side and port 3001 for the server side. 