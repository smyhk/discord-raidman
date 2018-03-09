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
                    // validate: text => {
                    //     let m = text.split(" ");
                    //     if (m[1]) return "Name for text file / name of raid, one word only."
                    //     else return true;
                    // }
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
            if (!message) {
                return msg.reply(`Raid signups now open for ${raid}!"`);
            } else {
                msg.reply(message);
            }
        } else {
            return msg.reply(`Please use this command in ${raidChan} to sign up!`);
        }

        fs.open(`./${fileName}`, 'wx', (err, fd) => {
            if (err) {
                if (err.code === "EEXIST") {
                    return msg.reply(`File Name ${fileName} already exists, use another name or clear the raid.`)
                }
                throw err;
            }
            fs.close(fd, (err) => {
                if (err) throw err;
            });
        });
    }
}