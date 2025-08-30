# HyperBEAM Oracle

This repo contains a minimum viable oracle device that fetches any web2 JSON API endpoints and serves the data to AOS processes.

- [dev_oracle](https://github.com/ocrybit/HyperBEAM/blob/c748c20814fbac156497f0c3ab8b014637b11231/src/dev_oracle.erl)
- [test](./test/oracle.test.js)

You should be able to install [HyperBEAM](https://hyperbeam.ar.io/run/running-a-hyperbeam-node.html) and run on your local machine.

## clone the repo

```bash
git clone --recurse-submodules https://github.com/ocrybit/hb-oracle.git
cd hb-oracle && yarn && submodule init && git submodule update
```

Make sure you have `.wallet.json` under `hb-oracle/HyperBEAM/`.

## a sample test

The test is using [WAO](https://docs.wao.eco/).

```js
import assert from "assert"
import { describe, it, before, after } from "node:test"
import { AO, HB } from "wao"
import { HyperBEAM } from "wao/test"

const src_data = `local count = 0
json = require("json")
Handlers.add("Add", "Add", function (msg)
  local data = Send({ Target = msg.To, Url = msg.Url }).receive().Data
  count = count + tonumber(json.decode(data).version)
end)

Handlers.add("Get", "Get", function (msg)
  msg.reply({ Data = tostring(count) })
end)`

describe("Hyperbeam Oracle", function () {
  let hb, hbeam
  before(async () => {
    hbeam = await new HyperBEAM({ reset: true, as: ["genesis_wasm"] }).ready()
    hb = hbeam.hb
  })
  after(async () => hbeam.kill())

  it.only("should test oracle", async () => {
    const { pid } = await hb.spawn({ "execution-device": "oracle@1.0" })

    const ao = await new AO({ module_type: "mainnet", hb: hbeam.url }).init(
      hbeam.jwk,
    )
    const { p } = await ao.deploy({ src_data })
    await p.m("Add", { To: pid, Url: "https://arweave.net/" })
    assert.equal(await p.m("Get"), "5")
  })
})
```

## run test

```bash
yarn test-all
```
