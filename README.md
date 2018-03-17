# Discord Raid Manager Bot

Easily manage multiple raids with signups and default roles, i.e., tank, dps, or healer.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### Prerequisites

* Nodejs - You will need to install Nodejs.
* Discord account - You will need to have a Discord account and own a server, or have an admin role for a server you do not own.

## Deployment

Run from the root directory of the project:
```
$ node bot
```

This bot can easily be deployed to a cloud servce like Heroku.
```
$ echo "worker: node bot.js" > Procfile
```
```
$ git add .
```
```
$ git commit -m "Add Heroku Procfile"
```
```
$ heroku create
```
```
$ git push heroku master
```
```
$ heroku ps:scale worker=0
```

## Built With

* [Nodejs](https://nodejs.org/en/docs/) - *The* JavaScript runtime
* [discord.js](https://discord.js.org/#/docs/main/stable/general/welcome) - Discord API wrapper
* [discord.js-commando](https://discord.js.org/#/docs/commando/master/general/welcome) - Command framework for discord.js

## Contributing

Please read [CONTRIBUTING.md](https://gist.github.com/) for details on our code of conduct, and the process for submitting pull requests to us.

## Versioning

We use [SemVer](http://semver.org/) for versioning. For the versions available, see the [tags on this repository](https://github.com/smyhk/discord-raidman/tags). 

## Authors

* **Steven Kedzie** - *smyhk* - [SmyhkTech](https://github.com/smyhk)

See also the list of [contributors](https://github.com/smyhk/discord-raidman/contributors) who participated in this project.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details

## Acknowledgments

