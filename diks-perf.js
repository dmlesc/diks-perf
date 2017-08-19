'use strict';

const spawn = require("child_process").spawn;

const child = spawn('/usr/bin/fio', ['--runtime', '60', 'fio_read.ini']);
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
