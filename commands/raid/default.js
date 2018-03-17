const Commando = require("discord.js-commando");
const fs = require("fs");

module.exports = class DefaultCommand extends Commando.Command {
    constructor(bot) {
        super(bot, {
            name: "default",
            aliases: [],
            group: "raid",
            memberName: "default",
            description: "Sets default roles to be used for raids when roles not specified.",
            examples: ["default role"],
            clientPermissions: [],
            userPermissions: [],
            //guildOnly: true,

            args: [
                {
                    key: "role",
                    prompt: "You did not specify a role.",
                    type: "string",
                    default: "Dps"
                }
            ]
        });
    }

    async run(msg, args) {
        msg.delete();  // delete original message
        let player = msg.member;
        let role = args.role;
        
        let raidChan = msg.guild.channels.find(c => c.name === "raid-channel");
        if (msg.channel.id === raidChan.id) {

            // ensure defaults file exsists
            fs.readFile("./defaults.json", (err, data) => {
                if (err) return msg.say(`Raid defaults file does not exist.`);
                
                let defaults = JSON.parse(data);
                if (player in defaults) return msg.reply("already has default role.")
                
                let defaultRoles = require("../../defaults.json");
                defaultRoles[player] = {
                    role : role
                };

                fs.writeFile("./defaults.json", JSON.stringify(defaultRoles, null, 4), err => {
                    if (err) console.log(err);
                    return msg.reply(`registered ${role} as default role.`);
                });
            });
        } else {
            return msg.reply(`Please use this command in ${raidChan}`);
        }
    }
}