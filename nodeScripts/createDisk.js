// Imports the Google Cloud client library
const Compute = require('@google-cloud/compute');

// Creates a client
const compute = new Compute();

async function main() {
  // Create a new VM using the latest OS image of your choice.
  try {
    const zone = compute.zone('us-central1-c');

    const config = {
      os: 'your-project-id-or-name/ubuntu',
      sizeGb: 10
    };
    
    zone.createDisk('name', config, function(err, disk, operation, apiResponse) {
      // `disk` is a Disk object.
    
      // `operation` is an Operation object that can be used to check the status
      // of the request.
    });
    
    //-
    // If the callback is omitted, we'll return a Promise.
    //-
    zone.createDisk('name', config).then(function(data) {
      const disk = data[0];
      const operation = data[1];
      const apiResponse = data[2];
    });

  } catch (err) {
    console.error('ERROR:', err);
  }
  
}
main();