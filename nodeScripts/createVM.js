

export async function createVm(res, compute, vmName, type) {
  // Create a new VM using the latest OS image of your choice.
  try {
    const zone = compute.zone('us-central1-c');

    // const vmName = 'all-as-code-instance';
    const config = {
      os: 'ubuntu',
      //machineType: 'g1-small',
      machineType: type,
      https: true,
      http: true,
      metadata: {
        items: [
          /**
          {
            key: 'startup-script',
            value: `
              #! /bin/bash
              wget -q -O - https://pkg.jenkins.io/debian-stable/jenkins.io.key | sudo apt-key add -
              sudo sh -c 'echo deb https://pkg.jenkins.io/debian-stable binary/ > \
              /etc/apt/sources.list.d/jenkins.list'
              sudo apt-get update
              sudo apt-get install -y jenkins
              sudo apt update
              sudo apt install -y openjdk-8-jdk
              sudo systemctl start jenkins
            `
          },
          */
          {
            key: 'startup-script',
            value: `
              #! /bin/bash
              sudo apt-get update
              sudo apt-get install -y apt-transport-https ca-certificates curl gnupg-agent software-properties-common
              wget -q -O - https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -
              sudo add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable"
              sudo apt-get update
              sudo apt-get install -y docker-ce docker-ce-cli containerd.io

              sudo docker network create jenkins
              sudo docker volume create jenkins-docker-certs
              sudo docker volume create jenkins-data
              sudo docker container run --name jenkins-docker --rm --detach --privileged --network jenkins --network-alias docker --env DOCKER_TLS_CERTDIR=/certs --volume jenkins-docker-certs:/certs/client --volume jenkins-data:/var/jenkins_home --publish 2376:2376 docker:dind

              sudo mkdir /home/all-as-code-files
              echo "
                configuration-as-code:1.43
                job-dsl:1.77
              " > /home/all-as-code-files/plugins.txt
              echo -e "
                FROM jenkinsci/blueocean \n
                COPY plugins.txt /usr/share/jenkins/ref/plugins.txt \n
                ENV JAVA_OPTS ${`"`}-Djenkins.install.runSetupWizard=false ${"${JAVA_OPTS:-}"}${`"`} \n
                ENV CASC_JENKINS_CONFIG https://raw.githubusercontent.com/nistalhelmuth/all-as-code/master/jenkins.yaml \n
                RUN /usr/local/bin/install-plugins.sh < /usr/share/jenkins/ref/plugins.txt
                EXPOSE 80
                EXPOSE 8080
              " > /home/all-as-code-files/Dockerfile
              
              
              sudo docker build -t custom-docker:1.0 /home/all-as-code-files/
              sudo docker container run --name jenkins-blueocean --rm --detach --network jenkins --env DOCKER_HOST=tcp://docker:2376 --env DOCKER_CERT_PATH=/certs/client --env DOCKER_TLS_VERIFY=1 --publish 8080:8080 --publish 80:80 --volume jenkins-data:/var/jenkins_home --volume jenkins-docker-certs:/certs/client:ro custom-docker:1.0 
            `
          },
        ]
      },
      
      //Firewall
      tags: ['jenkins']
    }

    
    console.log(`Creating VM ${vmName}...`);
    const vm = zone.vm(vmName);
    const [vm, operation, apiResponse] = await vm.create(config);
    //const [vm, operation, apiResponse] = await zone.createVM(vmName, config);

    console.log(`Polling operation ${operation.id}...`);
    //console.log('Virtual machine created!', vm);
    await operation.promise();
    //console.log('Virtual machine running!', apiResponse.networkInterfaces);

    console.log('Acquiring VM metadata...');
    const [metadata] = await vm.getMetadata();
    // External IP of the VM.
    const ip = metadata.networkInterfaces[0].accessConfigs[0].natIP;
    console.log(`Booting new VM with IP http://${ip}...`);

    // Ping the VM to determine when the HTTP server is ready.
    console.log('Operation complete. Waiting for IP');
    //await pingVM(ip);

    console.log(`\n${vmName} created succesfully`);
    res.status(200).send({
        id: vm.metadata.id,
        dateCreated: vm.metadata.creationTimestamp,
        name: vm.metadata.name,
        diskSize: vm.metadata.disks[0].diskSizeGb,
        publicIp: vm.metadata.networkInterfaces[0].accessConfigs[0].natIP,
    });
  } catch (err) {
    console.error('ERROR:', err);
    res.status(400).send({
      error: err.message
    });
  }
}

async function pingVM(ip) {
  let exit = false;
  while (!exit) {
    await new Promise(r => setTimeout(r, 2000));
    try {
      const res = await fetch(`http://${ip}:8080`);
      console.log(res)
      if (res.status !== 200) {
        throw new Error(res.status);
      }
      exit = true;
    } catch (err) {
      process.stdout.write('.');
    }
  }
}

// quickstart();