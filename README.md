vibegit
=================

Become 10x vibecoder


[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/vibegit.svg)](https://npmjs.org/package/vibegit)
[![Downloads/week](https://img.shields.io/npm/dw/vibegit.svg)](https://npmjs.org/package/vibegit)


<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g vibegit
$ vibegit COMMAND
running command...
$ vibegit (--version)
vibegit/0.0.0 darwin-arm64 node-v22.13.1
$ vibegit --help [COMMAND]
USAGE
  $ vibegit COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`vibegit hello PERSON`](#vibegit-hello-person)
* [`vibegit hello world`](#vibegit-hello-world)
* [`vibegit help [COMMAND]`](#vibegit-help-command)
* [`vibegit plugins`](#vibegit-plugins)
* [`vibegit plugins add PLUGIN`](#vibegit-plugins-add-plugin)
* [`vibegit plugins:inspect PLUGIN...`](#vibegit-pluginsinspect-plugin)
* [`vibegit plugins install PLUGIN`](#vibegit-plugins-install-plugin)
* [`vibegit plugins link PATH`](#vibegit-plugins-link-path)
* [`vibegit plugins remove [PLUGIN]`](#vibegit-plugins-remove-plugin)
* [`vibegit plugins reset`](#vibegit-plugins-reset)
* [`vibegit plugins uninstall [PLUGIN]`](#vibegit-plugins-uninstall-plugin)
* [`vibegit plugins unlink [PLUGIN]`](#vibegit-plugins-unlink-plugin)
* [`vibegit plugins update`](#vibegit-plugins-update)

## `vibegit hello PERSON`

Say hello

```
USAGE
  $ vibegit hello PERSON -f <value>

ARGUMENTS
  PERSON  Person to say hello to

FLAGS
  -f, --from=<value>  (required) Who is saying hello

DESCRIPTION
  Say hello

EXAMPLES
  $ vibegit hello friend --from oclif
  hello friend from oclif! (./src/commands/hello/index.ts)
```

_See code: [src/commands/hello/index.ts](https://github.com/pushpak1300/vibegit/blob/v0.0.0/src/commands/hello/index.ts)_

## `vibegit hello world`

Say hello world

```
USAGE
  $ vibegit hello world

DESCRIPTION
  Say hello world

EXAMPLES
  $ vibegit hello world
  hello world! (./src/commands/hello/world.ts)
```

_See code: [src/commands/hello/world.ts](https://github.com/pushpak1300/vibegit/blob/v0.0.0/src/commands/hello/world.ts)_

## `vibegit help [COMMAND]`

Display help for vibegit.

```
USAGE
  $ vibegit help [COMMAND...] [-n]

ARGUMENTS
  COMMAND...  Command to show help for.

FLAGS
  -n, --nested-commands  Include all nested commands in the output.

DESCRIPTION
  Display help for vibegit.
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v6.2.27/src/commands/help.ts)_

## `vibegit plugins`

List installed plugins.

```
USAGE
  $ vibegit plugins [--json] [--core]

FLAGS
  --core  Show core plugins.

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  List installed plugins.

EXAMPLES
  $ vibegit plugins
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.4.36/src/commands/plugins/index.ts)_

## `vibegit plugins add PLUGIN`

Installs a plugin into vibegit.

```
USAGE
  $ vibegit plugins add PLUGIN... [--json] [-f] [-h] [-s | -v]

ARGUMENTS
  PLUGIN...  Plugin to install.

FLAGS
  -f, --force    Force npm to fetch remote resources even if a local copy exists on disk.
  -h, --help     Show CLI help.
  -s, --silent   Silences npm output.
  -v, --verbose  Show verbose npm output.

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Installs a plugin into vibegit.

  Uses npm to install plugins.

  Installation of a user-installed plugin will override a core plugin.

  Use the VIBEGIT_NPM_LOG_LEVEL environment variable to set the npm loglevel.
  Use the VIBEGIT_NPM_REGISTRY environment variable to set the npm registry.

ALIASES
  $ vibegit plugins add

EXAMPLES
  Install a plugin from npm registry.

    $ vibegit plugins add myplugin

  Install a plugin from a github url.

    $ vibegit plugins add https://github.com/someuser/someplugin

  Install a plugin from a github slug.

    $ vibegit plugins add someuser/someplugin
```

## `vibegit plugins:inspect PLUGIN...`

Displays installation properties of a plugin.

```
USAGE
  $ vibegit plugins inspect PLUGIN...

ARGUMENTS
  PLUGIN...  [default: .] Plugin to inspect.

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Displays installation properties of a plugin.

EXAMPLES
  $ vibegit plugins inspect myplugin
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.4.36/src/commands/plugins/inspect.ts)_

## `vibegit plugins install PLUGIN`

Installs a plugin into vibegit.

```
USAGE
  $ vibegit plugins install PLUGIN... [--json] [-f] [-h] [-s | -v]

ARGUMENTS
  PLUGIN...  Plugin to install.

FLAGS
  -f, --force    Force npm to fetch remote resources even if a local copy exists on disk.
  -h, --help     Show CLI help.
  -s, --silent   Silences npm output.
  -v, --verbose  Show verbose npm output.

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Installs a plugin into vibegit.

  Uses npm to install plugins.

  Installation of a user-installed plugin will override a core plugin.

  Use the VIBEGIT_NPM_LOG_LEVEL environment variable to set the npm loglevel.
  Use the VIBEGIT_NPM_REGISTRY environment variable to set the npm registry.

ALIASES
  $ vibegit plugins add

EXAMPLES
  Install a plugin from npm registry.

    $ vibegit plugins install myplugin

  Install a plugin from a github url.

    $ vibegit plugins install https://github.com/someuser/someplugin

  Install a plugin from a github slug.

    $ vibegit plugins install someuser/someplugin
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.4.36/src/commands/plugins/install.ts)_

## `vibegit plugins link PATH`

Links a plugin into the CLI for development.

```
USAGE
  $ vibegit plugins link PATH [-h] [--install] [-v]

ARGUMENTS
  PATH  [default: .] path to plugin

FLAGS
  -h, --help          Show CLI help.
  -v, --verbose
      --[no-]install  Install dependencies after linking the plugin.

DESCRIPTION
  Links a plugin into the CLI for development.

  Installation of a linked plugin will override a user-installed or core plugin.

  e.g. If you have a user-installed or core plugin that has a 'hello' command, installing a linked plugin with a 'hello'
  command will override the user-installed or core plugin implementation. This is useful for development work.


EXAMPLES
  $ vibegit plugins link myplugin
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.4.36/src/commands/plugins/link.ts)_

## `vibegit plugins remove [PLUGIN]`

Removes a plugin from the CLI.

```
USAGE
  $ vibegit plugins remove [PLUGIN...] [-h] [-v]

ARGUMENTS
  PLUGIN...  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ vibegit plugins unlink
  $ vibegit plugins remove

EXAMPLES
  $ vibegit plugins remove myplugin
```

## `vibegit plugins reset`

Remove all user-installed and linked plugins.

```
USAGE
  $ vibegit plugins reset [--hard] [--reinstall]

FLAGS
  --hard       Delete node_modules and package manager related files in addition to uninstalling plugins.
  --reinstall  Reinstall all plugins after uninstalling.
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.4.36/src/commands/plugins/reset.ts)_

## `vibegit plugins uninstall [PLUGIN]`

Removes a plugin from the CLI.

```
USAGE
  $ vibegit plugins uninstall [PLUGIN...] [-h] [-v]

ARGUMENTS
  PLUGIN...  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ vibegit plugins unlink
  $ vibegit plugins remove

EXAMPLES
  $ vibegit plugins uninstall myplugin
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.4.36/src/commands/plugins/uninstall.ts)_

## `vibegit plugins unlink [PLUGIN]`

Removes a plugin from the CLI.

```
USAGE
  $ vibegit plugins unlink [PLUGIN...] [-h] [-v]

ARGUMENTS
  PLUGIN...  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ vibegit plugins unlink
  $ vibegit plugins remove

EXAMPLES
  $ vibegit plugins unlink myplugin
```

## `vibegit plugins update`

Update installed plugins.

```
USAGE
  $ vibegit plugins update [-h] [-v]

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Update installed plugins.
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.4.36/src/commands/plugins/update.ts)_
<!-- commandsstop -->
