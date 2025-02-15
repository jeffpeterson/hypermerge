"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const Misc_1 = require("./Misc");
const Queue_1 = __importDefault(require("./Queue"));
const Keys = __importStar(require("./Keys"));
class NetworkPeer {
    constructor(selfId, id) {
        this.closedConnectionCount = 0;
        this.pendingConnections = new Set();
        this.connectionQ = new Queue_1.default('NetworkPeer:connectionQ');
        this.selfId = selfId;
        this.id = id;
    }
    get isConnected() {
        if (!this.connection)
            return false;
        return this.connection.isOpen && this.connection.isConfirmed;
    }
    /**
     * Determines if we are the authority on which connection to use when
     * duplicate connections are created.
     *
     * @remarks
     * We need to ensure that two peers don't close the other's incoming
     * connection. Comparing our ids ensures only one of the two peers decides
     * which connection to close.
     */
    get weHaveAuthority() {
        return this.selfId > this.id;
    }
    /**
     * Attempts to add a connection to this peer.
     * If this connection is a duplicate of an existing connection, we close it.
     * If we aren't the authority, and we don't have a confirmed connection, we
     * add hold onto it and wait for a ConfirmConnection message.
     */
    addConnection(conn) {
        if (this.isConnected) {
            this.closeConnection(conn);
            return;
        }
        if (this.weHaveAuthority) {
            conn.networkBus.send({ type: 'ConfirmConnection' });
            this.confirmConnection(conn);
            return;
        }
        this.pendingConnections.add(conn);
        conn.networkBus.subscribe((msg) => {
            if (msg.type === 'ConfirmConnection') {
                this.confirmConnection(conn);
            }
        });
    }
    confirmConnection(conn) {
        conn.isConfirmed = true;
        this.connection = conn;
        this.pendingConnections.delete(conn);
        for (const pendingConn of this.pendingConnections) {
            this.closeConnection(pendingConn);
        }
        this.pendingConnections.clear();
        this.connectionQ.push(conn);
    }
    closeConnection(conn) {
        conn.close();
        this.closedConnectionCount += 1;
    }
    close() {
        this.connection && this.closeConnection(this.connection);
        for (const pendingConn of this.pendingConnections) {
            this.closeConnection(pendingConn);
        }
    }
}
exports.default = NetworkPeer;
function encodePeerId(key) {
    return Misc_1.encodeRepoId(key);
}
exports.encodePeerId = encodePeerId;
function decodePeerId(id) {
    return Keys.decode(id);
}
exports.decodePeerId = decodePeerId;
//# sourceMappingURL=NetworkPeer.js.map