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
      disks: [ 
        {
          name: 'node-vm-test-from-snapshot',
          initializeParams: {
            sourceSnapshot: 'https://www.googleapis.com/compute/v1/projects/resounding-net-275021/global/snapshots/blank-native-jenkins',
            sizeGb: 10,
          },
        },
      ],
      https: true,
      http: true,
      tags: ['jenkins']
    }
    // Start the VM create task
    const [vm, operation, apiResponse] = await zone.createVM(vmName, config);
    console.log(apiResponse);

    console.log('Virtual machine created!', vm);
    
    
    await operation.promise();
    console.log('Virtual machine running!', apiResponse.networkInterfaces);
    
  } catch (err) {
    console.error('ERROR:', err);
  }
  
}
quickstart();