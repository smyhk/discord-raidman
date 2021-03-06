const Commando = require("discord.js-commando");
const fs = require("fs");
signUps = 0;

module.exports = class SignupCommand extends Commando.Command {
    constructor(bot) {
        super(bot, {
            name: "signup",
            aliases: ["su"],
            group: "raid",
            memberName: "signup",
            description: "Signs user up for specified raid with specified roles. Uses defualt roles if none specified.",
            examples: ["signup raid [role]"],
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
                    key: "role",
                    prompt: "You did not specify a role.",
                    type: "string",
                    default: ""
                }
            ]
        });
    }

    async run(msg, args) {
        msg.delete();  // delete original message
        let maxSignups = 11;
        let raid = args.raid;
        let fileName = args.raid + ".json";
        let player = msg.member;
        let role = args.role;
        
        let raidChan = msg.guild.channels.find(c => c.name === "raid-channel");
        if (msg.channel.id === raidChan.id) {
            if (signUps >= maxSignups) {
                return msg.reply("Raid is full! Signed up as overflow.")
            }

            // ensure raid file exsists and make sure player only signs up once
            fs.readFile(`./raids/${fileName}`, (err, data) => {
                if (err) return msg.say(`Raid for ${raid} does not exist.`);
                
                let raiders = JSON.parse(data);
                if (player.user.username in raiders) return msg.reply("Only one signup allowed per person. You have already signed up.")
                let raidList = require(`../../raids/${fileName}`);
                if (role === "" || role === null) {
                    fs.readFile("./defaults.json", (err, data) => {
                        if (err) console.log(err);
    
                        let defaults = JSON.parse(data);
                        if (player in defaults) {
                            role = defaults[player]["role"];
                        }
                        else {
                            role = "Dps"; // default role if none specified or in defaults file
                        }
                        raidList[msg.member.user.username] = {
                            role: role,
                            id: "<@" + msg.member.id + ">"
                        };

                        fs.writeFile(`./raids/${fileName}`, JSON.stringify(raidList, null, 4), err => {
                            if (err) console.log(err);
                            return msg.reply(`has signed up as ${role}`);
                        });
                    });
                } else {
                    raidList[msg.member.user.username] = {
                        role: role,
                        id: "<@" + msg.member.id + ">"
                    };

                    fs.writeFile(`./raids/${fileName}`, JSON.stringify(raidList, null, 4), err => {
                        if (err) console.log(err);
                        return msg.reply(`has signed up as ${role}`);
                    });
                }
            });
            signUps++;
        } else {
            return msg.reply(`Please use this command in ${raidChan}`);
        }
    }
}