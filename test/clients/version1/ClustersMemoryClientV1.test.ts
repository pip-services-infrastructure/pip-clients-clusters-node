let assert = require('chai').assert;
let async = require('async');

import { Descriptor } from 'pip-services-commons-node';
import { ConfigParams } from 'pip-services-commons-node';
import { References } from 'pip-services-commons-node';
import { ConsoleLogger } from 'pip-services-components-node';

import { ClustersMemoryPersistence } from 'pip-services-clusters-node';
import { ClustersController } from 'pip-services-clusters-node';
import { IClustersClientV1 } from '../../../src/clients/version1/IClustersClientV1';
import { ClustersMemoryClientV1 } from '../../../src/clients/version1/ClustersMemoryClientV1';
import { ClustersClientFixtureV1 } from './ClustersClientFixtureV1';

suite('ClustersMemoryClientV1', ()=> {
    let client: ClustersMemoryClientV1;
    let fixture: ClustersClientFixtureV1;

    setup(() => {
        client = new ClustersMemoryClientV1();

        fixture = new ClustersClientFixtureV1(client);
    });
    
    test('CRUD Operations', (done) => {
        fixture.testCrudOperations(done);
    });

});
