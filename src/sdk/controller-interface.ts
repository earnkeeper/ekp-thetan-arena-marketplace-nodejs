import { ClientStateChangedEvent } from "@earnkeeper/ekp-sdk"

export interface IController {
    onConnect: (sid:string) => Promise<void>
    onClientStateChanged: (sid:string, event: ClientStateChangedEvent) => Promise<void>
    onDisconnect: (sid:string) => Promise<void>
}