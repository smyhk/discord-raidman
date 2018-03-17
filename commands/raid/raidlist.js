const Commando = require("discord.js-commando");
const fs = require("fs");

module.exports = class RaidListCommand extends Commando.Command {
    constructor(bot) {
        super(bot, {
            name: "raidlist",
            aliases: ["list"],
            group: "raid",
            memberName: "raidlist",
            description: "Lists raids availble for signups.",
            examples: ["raidlist", "list"],
            clientPermissions: [],
            userPermissions: [],
            //guildOnly: true,
        });
    }

    async run(msg, args) {
        msg.delete();  // delete original message
        
        let raidChan = msg.guild.channels.find(c => c.name === "raid-channel");
        if (msg.channel.id === raidChan.id) {
            fs.readdir("./raids/", (err, files) => {
                if (err) {
                    console.log(err);
                    return;
                }

                let raidFiles = files.filter(f => f.split(".").pop() === "json");
                if (raidFiles.length <= 0) {
                    return msg.reply("No raids available.");
                }

                let raids = [];
                raidFiles.forEach((f) => {
                    raids += f.replace(".json", ", ");
                });
                
                raids = raids.replace(/,(?=[^,]*$)/, "")  // remove trailing comma
                return msg.say("Available raids: " + raids);
            });
        } else {
            return msg.reply(`Please use this command in ${raidChan}`);
        }
    }
}