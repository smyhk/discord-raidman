const Commando = require("discord.js-commando");
const Discord = require("discord.js");
const fs = require("fs");

module.exports = class RolecallCommand extends Commando.Command {
    constructor(bot) {
        super(bot, {
            name: "rolecall",
            aliases: ["rc"],
            group: "raid",
            memberName: "rolecall",
            description: "Mentions users signed up for specified raid with a message that raid is forming.",
            examples: ["rolecall raid", "rc raid"],
            clientPermissions: [],
            userPermissions: [],
            //guildOnly: true,

            args: [
                {
                    key: "raid",
                    prompt: "Please enter the raid name with the command.",
                    type: "string"
                }
            ]
        });
    }

    async run(msg, args) {
        msg.delete();  // delete original message
        let raid = args.raid;
        let fileName = args.raid + ".json";
        
        let raidChan = msg.guild.channels.find(c => c.name === "raid-channel");
        if (msg.channel.id === raidChan.id) {
            fs.readFile(`./${fileName}`, (err, data) => {
                if (err) return msg.reply(`Error: ${fileName} does not exist.`);

                let players = JSON.parse(data);
                for (var key in players) {
                    if (players.hasOwnProperty(key)) {
                        msg.say(players[key].id);
                    }
                }
                return msg.say(`Forming up for ${raid}! Time to log in.`);
                
            });
        } else {
            return msg.reply(`Please use this command in ${raidChan}`);
        }
    }
}