const Compute = require('@google-cloud/compute');
const compute = new Compute();

async function main() {
   try {
    
    const zone = compute.zone('us-central1-c');
    const vm = zone.vm('all-as-code-instance2');

    //vm.getMetadata(function(err, metadata, apiResponse) {});

    //-
    // If the callback is omitted, we'll return a Promise.
    //-
    vm.getMetadata().then(function(data) {
      // Representation of this VM as the API sees it.
      const metadata = data[0];
      const apiResponse = data[1];

      // Custom metadata and predefined keys.
      const customMetadata = metadata.metadata;
      console.log(metadata.disks)
      console.log(metadata.networkInterfaces[0].accessConfigs[0].natIP)
    });
   } catch(err) {
     console.error('ERROR', err);
   }
}

main()