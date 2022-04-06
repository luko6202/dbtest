import {
    addPouchPlugin,
    addRxPlugin,
    createRxDatabase,
    getRxStoragePouch,
    RxDatabase,
} from 'rxdb'
import {RxDBServerPlugin} from 'rxdb/plugins/server'
import * as LeveldownAdapter from 'pouchdb-adapter-leveldb';
import leveldown from 'leveldown';

addRxPlugin(RxDBServerPlugin)
addPouchPlugin(LeveldownAdapter)

export class Database {

    static async createDB(): Promise<RxDatabase> {
        const db: RxDatabase = await createRxDatabase({
            name: './data/server-db',
            storage: getRxStoragePouch(leveldown),
            ignoreDuplicate: true,
        });

        await db.waitForLeadership();
        console.log('isLeader now');

        try {
            await db.addCollections({
                chats: {
                    schema: {
                        title: 'chat data',
                        description: 'Database schema for realtime-chat',
                        version: 0,
                        primaryKey: 'message_id',
                        type: 'object',
                        properties: {
                            message_id: {
                                type: 'string',
                                final: true
                            },
                            message: {
                                type: 'string',
                            },
                        }
                    }
                }
            });
        } catch (e) {
            console.log('error: ', e);
        }

        console.log('server-db initialized.');
        return db;
    }
}
