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
        let dps = 0;
        let tank = 0;
        let heals = 0;
        let raiders = [];
        let  counter = 0;
        
        let raidChan = msg.guild.channels.find(c => c.name === "raid-channel");
        if (msg.channel.id === raidChan.id) {
            fs.readFile(`./raids/${fileName}`, (err, data) => {
                if (err) return msg.reply(`Error: ${fileName} does not exist.`);

                let players = JSON.parse(data);
                if (Object.keys(players).length === 0)
                    return msg.say(`No players signed up for ${raid}`);
                
                for (let key in players) {
                    if (players.hasOwnProperty(key)) {
                        let role = players[key].role;
                        switch (role) {
                            case "Tank":
                                tank++;
                                break;
                            case "Dps":
                                dps++;
                                break;
                            case "Heals":
                                heals++;
                                break;
                            default:
                                msg.reply("Why are there no roles? Check your raid file.");
                        }
                        raiders += players[key].id + " ";
                        counter++;
                    }
                }

                const embed = new Discord.RichEmbed()
                    .setDescription(`Status for ${raid} raid:`)
                    .setAuthor(msg.author.username, msg.author.displayAvatarURL)
                    .setColor(0x00AE86)
                    .addField("Players: ", raiders)
                    .addField("Role and player count: ", 
                        `${dps} dps, ${tank} tank(s), ${heals} healer(s) signed up. Total raiders: ${counter}`);
                
                return msg.embed(embed);
            });
        } else {
            return msg.reply(`Please use this command in ${raidChan}`);
        }
    }
}