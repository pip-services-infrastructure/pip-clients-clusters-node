let assert = require('chai').assert;
let async = require('async');

import { Descriptor } from 'pip-services-commons-node';
import { ConfigParams } from 'pip-services-commons-node';
import { References } from 'pip-services-commons-node';
import { ConsoleLogger } from 'pip-services-components-node';

import { ClustersMemoryPersistence } from 'pip-services-clusters-node';
import { ClustersController } from 'pip-services-clusters-node';
import { IClustersClientV1 } from '../../src/clients/version1/IClustersClientV1';
import { ClustersDirectClientV1 } from '../../src/clients/version1/ClustersDirectClientV1';
import { ClustersClientFixtureV1 } from './ClustersClientFixtureV1';

suite('ClustersDirectClientV1', ()=> {
    let client: ClustersDirectClientV1;
    let fixture: ClustersClientFixtureV1;

    suiteSetup((done) => {
        let logger = new ConsoleLogger();
        let persistence = new ClustersMemoryPersistence();
        let controller = new ClustersController();

        let references: References = References.fromTuples(
            new Descriptor('pip-services', 'logger', 'console', 'default', '1.0'), logger,
            new Descriptor('pip-services-clusters', 'persistence', 'memory', 'default', '1.0'), persistence,
            new Descriptor('pip-services-clusters', 'controller', 'default', 'default', '1.0'), controller,
        );
        controller.setReferences(references);

        client = new ClustersDirectClientV1();
        client.setReferences(references);

        fixture = new ClustersClientFixtureV1(client);

        client.open(null, done);
    });
    
    suiteTeardown((done) => {
        client.close(null, done);
    });

    test('CRUD Operations', (done) => {
        fixture.testCrudOperations(done);
    });

});
