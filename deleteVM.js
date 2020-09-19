// Imports the Google Cloud client library
const Compute = require('@google-cloud/compute');

// Creates a client
const compute = new Compute();

async function quickstart() {
  // Create a new VM using the latest OS image of your choice.
  try {
    const zone = compute.zone('us-central1-c');
    const vm = zone.vm('all-as-code-instance');
    vm.delete(function(err, operation, apiResponse) {
      // `operation` is an Operation object that can be used to check the status
      // of the request.
    });

    //-
    // If the callback is omitted, we'll return a Promise.
    //-
    await vm.delete().then(function(data) {
      const operation = data[0];
      const apiResponse = data[1];
      console.log(apiResponse)
    });

    console.log('Virtual machine deleted!');
  } catch (err) {
    console.error('ERROR:', err);
  }
  
}
quickstart();