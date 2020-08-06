FROM ubuntu:18.04
LABEL maintainer="Aram Mine <aram.mine@gaiax.com>"

# install basic packages
RUN apt-get update
RUN apt-get -y upgrade
RUN apt-get install -y tzdata
# work arround of non intaractive install 
RUN apt-get update
RUN apt-get install -y sudo curl gnupg gnupg2 gnupg1 git build-essential software-properties-common openssh-server supervisor vim npm

# install go
RUN sudo add-apt-repository ppa:longsleep/golang-backports
RUN apt-get update
RUN apt-get install -y golang-go

# setup ssh
RUN mkdir /var/run/sshd
RUN echo 'root:root' | chpasswd
RUN sed -ri 's/^#?PermitRootLogin\s+.*/PermitRootLogin yes/' /etc/ssh/sshd_config
RUN sed -ri 's/^#?Port\s+.*/Port 222/' /etc/ssh/sshd_config

# SSH login fix. Otherwise user is kicked off after login
RUN sed 's@session\s*required\s*pam_loginuid.so@session optional pam_loginuid.so@g' -i /etc/pam.d/sshd

#ENV NOTVISIBLE "in users profile"
RUN echo "export VISIBLE=now" >> /etc/profile

# setup supervisrod
RUN mkdir /var/log/hornet
COPY child-nodes/supervisord.conf /etc/supervisor/conf.d/supervisord.conf

# install hornet
WORKDIR /app
RUN git clone https://github.com/gohornet/hornet.git
RUN cd hornet;./scripts/build_hornet.sh
COPY child-nodes/config.json /app/hornet/config.json
COPY docker/snapshot.csv /app/hornet/snapshot.csv

# setup test script
RUN git clone https://github.com/aramsan/iota-docker.git
RUN cd iota-docker/test_script; npm i

EXPOSE 8081 14265 14626 15600 222
CMD ["/usr/bin/supervisord"]
