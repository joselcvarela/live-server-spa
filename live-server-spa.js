#!/usr/bin/env node

const program = require('commander')
const express = require('express')
const app = express()
const log = console.log
const fs = require('fs')
const path = require('path')
const { JSDOM } = require('jsdom')
const SSE = require('sse-channel')
const sse = new SSE()
let dirToServe = ''

program
  .version('0.1.0')
  .usage('[options] <folder>')
  .option('-p, --port <n>', 'Port (default: 80)', parseInt)
  .option('-h, --host [value]', 'Bind address (default: 0.0.0.0)')
  .option('-H, --hard', 'Set hard reloads (default: false)')
  .action(_dirToServe => {
    dirToServe = _dirToServe
  })
  .parse(process.argv)

const port = program.port || 80
const hostname = program.host || '0.0.0.0'
const hardReloads = program.hard || false
const here = path.join(process.cwd(), dirToServe)

const indexHtml = fs.readFileSync(path.join(here, 'index.html'), 'utf8')
const indexDom = new JSDOM(indexHtml)
const indexBody = indexDom.window.document.querySelector('body')
const scriptToInject = `
<script>
  var sse = new EventSource('/__internal/listenReload')
  sse.onmessage = function() {
    window.location.reload(${String(hardReloads)})
  }
</script>
`
indexBody.innerHTML += scriptToInject
const indexHtmlInjected = indexDom.serialize()

app.get('/__internal/emitReload', (req, res) => {
  sse.send('reload')
  res.status(200).send('ok')
})

app.get('/__internal/listenReload', (req, res) => {
  sse.addClient(req, res)
})

app.use(express.static(here, { index: false }))

app.get('*', (req, res) => {
  res.setHeader('Content-type', 'text/html; charset=utf-8')
  res.send(indexHtmlInjected)
})

app.listen(port, hostname, () => {
  log(`Server listening on: ${hostname}:${port}`)
})
