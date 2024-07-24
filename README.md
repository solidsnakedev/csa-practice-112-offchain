# csa-practice-offchain

Install NodeJS, pnpm or yarn (package managers) using flake nix

# package.json
```
pnpm init
```

## Install typescript
```
pnpm add -D typescript
```

## Setup typescript config
to setup a default ts config
```
pnpm tsc --init
```

```
pnpm tsc --init --rootDir src --outDir dist --target esnext --module NodeNext --moduleResolution NodeNext
```

## Create src folder and index.ts
```
mkdir src 
code src/index.ts
```

## Compile project
```
pnpm tsc
```

## Run the compiled code
```
node dist/index.js
```


## Install bundler
```
pnpm add tsup -D
```
or
```
npm install --save-dev tsup
```