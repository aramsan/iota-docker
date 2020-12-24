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
- Open port 8081-8085, 14265, 15600, 14626 with securiy group

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
#### Individual Hornet node
- This is for cloud server.

```
$ cd iota-docker/hornet
$ docker-compse build
```

#### Individual child node
- This is for the edge server of IoT Device.
- Please prepare the IP Address of Hornet node.

```
$ cd iota-docker/node
$ export HORNETADDRESS=xx.xx.xx.xx
$ docker-compse build
```

#### All nodes on 1 instanse (1 hornet node and 4 nodes)

```
$ docker-compse build
```

### Start the instance

```
$ docker-compose up -d
```

### Check the node

- Open a web browser on your pc and go to the dash board url. 
- If you can see the dashboard, then it works.
- After that, check the sync status. If "Synced" is displayed, it is OK.
#### Individual Hornet node and child node
```
[IP Address]:8081
```

#### All nodes on 1 instanse (1 hornet node and 4 nodes)
```
Dashboard of hornet: localhost:8081
Dashboard of node1: localhost:8082
   ...
Dashboard of node4: localhost:8085
```
### SSH connection
#### Individual Hornet node
```
ssh root@localhost -p 222
```
- The password is 'root'.

#### Individual child node
- This is for the edge server.
```
ssh root@localhost -p 222
```
- The password is 'root'.

#### All nodes on 1 instanse (1 hornet node and 4 nodes)
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
ssh root@localhost -p 222
    ...
cd /app/iota-docker/scripts/test_scripts
npm run test
```

- See the visualizer on http://[IP Address]:8081:/visalizer with browser on host PC. 
- If AWS EC2 is used, then see the visualizer on http://ec2-xxx-xxx-xxx-xxx.region-region-xx.compute.amazonaws.com:8081 with browser on own PC.


