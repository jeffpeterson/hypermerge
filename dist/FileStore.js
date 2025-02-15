"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Metadata_1 = require("./Metadata");
const Keys = __importStar(require("./Keys"));
const JsonBuffer = __importStar(require("./JsonBuffer"));
const Queue_1 = __importDefault(require("./Queue"));
const StreamLogic_1 = require("./StreamLogic");
exports.MAX_BLOCK_SIZE = 62 * 1024;
class FileStore {
    constructor(store) {
        this.feeds = store;
        this.writeLog = new Queue_1.default('FileStore:writeLog');
    }
    header(url) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.feeds.head(toFeedId(url)).then(JsonBuffer.parse);
        });
    }
    read(url) {
        return __awaiter(this, void 0, void 0, function* () {
            const feedId = toFeedId(url);
            return this.feeds.stream(feedId, 0, -1);
        });
    }
    write(stream, mimeType) {
        return __awaiter(this, void 0, void 0, function* () {
            const keys = Keys.create();
            const feedId = yield this.feeds.create(keys);
            const appendStream = yield this.feeds.appendStream(feedId);
            return new Promise((res, rej) => {
                const chunkStream = new StreamLogic_1.MaxChunkSizeTransform(exports.MAX_BLOCK_SIZE);
                const hashStream = new StreamLogic_1.HashPassThrough('sha256');
                stream
                    .pipe(hashStream)
                    .pipe(chunkStream)
                    .pipe(appendStream)
                    .on('error', (err) => rej(err))
                    .on('finish', () => __awaiter(this, void 0, void 0, function* () {
                    const header = {
                        url: toHyperfileUrl(feedId),
                        mimeType,
                        size: chunkStream.processedBytes,
                        blocks: chunkStream.chunkCount,
                        sha256: hashStream.hash.digest('hex'),
                    };
                    yield this.feeds.append(feedId, JsonBuffer.bufferify(header));
                    this.writeLog.push(header);
                    res(header);
                }));
            });
        });
    }
}
exports.default = FileStore;
function isHyperfileUrl(url) {
    return /^hyperfile:\/\w+$/.test(url);
}
exports.isHyperfileUrl = isHyperfileUrl;
function toHyperfileUrl(feedId) {
    return `hyperfile:/${feedId}`;
}
function toFeedId(hyperfileUrl) {
    return Metadata_1.validateFileURL(hyperfileUrl);
}
//# sourceMappingURL=FileStore.js.map