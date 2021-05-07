import { Actor, HttpAgent } from '@dfinity/agent';
import { idlFactory as hello_idl, canisterId as hello_id } from 'dfx-generated/hello';

const agent = new HttpAgent();
const hello = Actor.createActor(hello_idl, { agent, canisterId: hello_id });

document.getElementById("clickMeBtn").addEventListener("click", async () => {
  const name = document.getElementById("name").value.toString();
  const greeting = await hello.greet(name);

  document.getElementById("greeting").innerText = greeting;
});
