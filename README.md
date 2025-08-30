## clone the repo

```bash
git clone --recurse-submodules https://github.com/ocrybit/hb-oracle.git
cd hb-oracle && yarn && submodule init && git submodule update
```

Make sure you have `.wallet.json` under `hb-oracle/HyperBEAM/`.

## run test

```bash
yarn test-all
```
