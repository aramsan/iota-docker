# IOTA-docker

Build multiple IOTA test nodes with docker.
Sample codes for hashed camera data are included.

# How to setup
## For development evironmenet

This information is for a development environmenet. It is assumed PC or virtual machine.

### Reuquired specification
- 8GB or upper RAM
- A dual-core or upper CPU
- Ubuntu 18.04, MacOS X or Later

### Setup Docker
- Install dokcer & docker compose.
    - See the officail page of Dcoker.
        - https://docs.docker.com/engine/install/
        - https://docs.docker.com/compose/install/

### Install node.js and npm

```
$ sudo apt install nodejs npm
```

node 8.10.0 or later is requeired. Please check the version.

```
$ node -v
```

### Setup Docker Instanse 

```
$ git clone https://github.com/aramsan/iota-docker/
$ cd iota-docker
$ docker-compose build
```

### Start Up Blockchain

```
$ dcoker-compose -up d
```

### How to Test

#### Check the dashboad
- Open a web browser on your pc and go to the dashboard url(localhost:8081).
- If you can see the dashboard, then it works.
- After that, check the sync status. If "Synced" is displayed, it is OK.

#### Check the writing function

```
$ cd iota-docker/scripts
$ npm install
$ npm run test
```

- Open a web browser on your pc and go to the dashboard url(localhost:8081).
- Opne the Visualiyzer on blowser,
- If some blocks are added every second, it is OK.

## For Edge Server and Cloud server

This information is for IoT Edge Server and Cloud Server.

### Required AWS EC2 Setteing for Cloud server
- 8GB or upper RAM
- A quad-core or upper CPU
   - The t3.xlarge is enogh to meet the reuqriements.
- Open port 8081, 14265, 15600, 14626 with securiy group
- Ubuntu 18.04 LTS

### Setup Docker
- Install dokcer & docker compose.
    - See the officail page of Dcoker.
        - https://docs.docker.com/engine/install/
        - https://docs.docker.com/compose/install/

### Install node.js and npm

```
$ sudo apt install nodejs npm
```

node 8.10.0 or later is requeired. Please check the vession.

```
$ node -v
```

#### Build individual Hornet node
- This is assumed a cloud server.
- Enter the EC2 instanse of Hornet node.
- Execute commands in below.

```
$ git clone https://github.com/aramsan/iota-docker/
$ cd iota-docker/hornet
$ docker-compose build
$ docker-compose up -d
```

#### Build individual Child node
- This is for the edge server of IoT Device.
- Prepare the IP Address of Hornet node.

```
$ sudo apt install node npm
$ git clone https://github.com/aramsan/iota-docker/
$ cd iota-docker/node
$ export HORNETADDRESS=xx.xx.xx.xx(IP Address of Hornet node)
$ docker-compse build
$ docker-compose up -d
```

#### Check the dashboad
- Open a web browser on your pc and go to the dashboard url([IP_ADDRESS]:8081).
    - Please check the all nodes.
- If you can see the dashboard, then it works.
- After that, check the sync status. If "Synced" is displayed, it is OK.

#### Check the writing function

- Enter the child node via SSH.
- Execute commands in below.

```
$ cd iota-docker/scripts
$ npm run test
```

- Open a web browser on your pc and go to the dashboard url([IP_ADDRESS]:8081).
- Opne the Visualiyzer on blowser,
- If some blocks are added every second, it is OK.
- If some problems occur, please check the internal of dokcer instanse.

```
ssh root@localhost -p 222
    ...
cd /app/iota-docker/scripts/test_scripts
npm run test
```

# How to Use the sample code

## API

- The child node(on the edge server) has an interface of witring to bloackchain.
- API
    - http://localhost:4001/api/set
    - POST Method
    - JSON body is in below

```
{
    "camera_id": num,
    frame_number": num,
    "hash": sha256,
    "execute": any,
}
```

- Parameters
    -  camera_id
        - This is cammera ID number.
    - frame_number
        - This is a current frame number
    - hash
        - This is stack hashed camera data.
        - Hash algorithm is sha256.
    -  previous_stansaction_hash
        - This is previous transaction's hash.
    - execute
        - This is flag of execution.
        - If this parameter exists, writing function to blockchain is executed.
       
- About hash
    - This is hashed camera raw data.
    - 3 frames example
        1. Create hash of first frame from raw image data.
        2. Add the previous transaction hash and first hash. - (A)
        3. Create hash of sececond frame.
        4. Add (A) and second hash. -(B)
        5. Hash (B). - (C)
        6. Create hash of third frame.
        7. Add (C) to third hash. - (D)
        8. (D) is final hash. This hash will store the blockchain.

# Appendix
## How to SSH connection

### Individual Hornet node
```
ssh root@localhost -p 222
```
- The password is 'root'.

### Individual child node
- This is for the edge server.
```
ssh root@localhost -p 222
```
- The password is 'root'.

### All nodes on 1 instanse (1 hornet node and 4 nodes)
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

## Log file

### Log file of blockchain
- /var/log/hornet/hornet.log

### Log file of API server
- /var/log/hornet/script.log


