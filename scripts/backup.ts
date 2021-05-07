#!/usr/bin/env node
const fs = require("fs");
const path = require("path");
const {
  HttpAgent,
  Actor,
} = require("@dfinity/agent");


const dfxConfig = require("../dfx.json");

const { DFX_NETWORK = "local" } = process.env;

const outputRoot = path.join(
  process.cwd(),
  ".dfx",
  DFX_NETWORK,
  "canisters",
  "phone_book",
  "phone_book.js"
);

const { idlFactory, canisterId } = require(outputRoot);

// @ts-ignore
globalThis.window = {
  // @ts-ignore
  location: { protocol: "http:" },
};
globalThis.window.fetch = require("node-fetch");
globalThis.fetch = require("node-fetch");

const canister = Actor.createActor(idlFactory, {
  agent: new HttpAgent({ host: dfxConfig.networks.local.bind }),
  canisterId,
});

new Promise(() => {
  try {
    backupNumbers().then(() => {
      process.exit(0);
    });
  } catch (error) {
    process.exit(1);
  }
}).finally(() => {
  process.exit(0);
});

async function backupNumbers() {
  console.info("Backing up phone numbers...");
  try {
    console.time("Test profiles created in");
    let numbers = await canister.backup();
    console.log(numbers);
    dumpToJson(numbers);
    console.timeEnd("Backup finished");
  } catch (error) {
    console.error("Failed to backups.", error);
  }
}

function dumpToJson(data: any) {
  fs.writeFileSync("backup.json", JSON.stringify(data));
}

