# boulevard

**This project is in a pre-alpha state, and none of the APIs described below should be considered implemented. When boulevard reaches a state where all of the planned features are implemented, i.e. 0.1, this warning will be removed. Until this warning is removed, do not be surprised if nothing works, because we haven't built it yet.**

Boulevard is a framework for building full-stack apps on JavaScript. If it was a dog, it would be a Samoyed - not too big, but very powerful, and capable of herding small children.

[![license](https://img.shields.io/github/license/blvdgroup/boulevard.svg)](https://github.com/blvdgroup/boulevard/blob/master/LICENSE) [![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)

```javascript
// TODO: Code sample? Not sure how to depict
```

## Table of Contents

- [Getting Started](#getting-started)
  - [Requirements](#requirements)
  - [Starting a Project](#starting-a-project)
- [Issues and Feature Requests](#issues-and-feature-requests)
- [Contributing](#contributing)
- [Packages](#packages)
  - [Core](#core)
  - [View Adapters](#view-adapters)
  - [Database Adapters](#database-adapters)
  - [Other](#other)


## Getting Started

### Requirements

Boulevard has a couple of requirements before you start using it:

- **Node:** If you haven't already, [install and download Node from here](https://nodejs.org). You must have Node installed, and it must be version 4 or above. You should avoid odd number releases (i.e. 5 or 7), especially for development apps.
- **Yarn:** Not a strict requirement, but it's for your own good. [You can download and install it here](https://yarnpkg.org).

### Starting a Project

To get started, open up any command line and install the boulevard cli:

```shell
npm install -g blvd-cli
mkdir my-blvd project
cd my-blvd-project
blvd init
```

The CLI will download and set up your first blvd project. From there, you can host your server right off the bat:

```shell
blvd develop
```

Now, open up any web browser and navigate to `http://localhost:8080`. You've just set up your very own boulevard project! The hello world page will link you to further documentation and guides.

## Issues and Feature Requests

We use [github issues](https://github.com/blvdgroup/boulevard/issues) to track issues with boulevard. You can post any issues or feature requests you have there. If you have a question, or need support for boulevard, use StackOverflow. (We hope to set up a Discourse instance in the near future.)

## Contributing

For more information on setting up a local copy of the repo and getting started on your very first pull request, read [CONTRIBUTING.md](https://github.com/blvdgroup/boulevard/blob/master/CONTRIBUTING.md).

## Packages

Boulevard is managed as a monorepo with independent versioning.

### Core

| Package        | Version                                                                                       |
|----------------|-----------------------------------------------------------------------------------------------|
| `blvd`         | [![npm](https://img.shields.io/npm/v/blvd.svg)](https://npmjs.org/package/blvd)               |
| `blvd-server`  | [![npm](https://img.shields.io/npm/v/blvd-server.svg)](https://npmjs.org/package/blvd-server) |
| `blvd-client`  | [![npm](https://img.shields.io/npm/v/blvd-client.svg)](https://npmjs.org/package/blvd-client) |

The three core packages handle creating and serving a blvd server. Theoretically, you can use blvd just like this, but the view adapters make it much easier to write a client.

### View Adapters

| Package        | Version                                                                                         |
|----------------|-------------------------------------------------------------------------------------------------|
| `blvd-react`   | [![npm](https://img.shields.io/npm/v/blvd-react.svg)](https://npmjs.org/package/blvd-react)     |
| `blvd-angular` | [![npm](https://img.shields.io/npm/v/blvd-angular.svg)](https://npmjs.org/package/blvd-angular) |

The view adapters allow you to use the framework of your choice to write blvd apps.

### Database Adapters

| Package          | Version
|------------------|-----------------------------------------------------------------------------------------------------|
| `blvd-postgres`  | [![npm](https://img.shields.io/npm/v/blvd-postgres.svg)](https://npmjs.org/package/blvd-postgres)   |
| `blvd-mysql`     | [![npm](https://img.shields.io/npm/v/blvd-mysql.svg)](https://npmjs.org/package/blvd-mysql)         |
| `blvd-mongo`     | [![npm](https://img.shields.io/npm/v/blvd-mongo.svg)](https://npmjs.org/package/blvd-mongo)         |
| `blvd-sqlite`    | [![npm](https://img.shields.io/npm/v/blvd-sqlite.svg)](https://npmjs.org/package/blvd-sqlite)       |
| `blvd-cassandra` | [![npm](https://img.shields.io/npm/v/blvd-cassandra.svg)](https://npmjs.org/package/blvd-cassandra) |

Database adapters allow you to store models in a database, which is probably a good idea.

### Other

| Package      | Version                                                                                     |
|--------------|---------------------------------------------------------------------------------------------|
| `blvd-cli`   | [![npm](https://img.shields.io/npm/v/blvd-cli.svg)](https://npmjs.org/package/blvd-cli)     |
| `blvd-utils` | [![npm](https://img.shields.io/npm/v/blvd-utils.svg)](https://npmjs.org/package/blvd-utils) |

These other packages generally handle management of a blvd project.
