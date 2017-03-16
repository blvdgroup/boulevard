# Contributing to Boulevard

This document outlines the steps to setup boulevard to begin hacking on it.

## Table of Contents

- [Initial Setup](#initial-setup)
- [Building](#building)
- [Linting](#linting)

## Initial Setup

```shell
git clone https://github.com/blvdgroup/boulevard.git
cd boulevard
yarn
lerna bootstrap
```

## Building

```shell
lerna run build
```

## Linting

```shell
lerna run lint
```

## Commiting

First, ensure you have commitizen installed. Then,

```shell
git cz
```

### Scopes - Code

The scope should be formatted in the following way: `package:class`. Care should be taken to make incremental commits.

Certain packages also have special scopes. For example, when updating `blvd-cli`, one may substitute the class for the name of the command updated.

Example scopes include:

- `blvd:Context`
- `blvd:Model`
- `blvd-cli:init`

### Scopes - Other

When not making update to individual packages (such as large refactors), a scope is not required. However, when updating docs or certain outside doucments (CI stuff, style configs) it helps to include the name of the file being updated, _or_ the name of the folder above it. For example, the following are all good scopes when updating the docs:

- `README`
- `CONTRIBUTING`
- `gitattributes`
- `README`
- `lerna`
- `vscode`
