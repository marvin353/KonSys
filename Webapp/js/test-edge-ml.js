async function bla() {


    //const datasetCollector = require("explorer-node").datasetCollector;
    const sendDataset = require("edge-ml").sendDataset;
    const datasetCollector = require("edge-ml").datasetCollector;
    const Predictor = require("edge-ml").Predictor;

    // Generate collector function
    //try {
        const collector = await datasetCollector(
            "https://app.edge-ml.org",
            "UeeUAy9qKbgxRiLjRkn5JSqImW3zQ9JmkcCRgUJigoYQ7D8NpShj6F1sh3WeZG0VisWZMNKJsYy6/YSWLRMaFQ==",
            "DATASET_NAME",
            false,
            {"KEY": "VALUE"},
            "labeling_label"
        );
    //} catch (e) {
        // Error occurred, cannot use the collector as a function to upload
     //   console.log(e);
   // }

    try {
        // time should be a unix timestamp
        collector.addDataPoint(time = 1618760114000, sensorName = "sensorName", value = 1.23);

        // Tells the library that all data has been recorded.
        // Uploads all remaining data points to the server
        await collector.onComplete();
    } catch (e) {
        console.log(e);
    }
}

bla();