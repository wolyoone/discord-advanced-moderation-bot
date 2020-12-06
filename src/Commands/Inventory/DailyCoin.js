const { Message, Client, MessageEmbed } = require("discord.js");
const User = require("../../Utils/Schemas/User");
const InventoryManager = require("../../Utils/Managers/Inventory/InventoryManager");

const moment = require("moment");
require("moment-duration-format");
require("moment-timezone");


/**
 * @param {Client} client 
 * @param {Message} message 
 * @param {Array<String>} args 
 */
module.exports.execute = async (client, message, args) => {
    let user = await User.findOrCreate(message.author.id);

    if(user.DailyCoin){
        let nextDay = user.DailyCoin + (1000 * 60 * 60 * 24 * 1);
        if(Date.now() < nextDay){
            return message.reply(`yeni puan almak için **${moment.duration((nextDay - Date.now())).format("HH:mm:ss")} saat** beklemen gerekiyor!`);
        }
    }
    User.updateOne({_id: user._id}, {$set: {"DailyCoin": Date.now()}, $inc: {"Coin": 50}}).exec();
    message.reply(`günlük :coin:**${InventoryManager.Number(50)}** aldın!`);
}

module.exports.settings = {
    Commands: ["dailycoin"],
    Usage: "",
    Description: "",
    cooldown: 5000,
    Activity: true
}