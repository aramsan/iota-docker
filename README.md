# iota-docker

Create multiple iota test nodes with docker.

# How to setup

## prepare base server

### Reuqured specification
- 8GB or upper RAM
- A dual-core CPU

### Setup Docker

- Install dokcer & docker compose

See the officail page of Dcoker.
https://docs.docker.com/engine/install/
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

Open a web browser on your host pc and go to localhost:8081. If you can see the dashboard, then it works.
Dashboard of node1: localhost:8082
   ...
Dashboard of node4: localhost:8085

# How to Test

Change current directory to test_script and run the test script.

```
$ cd test_srcript
$ yarn test
```

See the visualizer on http://localhost:8081:/visalizer with browser on host PC.


