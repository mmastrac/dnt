# d2n

Prototype for a Deno to Node output CLI tool. This will output TSC compatible code from a Deno codebase that could then be sent to a bundler (or through tsc) for npm distribution.

Example:

```bash
# clone a Deno repo with no remote dependencies (because this tool does not support them yet)
git clone https://github.com/dsherret/code-block-writer.git

# clone this repo
git clone https://github.com/dsherret/d2n.git
cd d2n

cargo run -- ../code-block-writer/mod.ts --out ../code-block-writer/npm

cd ../code-block-writer/npm
tsc mod.ts -target ES2015 -module commonjs
# npm publish
```

Then in *dist/mod.ts* the file will contain:

```ts
import { CommentChar } from "./comment_char";
import { escapeForWithinString, getStringFromStrOrFunc } from "./utils/string_utils";
```

If you run with `cargo run -- ../code-block-writer/mod.ts --out ../code-block-writer/npm --keep-extensions` it will then contain:

```ts
import { CommentChar } from "./comment_char.js";
import { escapeForWithinString, getStringFromStrOrFunc } from "./utils/string_utils.js";
```

## Future Goals

1. Programmatic API available via Rust and Wasm (this would be used by bundlers to avoid writing the intermediary files to the disk).
1. Support Deno.json to get compiler options.
1. Handle mapping from remote specifiers to bare specifiers and transforming them in the file.
1. Handle dynamic imports (at least ones that are statically analyzable and maybe warn on others)
1. Support creating or modifying a package.json and using that for publish.

Notes from Kitson:

- We would need to rewrite triple slash references
- We might need to deal with the types in the tsconfig.json
- How do we cleanly supply a deno.ns lib so type checking works?
  - David: We will search for any Deno specific APIs and replace them with a node shim.
- How do we handle remote URLs, data URLs and blob dynamic imports?
  - David: We can implement remote URL -> bare specifier mapping. Ideally this will be automatic, but in some cases the user will need to specify a bare specifier to use.
  - David: We could probably output data URLs to a file.
  - David: Blob dynamic imports... I'm not sure. Dynamic imports will be a problem if they're not statically analyzable, but we can warn the user about that when it happens.
- We should go from ./foo.ts to ./foo.js by default, with a flag to go from ./foo.ts to ./foo, assume people are supporting a browser or ESM Node.js
  - David: I'll change this to be the default later.