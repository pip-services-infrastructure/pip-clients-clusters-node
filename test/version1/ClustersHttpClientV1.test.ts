let assert = require('chai').assert;
let async = require('async');

import { Descriptor } from 'pip-services-commons-node';
import { ConfigParams } from 'pip-services-commons-node';
import { References } from 'pip-services-commons-node';
import { ConsoleLogger } from 'pip-services-components-node';

import { ClustersMemoryPersistence } from 'pip-services-clusters-node';
import { ClustersController } from 'pip-services-clusters-node';
import { ClustersHttpServiceV1 } from 'pip-services-clusters-node';
import { IClustersClientV1 } from '../../src/clients/version1/IClustersClientV1';
import { ClustersHttpClientV1 } from '../../src/clients/version1/ClustersHttpClientV1';
import { ClustersClientFixtureV1 } from './ClustersClientFixtureV1';

var httpConfig = ConfigParams.fromTuples(
    "connection.protocol", "http",
    "connection.host", "localhost",
    "connection.port", 3000
);

suite('ClustersRestClientV1', ()=> {
    let service: ClustersHttpServiceV1;
    let client: ClustersHttpClientV1;
    let fixture: ClustersClientFixtureV1;

    suiteSetup((done) => {
        let logger = new ConsoleLogger();
        let persistence = new ClustersMemoryPersistence();
        let controller = new ClustersController();

        service = new ClustersHttpServiceV1();
        service.configure(httpConfig);

        let references: References = References.fromTuples(
            new Descriptor('pip-services', 'logger', 'console', 'default', '1.0'), logger,
            new Descriptor('pip-services-clusters', 'persistence', 'memory', 'default', '1.0'), persistence,
            new Descriptor('pip-services-clusters', 'controller', 'default', 'default', '1.0'), controller,
            new Descriptor('pip-services-clusters', 'service', 'http', 'default', '1.0'), service
        );
        controller.setReferences(references);
        service.setReferences(references);

        client = new ClustersHttpClientV1();
        client.setReferences(references);
        client.configure(httpConfig);

        fixture = new ClustersClientFixtureV1(client);

        service.open(null, (err) => {
            client.open(null, done);
        });
    });
    
    suiteTeardown((done) => {
        client.close(null);
        service.close(null, done);
    });

    test('CRUD Operations', (done) => {
        fixture.testCrudOperations(done);
    });

});
