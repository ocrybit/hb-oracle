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

describe("Hyperbeam Legacynet", function () {
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
