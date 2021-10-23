import net from "net";
import { port } from "./config.json";

const addressSet: Set<string> = new Set();

const server: net.Server = net.createServer((socket: net.Socket) => {
    let remoteAddress: string = <string> socket.remoteAddress;

    if(addressSet.has(remoteAddress)){
        socket.end();

        return;
    }

    socket.on("data", () => {
        let addressSetClone: Set<string> = new Set(addressSet);
        addressSetClone.delete(remoteAddress);

        let addressList: unknown[] = [...addressSetClone];

        for(let i: number = addressList.length - 1; i > 0; i--){
            let j: number = Math.floor(Math.random() * (i + 1));

            [addressList[i], addressList[j]] = [addressList[j], addressList[i]];
        }

        socket.write(addressList.slice(0, 20).join());
    });

    socket.once("close", () => {
        addressSet.delete(remoteAddress);
    });

    addressSet.add(remoteAddress);
});

server.listen(port);