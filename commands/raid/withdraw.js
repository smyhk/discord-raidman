const Commando = require("discord.js-commando");
const Discord = require("discord.js");
const fs = require("fs");

module.exports = class WithdrawCommand extends Commando.Command {
    constructor(bot) {
        super(bot, {
            name: "withdraw",
            aliases: [],
            group: "raid",
            memberName: "withdraw",
            description: "Withdraws user from specified raid if signed up.",
            examples: ["withdraw raid"],
            clientPermissions: [],
            userPermissions: [],
            //guildOnly: true,

            args: [
                {
                    key: "raid",
                    prompt: "Please include a raid from which to withdraw.",
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
                if (err) return msg.reply(`${raid} raid does not exist, use list command to see available raids.`);

                let players = JSON.parse(data);
                if (!(msg.member.user.username in players)) {
                    return msg.reply("Player not found in signup list.");
                }

                let raidList = require(`../../${fileName}`);
                delete raidList[msg.member.user.username];

                fs.writeFile(`./${fileName}`, JSON.stringify(raidList, null, 4), err => {
                    if (err) console.log(err);
                    return msg.reply(`removed from ${raid} signups.`);
                });
            });
        } else {
            return msg.reply(`Please use this command in ${raidChan}`);
        }
    }
}