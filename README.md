# vibegit

Become 10x vibecoder by managing isolated sandboxed git environments.

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/vibegit.svg)](https://npmjs.org/package/vibegit)
[![Downloads/week](https://img.shields.io/npm/dw/vibegit.svg)](https://npmjs.org/package/vibegit)
[![License](https://img.shields.io/npm/l/vibegit.svg)](https://github.com/pushpak1300/vibegit/blob/master/package.json)

vibegit is a command-line tool that helps developers create and manage isolated git environments for experimentation. It allows you to create separate copies of your repository to work on different features, fixes, or ideas without affecting your main codebase.

## Features

- Create isolated copies of your git repository with their own branches
- Easily navigate between different sessions
- Push changes from sessions to remote repositories
- List all active sessions with detailed information
- Clean up sessions when they're no longer needed

## Installation

```sh
npm install -g vibegit
```

## Usage

```sh
$ vibegit COMMAND
```

## Commands

### `vibegit new SESSION`

Create a new sandbox environment from the current repo.

```
USAGE
  $ vibegit new SESSION [--force]

ARGUMENTS
  SESSION  Name of the session/branch

FLAGS
  -f, --force  Skip checks and force creation if target directory exists

EXAMPLES
  $ vibegit new experiment-feature
  $ vibegit new bugfix-123 --force
  $ vibegit new new-idea
```

### `vibegit list`

List all vibegit sessions.

```
USAGE
  $ vibegit list [--verbose]

FLAGS
  -v, --verbose  Show additional details for each session

EXAMPLES
  $ vibegit list
  $ vibegit list --verbose
```

### `vibegit go SESSION`

Output command to navigate to a vibegit session directory.

```
USAGE
  $ vibegit go SESSION [--no-hint]

ARGUMENTS
  SESSION  Name of the session to go to

FLAGS
  --no-hint  Suppress usage hints

EXAMPLES
  $ vibegit go feature-branch
  $ eval "$(vibegit go feature-branch)"
```

Pro tip: Add this to your shell profile for convenient navigation:
```
function vg() { eval "$(vibegit go $1)"; }
```

### `vibegit push [SESSION]`

Push code changes to remote repository.

```
USAGE
  $ vibegit push [SESSION] [--all] [--force]

ARGUMENTS
  SESSION  Name of the session to push

FLAGS
  --all       Push all sessions to their respective branches
  -f, --force  Force push (git push -f)

EXAMPLES
  $ vibegit push
  $ vibegit push --all
  $ vibegit push experiment-feature
  $ vibegit push experiment-feature --force
```

### `vibegit remove [SESSION]`

Remove a vibegit session or all sessions.

```
USAGE
  $ vibegit remove [SESSION] [--all] [--force] [--push]

ARGUMENTS
  SESSION  Name of the session to remove

FLAGS
  --all     Remove all sessions
  -f, --force  Skip confirmation prompt
  --push    Push the repository before removing the session

EXAMPLES
  $ vibegit remove experiment-feature
  $ vibegit remove --all
  $ vibegit remove bugfix-123 --push
```

### `vibegit help [COMMAND]`

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

## Workflow Example

```sh
# Create a new session for a feature
$ vibegit new awesome-feature

# Navigate to the session
$ eval "$(vibegit go awesome-feature)"
# Or if you've added the suggested function to your shell profile:
$ vg awesome-feature

# Make your changes...

# Push your changes to the remote
$ vibegit push

# Clean up when you're done
$ vibegit remove awesome-feature --push
```

## License

MIT