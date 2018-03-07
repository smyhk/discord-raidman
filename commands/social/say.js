const Commando = require("discord.js-commando");

module.exports = class SayCommand extends Commando.Command {
    constructor(bot) {
        super(bot, {
            name: "say",
            aliases: ["talk"],
            group: "social",
            memberName: "say",
            description: "Echos the user's message",
            examples: ["say Hi there!"],
            args: [
                {
                    key: "text",
                    prompt: "What text would you like the bot to say?",
                    type: "string"
                }
            ]
        });
    }
    
    async run(msg, args) {
        msg.delete();  // delete original message
        return msg.reply(args.text);
    }
};