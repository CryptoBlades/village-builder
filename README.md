# VillageBuilder

Village Builder is an incremental-adjacent game that allows you to stake land to gain permanent benefits when CBK starts.
## Blockchain setup

You need to have [CryptoBlades](https://github.com/cryptoblades/cryptoblades) running on your local machine

In CryptoBlades repo, run `truffle console` and mint some lands for yourself:

```
let cbkLand = await CBKLand.deployed();
cbkLand.mint(accounts[0],1,1);
cbkLand.mint(accounts[0],2,2);
cbkLand.mint(accounts[0],3,3);
```

You will also need `Weapons` and `Characters` in order to stake them in VillageBuilder, you can do it through the CryptoBlades game UI.

You can now do the `truffle migrate --compile-all` in order to deploy the VillageBuilder contracts to your local blockchain.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.
