# iota-docker

Create multiple iota test nodes with docker.

# How to setup

## prepare base server

### Reuquired specification
- 8GB or upper RAM
- A quad-core or upper CPU

### Required AWS EC2 Setteing
- 8GB or upper RAM
- A quad-core or upper CPU
   - The t3.xlarge is enogh to meet the reuqriements.
- Open 8081-8084 port with securiy group

### Setup Docker

- Install dokcer & docker compose

- See the officail page of Dcoker.
    - https://docs.docker.com/engine/install/
    - https://docs.docker.com/compose/install/

## Start Iota Docker Container

### Clone from github

```
$ git clone https://github.com/aramsan/iota-docker/
```

### Build the docker Image

```
$ docker-compse build
```

### Start the instance

```
$ docker-compose up -d
```

### Check the node

- Open a web browser on your host pc and go to localhost:8081. 
- If you can see the dashboard, then it works.
```
Dashboard of node1: localhost:8082
   ...
Dashboard of node4: localhost:8085
```
### SSH connection

- hornet node
```
ssh root@localhost -p 2222
```
- The password is 'root'.

- child nodes
```
ssh root@localhost -p 2223
    ...
ssh root@localhost -p 2225
```
- The password is 'root'.


# How to Test

- Enter the child node via SSH. Then execute test scirpt.
```
ssh root@localhost -p 2223
    ...
cd /app/iota-docker/scripts/test_scripts
yarn test
```

- See the visualizer on http://localhost:8081:/visalizer with browser on host PC. 
- If AWS EC2 is used, then see the visualizer on http://ec2-xxx-xxx-xxx-xxx.region-region-xx.compute.amazonaws.com with browser on own PC.


