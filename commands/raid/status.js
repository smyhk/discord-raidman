const Commando = require("discord.js-commando");
const Discord = require("discord.js");
const fs = require("fs");

module.exports = class StatusCommand extends Commando.Command {
    constructor(bot) {
        super(bot, {
            name: "status",
            aliases: [],
            group: "raid",
            memberName: "status",
            description: "Lists players and roles signed up for specified raid.",
            examples: ["status raid"],
            clientPermissions: [],
            userPermissions: [],
            //guildOnly: true,

            args: [
                {
                    key: "raid",
                    prompt: "Please include the name of raid to get status for.",
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
                if (players === null) return msg.say(`No players signed up for ${raid}`);
                for (let key in players) {
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