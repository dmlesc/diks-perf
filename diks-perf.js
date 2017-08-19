'use strict';

const spawn = require("child_process").spawn;

const child = spawn('path/to/bin', ['options']);
child.stdout.on("data", (data) => { 
  console.log("out: " + data);
});

child.stderr.on("data", (data) => {
  console.log("err: " + data);
});

child.on("exit", (code) => {
  if (!code) { 
    console.log("success");
  }
  else {
    console.log("failure");
  }
});

child.stdin.end();
