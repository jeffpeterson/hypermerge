
import fs from "fs"
import { Repo } from "../src"
const raf: Function = require("random-access-file")
const id = process.argv[2]
const _path = process.argv[3]
const path = _path || ".data"

if (id === undefined) {
  console.log("Usage: cat DOC_ID [REPO]")
  process.exit()
}

if (_path && !fs.existsSync(_path + "/ledger")) {
  console.log("No repo found: " + _path)
  process.exit()
}

setTimeout(() => {}, 50000)

const repo = new Repo({ path, storage: raf })

import Client from "discovery-cloud-client"
const discovery = new Client({
  url: "wss://discovery-cloud.herokuapp.com",
  id: repo.id,
  stream: repo.stream,
})
repo.replicate(discovery)

repo.readFile(id, (data,mimeType) => {
  console.log("hyperfile://" + id)
  console.log("File Size: ", data.length)
  console.log("File Type: ", mimeType)
  process.exit()
})
