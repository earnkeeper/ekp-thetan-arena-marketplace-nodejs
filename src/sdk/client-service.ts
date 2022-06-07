import cors from "cors";
import express, { Express } from "express";
import { createServer, Server as HttpServer } from "http";
import { Server } from "socket.io";
import { singleton } from "tsyringe";
import { IController } from "./controller-interface";

@singleton()
export class ClientService {
  private app: Express;
  private io: Server;
  private controllers: IController[] = [];
  private httpServer: HttpServer;

  constructor() {
    this.app = express();
    this.app.use(cors());
    this.httpServer = createServer(this.app);
    this.io = new Server(this.httpServer, {
      cors: {},
    });
    this.io.on("connection", (socket) => {
      console.log(`Client connected ${socket.id}`);

      socket.on("client-state-changed", (data) => {
        console.log(`Client state changed ${socket.id} ${data}`);
        for (const controller of this.controllers) {
          controller.onClientStateChanged(socket.id, data);
        }
      });

      socket.on("disconnect", () => {
        console.log(`Client disconnected ${socket.id}`);
        for (const controller of this.controllers) {
          controller.onDisconnect(socket.id);
        }
      });
  
      for (const controller of this.controllers) {
        controller.onConnect(socket.id);
      }
    });

  }

  listen(port: number, staticPath: string) {
    this.httpServer.listen(port);
    this.app.use(express.static(staticPath));
  }

  addController(controller: IController) {
    this.controllers.push(controller)
  }
}
