#!/usr/bin/env -S NODE_OPTIONS='--no-deprecation' node --loader ts-node/esm --disable-warning=ExperimentalWarning

import {execute} from '@oclif/core'

await execute({development: true, dir: import.meta.url})
