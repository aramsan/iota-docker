FROM ubuntu:18.04
LABEL maintainer="Aram Mine <aram.mine@gaiax.com>"

# install basic packages
RUN apt update
RUN apt -y upgrade
RUN apt install -y sudo curl gnupg gnupg2 gnupg1 git build-essential software-properties-common openssh-server supervisor

# install go
RUN sudo add-apt-repository ppa:longsleep/golang-backports
RUN apt update
RUN apt install -y golang-go

# setup ssh
RUN mkdir /var/run/sshd
RUN echo 'root:root' | chpasswd
RUN sed -ri 's/^#?PermitRootLogin\s+.*/PermitRootLogin yes/' /etc/ssh/sshd_config

# SSH login fix. Otherwise user is kicked off after login
RUN sed 's@session\s*required\s*pam_loginuid.so@session optional pam_loginuid.so@g' -i /etc/pam.d/sshd

#ENV NOTVISIBLE "in users profile"
RUN echo "export VISIBLE=now" >> /etc/profile

# setup supervisrod
RUN mkdir /var/log/supervisor/hornet
COPY docker/supervisord.conf /etc/supervisor/conf.d/supervisord.conf

# install hornet
WORKDIR /app
RUN git clone https://github.com/gohornet/hornet.git
RUN cd hornet;./scripts/build_hornet.sh

EXPOSE 8081 14626 15600 22
CMD ["/usr/bin/supervisord"]
