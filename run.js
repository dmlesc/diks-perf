'use strict';

const fs = require('fs');
const spawn = require("child_process").spawn;

var sec = '60';
var configs = [
  'r.ini',
  'w.ini',
  'rw.ini',
  'r.ini',
  'w.ini',
  'rw.ini',
  'r.ini',
  'w.ini',
  'rw.ini'
];

function runJob(config) {
  var outfile = config + '.json';
  const child = spawn('/usr/bin/fio', ['--runtime', sec, '--output', outfile, '--output-format=json', '--direct=0', config]);
  child.stdin.end();
  child.stdout.on('data', data => { console.log(data); });
  child.stderr.on('data', data => { console.log('err: ' + data); });
  child.on('exit', code => {
    if (!code) { processOut(outfile); }
    else { console.log('failure'); }
  });
}

function processOut(outfile) {
  console.log(outfile);
  var out = JSON.parse(fs.readFileSync(outfile));
  var total_read_iops = 0;
  var total_write_iops = 0;
  
  for (var i=0; i<out.jobs.length; i++) {
    var job = out.jobs[i];
    var name = job.jobname;
    var r_iops = job.read.iops;
    var w_iops = job.write.iops;

    total_read_iops += r_iops;
    total_write_iops += w_iops;

    /*console.log('  ' + name);
    console.log('    r: ' + r_iops);
    console.log('    w: ' + w_iops);*/
  }

  var combined_iops = total_read_iops + total_write_iops;
  console.log('  read iops: ' + Math.round(total_read_iops));
  console.log('  write iops: ' + Math.round(total_write_iops));
  console.log('  combined iops: ' + Math.round(combined_iops));
  
  if (configs.length)
    runJob(configs.shift());
  else
    console.log('\ndone');
}

runJob(configs.shift());