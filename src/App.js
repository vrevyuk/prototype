import React, {useState} from "react";
import Block from "./Block";

import "normalize.css";
import './App.css';


import {cbor, isValidAutomergeUrl, Repo} from '@automerge/automerge-repo'
import { BroadcastChannelNetworkAdapter } from '@automerge/automerge-repo-network-broadcastchannel'
import { BrowserWebSocketClientAdapter } from "@automerge/automerge-repo-network-websocket"
import { IndexedDBStorageAdapter } from "@automerge/automerge-repo-storage-indexeddb"
import { RepoContext } from '@automerge/automerge-repo-react-hooks'
import {next as Automerge} from "@automerge/automerge";

class BrowserWebSocketClientAdapterWrapper extends BrowserWebSocketClientAdapter {
    constructor(url) {
        super(url);
    }

    send(message) {
        // console.log("SEND MESSAGE", message);
        if (message.type === "sync") {
            const syncMessage = Automerge.decodeSyncMessage(message.data);
            console.log("SEND SYNC MESSAGE", message, syncMessage);
        }
        super.send(message);
    }

    receiveMessage(messageBytes) {
        const message = cbor.decode(new Uint8Array(messageBytes));
        // console.log("RECEIVE MESSAGE", message);
        if (message.type === "sync") {
            const syncMessage = Automerge.decodeSyncMessage(message.data);
            console.log("RECEIVE SYNC MESSAGE", message, syncMessage);
        }
        super.receiveMessage(messageBytes);
    }
}

const repo = new Repo({
    network: [
        new BroadcastChannelNetworkAdapter(),
        new BrowserWebSocketClientAdapterWrapper('wss://sync.automerge.org')
    ],
    storage: new IndexedDBStorageAdapter(),
});

function App() {
    const [documentHash, setDocumentHash] = useState(window.location.hash.split("#")[1])

    const createDocument = () => {
        const docHandle = repo.create({
            text: new Automerge.RawString('The standard chunk of Lorem Ipsum used since the 1500s is reproduced below for those interested. Sections 1.10.32 and 1.10.33 from "de Finibus Bonorum et Malorum" by Cicero are also reproduced in their exact original form, accompanied by English versions from the 1914 translation by H. Rackham.'),
            backgroundColor: "#F0F0F0",
            fontSize: new Automerge.Int(12),
        });
        setDocumentHash(docHandle.url)
        window.location.hash = docHandle.url;
    }

    return (
        <RepoContext.Provider value={repo}>
            <div className="App">
                { isValidAutomergeUrl(documentHash)
                    ? <Block documentHash={documentHash} />
                    : <button onClick={createDocument}>CREATE NEW DOCUMENT</button>}

            </div>
        </RepoContext.Provider>
    );
}

export default App;
