// Imports the Google Cloud client library
const Compute = require('@google-cloud/compute');

// Creates a client
const compute = new Compute();

async function quickstart() {
  // Create a new VM using the latest OS image of your choice.
  try {
    const zone = compute.zone('us-central1-c');

    const vmName = 'node-vm-test';
    const config = {
      os: 'ubuntu',
      machineType: 'g1-small',
      https: true,
      http: true,
      metadata: {
        items: [
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
        ]
      },
      //Firewall
      tags: ['jenkins']
      /**
      disks: [ 
        {
          name: 'node-vm-test-from-snapshot',
          initializeParams: {
            sourceSnapshot: 'https://www.googleapis.com/compute/v1/projects/resounding-net-275021/global/snapshots/blank-native-jenkins',
            sizeGb: 10,
          },
        },
      ],
       */
    }

    
    console.log(`Creationg VM ${vmName}...`);
    const vm = zone.vm(vmName);
    const [, operation] = await vm.create(config);
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
    
  } catch (err) {
    console.error('ERROR:', err);
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

quickstart();