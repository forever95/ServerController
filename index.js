import { Service } from './service'

async function main() {
    //todo: transport and cluster are initialized before calling to Service
    let transport = null
    let cluster = null
    // initialize Service
    let service = new Service({transport,cluster});
    await service.start();
}

main()