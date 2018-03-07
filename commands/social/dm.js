const Commando = require("discord.js-commando");

module.exports = class DmCommand extends Commando.Command {
    constructor(bot) {
        super(bot, {
            name: "dm",
            aliases: ["send"],
            group: "social",
            memberName: "dm",
            description: "Sends a direct message to the mentioned user",
            examples: ["dm @User Hi there!"],
            args: [
                {
                    key: "user",
                    prompt: "Which user to want to DM?",
                    type: "user"
                },
                {
                    key: "content",
                    prompt: "What would you like the message to be?",
                    type: "string"
                }
            ]
        });
    }
    
    async run(msg, { user, content }) {
        msg.delete();  // delete original message
        return user.send(content);
    }
};