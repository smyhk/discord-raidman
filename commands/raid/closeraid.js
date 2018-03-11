const Commando = require("discord.js-commando");
const fs = require("fs");

module.exports = class CloseRaidCommand extends Commando.Command {
    constructor(bot) {
        super(bot, {
            name: "closeraid",
            aliases: ["clearraid", "clear", "close", "cr"],
            group: "raid",
            memberName: "closeraid",
            description: "Deletes signups for specified raid",
            examples: ["closeraid fileName", "clear fileName"],
            clientPermissions: [],
            userPermissions: [],
            //guildOnly: true,

            args: [
                {
                    key: "raid",
                    prompt: "Please enter the file name with the command.",
                    type: "string",
                }
            ]
        });
    }

    async run(msg, args) {
        msg.delete();  // delete original message
        let raid = args.raid;
        let fileName = args.raid + ".json"

        let raidChan = msg.guild.channels.find(c => c.name === "raid-channel");
        if (msg.channel.id === raidChan.id) {
            fs.unlink(`./${fileName}`, (err) => {
                if (err) return msg.reply(`Error ${fileName} does not exist.`);
                return msg.reply(`Deleted ${fileName} successfully.`)
            });
            signUps = 0;  // reset signup counter
        } else {
            return msg.reply(`Please use this command in ${raidChan}`);
        }
    }
}