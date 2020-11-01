const express = require("express");
const app = express();
const Compute = require('@google-cloud/compute');

const compute = new Compute({
  projectId: 'resounding-net-275021',
  keyFilename: '/Users/hanu/Documents/uvg/Semestre 2/Alhvi/all-as-code/Donaciones-74d2fd390d85.json',
});

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.get("/vms", function(req, res) {
  async function listVms() {
    try {
      const vms = await compute.getVMs();
      console.log(`Found ${vms.length} VMs!`);
      res.status(200).send(vms[0].map(vm => {
        //console.log(vm.metadata)
        return {
          id: vm.metadata.id,
          dateCreated: vm.metadata.creationTimestamp,
          name: vm.metadata.name,
          diskSize: vm.metadata.disks[0].diskSizeGb,
          publicIp: vm.metadata.networkInterfaces[0].accessConfigs[0].natIP,
          machineType: vm.metadata.machineType,
        }
      }));
    } catch (err) {
      console.error('ERROR:', err);
      res.status(400).send({
        error: err.message
      });
    }
  }
  listVms();
});

app.post("/createvm", function(req, res) {
  const {
    name,
    type,
  } = req.query;
  async function createVM() {
    try {
      const zone = compute.zone('us-central1-c');
      const vmName = name;
      const config = {
        os: 'ubuntu',
        machineType: type,
        https: true,
        http: true,
        metadata: {
          items: [
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
      const [, operation] = await vm.create(config);
      //const [vm, operation, apiResponse] = await zone.createVM(vmName, config);
      console.log(`Polling operation ${operation.id}...`);
      await operation.promise();

      console.log('Acquiring VM metadata...');
      const [metadata] = await vm.getMetadata();

      const ip = metadata.networkInterfaces[0].accessConfigs[0].natIP;
      console.log(`Booting new VM with IP http://${ip}...`);

      //console.log('Operation complete. Waiting for IP');
      //await pingVM(ip);

      console.log(`\n${vmName} created succesfully`);
      res.status(200).send({
          id: metadata.id,
          dateCreated: metadata.creationTimestamp,
          name: metadata.name,
          diskSize: metadata.disks[0].diskSizeGb,
          publicIp: metadata.networkInterfaces[0].accessConfigs[0].natIP,
          machineType: metadata.machineType,
      });
    } catch (err) {
      console.error('ERROR:', err);
      res.status(400).send({
        error: err.message
      });
    }
  };
  createVM();
});


app.post("/deletevm", function(req, res) {
  const {
    name,
  } = req.query;
  async function deleteVM() {
    try {
      const zone = compute.zone('us-central1-c');
      const vm = zone.vm(name);
      vm.delete(function(err, operation, apiResponse) {
        // `operation` is an Operation object that can be used to check the status
        // of the request.
      });
      await vm.delete().then(function(data) {
        const operation = data[0];
        const apiResponse = data[1];
        //console.log(apiResponse)
      });

      console.log('Virtual machine deleted!');
      res.status(200).send(apiResponse);
    } catch (err) {
      console.error('ERROR:', err);
      res.status(400).send({
        error: err.message
      });
    }
  };
  deleteVM();
});

app.listen(4000, function () {
  console.log('Example app listening on port 4000!');
});

