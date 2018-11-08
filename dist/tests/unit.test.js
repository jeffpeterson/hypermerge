"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const tape_1 = __importDefault(require("tape"));
const src_1 = require("../src");
const RepoFrontend_1 = require("../src/RepoFrontend");
tape_1.default("Simple create doc and make a change", (t) => {
    const repoB = new src_1.Repo();
    const repoF = new RepoFrontend_1.RepoFrontend();
    repoB.subscribe(repoF.receive);
    repoF.subscribe(repoB.receive);
    const id = repoF.create();
    console.log("ID=", id);
    const handle = repoF.open(id);
    handle.subscribe((state, index) => {
        switch (index) {
            case 0:
                t.equal(state.foo, undefined);
                break;
            case 1:
                t.equal(state.foo, "bar");
                break;
            case 2:
                t.equal(state.foo, "bar");
                t.end();
                handle.close();
        }
    });
    handle.change(state => {
        state.foo = "bar";
    });
});
tape_1.default("Create a doc backend - then wire it up to a frontend - make a change", (t) => {
    t.end();
    /*
      const keys = keyPair()
      const repo = new Repo()
      const backend = repo.createDocumentBackend(keys)
      const doc = new Document(keys)
    
    //  doc.subscribe(backend.receive)
    //  backend.subscribe(doc.receive)
    
      const handle = doc.handle()
      handle.subscribe((state, index) => {
        switch (index) {
          case 0:
            t.equal(state.foo, undefined)
            break
          case 1:
            t.equal(state.foo, "bar")
            break
          case 2:
            t.equal(state.foo, "bar")
            t.end();
            handle.close()
        }
      })
      handle.change(state => {
        state.foo = "bar"
      })
    */
});
//# sourceMappingURL=unit.test.js.map