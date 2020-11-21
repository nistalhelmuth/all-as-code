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
                sudo wget -P /home/ https://raw.githubusercontent.com/nistalhelmuth/all-as-code/master/script.sh
                sudo chmod +x /home/script.sh
                sudo mkdir /home/logs
                sudo chmod -R 777 /home/logs
                sudo wget -P /home/ https://raw.githubusercontent.com/nistalhelmuth/all-as-code/master/serve.py
                sudo nohup python3 /home/serve.py &
                sudo /home/script.sh nistalhelmuth/pipelines-sandbox > /home/logs/logs.txt
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
        console.log('Virtual machine deleted!');
        res.status(200).send(apiResponse);
      });

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

