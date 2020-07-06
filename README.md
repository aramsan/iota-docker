# iota-docker

Create multiple iota test nodes with docker.

# How to setup

## prepare base server

### Reuqured setting
- 2GB RAM
- A dual-core CPU
- SSD storage
- A public IP address
- Ports 222, 15600 and 14626 must be exposed to the Internet

### Recommended environment

- AWS EC2 t3.samll instance
- 30GB Disk space
- ubuntu 18.04 LTS operation system

### Setup Docker

- Install dokcer & docker compose

See the officail page of Dcoker.
https://docs.docker.com/engine/install/ubuntu/
https://docs.docker.com/compose/install/

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

Create SSH tunnel from your remote pc.

```
$ ssh -p 222 -N -L 8081:localhost:8081 [ec2-user]@[ec2-ipaddress]
```

Open a web browser on your remote pc and go to localhost:8081. If you can see the dashboard, then it works.
