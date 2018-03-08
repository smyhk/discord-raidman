const Commando = require("discord.js-commando");

module.exports = class SayCommand extends Commando.Command {
    constructor(bot) {
        super(bot, {
            name: "say",
            aliases: ["talk", "echo"],
            group: "social",
            memberName: "say",
            description: "Echos the user's message",
            examples: ["say Hi there!"],
            clientPermissions: ['MANAGE_MESSAGES'],
            userPermissions: ['MANAGE_MESSAGES'],
            guildOnly: true,
            throttling: {
                usages: 2,   // can be used 2 times
                duration: 10 // in a 10 seconc period
            },
            args: [
                {
                    key: "text",
                    prompt: "What text would you like the bot to say?",
                    type: "string",
                    validate: text => {
                        if (text.length < 201) return true;
                        return "Message conent is above 200 characters."
                    }
                }
            ]
        });
    }

    // Check user permissions; this checks that command user is bot owner
    hasPermission(msg){
        if (!this.client.isOwner(msg.author)) return "Only bot owner(s) may use this.";
        return true;
    }
    
    async run(msg, args) {
        msg.delete();  // delete original message
        return msg.reply(args.text);
    }
};