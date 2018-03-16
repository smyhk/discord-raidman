const Commando = require("discord.js-commando");
const fs = require("fs");

module.exports = class OpenRaidCommand extends Commando.Command {
    constructor(bot) {
        super(bot, {
            name: "openraid",
            aliases: ["open", "or"],
            group: "raid",
            memberName: "openraid",
            description: "Creates text file to hold names and roles for sign ups",
            examples: ["openraid raidName [Raid message to channel]"],
            clientPermissions: [],
            userPermissions: [],
            //guildOnly: true,

            args: [
                {
                    key: "raid",
                    prompt: "You did not specify a file or raid name.",
                    type: "string",
                },
                {
                    key: "message",
                    prompt: "You did not specify a raid message.",
                    type: "string",
                    default: ""
                }
            ]
        });
    }

    async run(msg, args) {
        msg.delete();  // delete original message
        let raid = args.raid;
        let fileName = args.raid + ".json"
        let message = args.message;
        
        let raidChan = msg.guild.channels.find(c => c.name === "raid-channel");
        if (msg.channel.id === raidChan.id) {
            fs.open(`./${fileName}`, 'wx', (err, fd) => {
                if (err) {
                    if (err.code === "EEXIST") {
                        return msg.reply(`File Name ${fileName} already exists, use another name or clear the raid.`)
                    }
                }
                fs.write(fd, "{}", 0, (err) => {
                    if (err) console.log(err);
                });
                
                fs.close(fd, (err) => {
                    if (err) throw err;
                });
            });

            if (!message) {
                return msg.reply(`Raid signups now open for ${raid}!"`);
            } else {
                return msg.reply(message);
            }
        } else {
            return msg.reply(`Please use this command in ${raidChan}`);
        }
    }
}