const Commando = require("discord.js-commando");
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

    processRaidData(msg, raid, content) {
        if (content === null) return `No users signed up for ${raid} raid.`;
        for (player of content) {
            // TODO: expand this after player signup is complete
            return msg.reply(player);
        }
    }

    async run(msg, args) {
        msg.delete();  // delete original message
        let raid = args.raid;
        let fileName = args.raid + ".json"
        let message = args.message;
        
        let raidChan = msg.guild.channels.find(c => c.name === "raid-channel");
        if (msg.channel.id === raidChan.id) {
            fs.readFile(`./${fileName}`, (err, data) => {
                if (err) {
                    return msg.reply(`Error: ${fileName} does not exist.`);
                }

                let content = data;
                this.processRaidData(msg, raid, content);

                fs.close(fd, (err) => {
                    if (err) throw err;
                });
            });
        } else {
            return msg.reply(`Please use this command in ${raidChan}`);
        }
    }
}