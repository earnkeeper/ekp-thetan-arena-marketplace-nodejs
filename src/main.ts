import "reflect-metadata";

import { container } from "tsyringe";
import { config } from "./config";
import path from 'path';
import { ClientService } from "./sdk/client-service";
require('dotenv').config()

async function main() {
    const clientService = container.resolve(ClientService);

    console.log(__dirname)

    clientService.listen(3001, path.join(__dirname, '../public'))

    
}

main()