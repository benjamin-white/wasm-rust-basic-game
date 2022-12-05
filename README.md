# **_A simple game to learn more about WebAssembly_**

As the title says just learning about using WebAssembly via Rust (and using CSS Houdini in React).

Many things are not implemented, such as restarting a lost game or pausing a started game &mdash; but for now there is basic gameplay.

To run you will need [Rust](https://www.rust-lang.org/tools/install) and [node](https://nodejs.org/en/download/) installed, then:
```bash
npm i
cargo install wasm-pack

# ...and to build the WASM files:
npm run wasm
# ...and to run a local server:
npm run dev
```