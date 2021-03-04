const cp = require('child_process');
const numCPUs = require('os').cpus().length;

class Service {
    constructor(options) {
        this.transport = options.transport;
        this.isClusterMode = !!options.cluster;
        if( this.isClusterMode ) {
            this.clusterOptions = options.cluster;
        }
    }

    async start() {
        await this.startCluster();
        await this.startWorker();
        if( this.transport.isPermanentConnection ) {
            await this.startTransport();
        }
    }

    async stop() {
        this.worker.kill();
        for (const id in this.clusterOptions.workers) {
            this.clusterOptions.workers[id].kill()
        }
    }

    async startTransport() {
        //todo: логика запуска транспорта
        await this.transport.startTransport()
        this.transport.on('message', message => {
            this.worker.send(message);
        })
    }

    async startWorker() {
        //todo: логика запуска обработчика запросов
        this.worker = cp.fork(`${__dirname}/controller.js`);
        this.worker.on('message', message => {
            if(m.err !== null) {
                console.error('Error: ' , message.data);
            } else {
                console.log('Success:', message.data);
            }
            this.transport.send(message);
        });

        this.worker.on('exit', async () => {
            await this.startWorker();
        })
    }

    async startCluster() {
        //todo: логика запуска дочерних процессов
        for (let i = 0; i < numCPUs; i++) {
            this.clusterOptions.fork();
        }

        this.clusterOptions.on('exit', (worker)=>{
            if(worker.isDead()) {
                this.clusterOptions.fork()
            }
        })
        
    }
}

module.exports = Service