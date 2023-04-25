import { Client } from "discord.js-selfbot-v13";
import { AhniClient } from 'ahnidev';
import delay from "delay";
import config from "./config.json" assert { type: "json" };
const Ahni = new AhniClient({KEY: config.ahni.key, url: config.ahni.url })
const client = new Client();

client.on("ready", async()=>{
	console.log("Bot is connected to WS")
});

client.on("messageCreate", async(message)=>{
		if (message.author.bot || message.author.id == client.user.id || !message.guildId) return;
		let member = new RegExp(/(?:<@)\d*(?:>)/gm);
		console.log(config.guilds[0][message.guild.id])
		let m = config.guilds[0][message.guild.id]?.welcome?.isEmbed == true ? message.embeds[0]?.description?.match(member) : message.content.match(member);
		if (config.guilds[0][message.guild.id] && m !== null && config.guilds[0][message.guild.id].welcome.channelId == message.channel.id && config.guilds[0][message.guild.id]?.welcome?.botId !== "undefined" && message.author.id == config.guilds[0][message.guild.id].welcome.botId){
		if (!message.embeds[0]?.description?.match(member)) return;
				await message.channel.sendTyping()
				await delay(3000);
				return message.channel.send(`${config.guilds[0][message.guild.id]?.welcome?.message.replace("$user", message.author.toString())}`);
		} else {
			if (config.guilds[0][message.guild.id] && config.guilds[0][message.guild.id].welcome.channelId == message.channel.id && message.system == true && config.guilds[0][message.guild.id].welcome.isSystem == true){
				await message.channel.sendTyping()
				await delay(3000);
			return message.channel.send(`${config.guilds[0][message.guild.id]?.welcome?.message.replace("$user", message.author.toString())}`);
			}
		}
		if(!config.guilds[0][message.guild.id] || config.guilds[0][message.guild.id] && config.guilds[0][message.guild.id].ai !== true) return;
		if (message.mentions.repliedUser?.id == client.user.id || message.content.startsWith("<@!"+client.user.id+">") || message.content.startsWith("<@"+client.user.id+">")){
		const content = message.content.slice("<@"+client.user.id+">".length).trim().split(/ +/).join("%20").replace("<@"+client.user.id+">%20", "").replace("<@"+client.user.id+">", "");
		if (content.length <= 1) return;
		await Ahni.chat(content, message.author.id).then(async result => {
		if (!result) return;
		await message.channel.sendTyping()
		await delay(3500);
		message.reply({content: result, allowedMentions: {parse: []}})
		});
		}
})
client.login(config.token);
