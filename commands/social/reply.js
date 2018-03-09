const Commando = require("discord.js-commando");

module.exports = class ReplyCommand extends Commando.Command {
    constructor(bot) {
        super(bot, {
            name: "reply",
            aliases: ["hello"],
            group: "social",
            memberName: "reply",
            description: "Replies with a message.",
            examples: ["reply"]
        });
    }
    
    async run(msg) {
        return msg.reply("Hi, I\'m awake!");
    }
};