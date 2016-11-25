import http from 'http';
import https from 'https';
import fs from 'fs';
import config from './config/configuration';
import express from './config/express';  

const {https : usingHttps = false, httpsDir, keyName, certName} = config;

const PORT_NUM = config.port;

const app = express();

const startServer = () => {
    if (usingHttps) {
        const options = {
            key: fs.readFileSync(httpsDir + keyName),
            cert: fs.readFileSync(httpsDir + certName)
        }
        https.createServer(options, app).listen(8080);
        console.log('Https server running on port 443');
    } else {
        http.createServer(app).listen(PORT_NUM);
        console.log('Express server running on port ' + PORT_NUM);
    }
}

startServer();




