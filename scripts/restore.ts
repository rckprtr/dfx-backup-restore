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
    restoreNumbers().then(() => {
      process.exit(0);
    });
  } catch (error) {
    process.exit(1);
  }
}).finally(() => {
  process.exit(0);
});

async function restoreNumbers() {
  console.info("Restoring up phone numbers...");
  try {
    let data = loadJosn("backup.json");
    await canister.restore(data);
    console.timeEnd("Restore finished");
  } catch (error) {
    console.error("Failed to restore.", error);
  }
}

function loadJosn(filename: any) {
  return JSON.parse(fs.readFileSync(filename,'utf8'));
}