const Discord = require("discord.js");
const PREFIX = "m!";
const YTDL = require("ytdl-core");
const antispam = require("discord-anti-spam");
const db = require("quick.db")
const economy = require("discord-eco")
const YouTube = require("simple-youtube-api")
const fortnite = require("fortnite")
const superagent = require("superagent")
const moment = require("moment")
const fs = require("fs")

var bot = new Discord.Client();

const modrole = "Modérateur";

var client = new Discord.Client();

const youtube = new YouTube("AIzaSyDE684AY4Th50yKvN7lZ9GroJiFvF5yjy8");

const queue = new Map();

function generateHex() {
    return "#" + Math.floor(Math.random() * 16777215).toString(16);
}

function roll() {
   return Math.floor(Math.random() * 99999) + 1;
}

var roll = Math.floor(Math.random() * 99999) + 1;

var fortunes = [
    "Oui.",
    "Non.",
    "Sûrment.",
    "Je ne pense pas.",
    "T'es malade ou quoi ? Jamais mec.",
    "Aspèrge",
    "Je sais pas.",
    "Pourquoi tu me demandes ça ?"
];


var servers = {};

bot.on("ready", function () {
        bot.user.setActivity("Killing floor 2", {url:"https://www.twitch.tv/zelkibot", type: "PLAYING"})
    console.log("Je suis prêt à me rendre sur " + bot.guilds.size + " serveur(s) ! Sous le pseudo de " + bot.user.username + " !");
});

bot.on("guildMemberAdd", member => {
})

bot.on("guildMemberRemove", function(member) {

});

bot.on("message", async function(message) {

    if (message.author.equals(bot.user)) return;

    if (!message.content.startsWith(PREFIX)) return;

    var args = message.content.substring(PREFIX.length).split (" ");

    var args2 = message.content.split(" ").slice(1);

    var suffix = args2.join(" ");

    var reason = args2.slice(1).join(" ");

    var user = message.mentions.users.first();

    var guild = message.guild;

    var member = message.member;

    var rolemodo = member.guild.roles.find("name", "Modo")

    var rolehelper = member.guild.roles.find("name", "Helper")

    var roleyoutube = member.guild.roles.find("name", "YOUTUBE")
    
    var rolefriend = member.guild.roles.find("name", "AMIGO")

    var rolemute = member.guild.roles.find("name", "Mute")

    var modlog = member.guild.channels.find("name", "mod-log")

    var midlemanrole = member.guild.roles.find("name", "Midleman")

    var regleschannel = member.guild.channels.find("name", "regles")

    var cont = message.content.slice(PREFIX.length).split(" ");

    var args3 = cont.slice(1);
    
    const serverQueue = queue.get(message.guild.id);

    const url = args[1] ? args[1].replace(/<(.+)>/g, '$1') : '';
    switch (args[0].toLowerCase()) {
        case "unmute":
        if (!message.member.roles.find("name", modrole)) {
                    message.channel.send("Tu as besoin du role `" + modrole + "` pour faire cette commande.");
                return;
                }
        if(!modlog) return message.reply("Je ne trouve pas de channel mod-log.");
        var member = message.mentions.members.first();
        if (message.mentions.users.size < 1) return message.reply("Tu as oublié de préciser qui je dois unmute.")
        if (reason.length < 1) return message.reply("Tu as oublié la raison.");
        member.removeRole(rolemute)
        message.channel.send("Il a bien été unmute !")
        break;
        case "mute":
        if (!message.member.roles.find("name", modrole)) {
            message.channel.send("Tu as besoin du role `" + modrole + "` pour faire cette commande.");
        return;
        } 
        let time = parseInt(args2[1]) * 60000;
        if (message.mentions.users.size < 1) return message.reply("Tu as oublié de préciser qui je dois Mute.")
        if(!time) return message.reply("Tu as oublié le temps.")
        if (!reasontimed) return message.reply("Tu as oublié la raison.")
        var member = message.mentions.members.first();
        message.channel.send(member.toString() + " a bien été mute. ✅")
        member.addRole(roleMute)
        setTimeout(() => { member.removeRole(roleMute); }, time);
        break;
        case "averto":
        if (!message.member.roles.find("name", modrole)) {
            message.channel.send("Tu as besoin du role `" + modrole + "` pour faire cette commande.");
        return;
        }
            var member = message.mentions.members.first();
            if (message.mentions.users.size < 1) return message.reply("Tu as oublié de préciser à qui je dois ajouter le grade Averto.")
            member.addRole(member.guild.roles.find("name", "Averto'"))
            user.send(message.author.toString() + " t'a ajouté le grade Averto', il fallait faire attention !");
            break;
            case "averto2":
            if (!message.member.roles.find("name", modrole)) {
                message.channel.send("Tu as besoin du role `" + modrole + "` pour faire cette commande.");
            return;
            }
            var member = message.mentions.members.first();
            if (message.mentions.users.size < 1) return message.reply("Tu as oublié de préciser à qui je dois ajouter le grade 2ième averto'.")
            member.addRole(member.guild.roles.find("name", "2ième averto'"))
            user.send(message.author.toString() + " t'a ajouté le grade 2ième averto', commence à faire attention !");
            break;
        case "bolosse":
        if (!message.member.roles.find("name", modrole)) {
            message.channel.send("Tu as besoin du role `" + modrole + "` pour faire cette commande.");
        return;
        }
            var member = message.mentions.members.first();
            if (message.mentions.users.size < 1) return message.reply("Tu as oublié de préciser à qui je dois ajouter le grade Bolosse.")
            member.addRole(member.guild.roles.find("name", "Bolosse"))
            user.send(message.author.toString() + " t'a ajouté le grade Bolosse, il fallait faire attention, maintenant il faut assumer !");
            break;
        case "help":
            member.send(`
__***Commandes disponibles sur le bot.***__

__**Informations**__
**photo** : Voir la photo de profil de quelqu'un. Utilsation : _photo @utilisateur
**userinfo** : Informations sur un utilisateur. Utilisation : _userinfo @utilisateur
**serverinfo** : Informations sur le serveur sur le quel tu te trouves.

__**Modération**__
**mute** : Mute un utilisateur. Utilisation : _mute @utilisatuer <temps en minutes> <raison>
**unmute** : Unmute un utilisateur. Utilisation : _unmute @utilisateur
**purge** : Supprimer un certain nombre de messages. Utilisation : _purge <nombre de messages (minimum 2 et maximum 100).>
            `)
            message.react("✅")
            message.channel.send(member.toString() + " Je t'ai envoyé les commandes en MP !")
            break;
        case "userinfo":
            if (message.mentions.users.size < 1) return message.reply("Tu as oublié de préciser de qui je dois montrer les informations.")
            var embed = new Discord.MessageEmbed()
                .addField("Pseudo", user.tag)
                .addField("Surnom", user.nickname || "none")
                .addField("ID", user.id)
                .addField("Compte créer le", user.createdAt)
                .addField("Roles", message.guild.member(user).roles.sort().map(role => role).join(" | "))
                .setThumbnail(user.avatarURL)
                .setColor(0xff80ff)
                .setAuthor(message.author.username, message.author.avatarURL)
                .setFooter("Voilà.", message.author.avatarURL)
                .setTimestamp()
            message.channel.send(embed);
            break;
        case "photo":
            if (message.mentions.users.size < 1) return message.reply("Tu as oublié de préciser de qui je dois montrer la photo de profil.")
            message.channel.send(user.avatarURL)
            break;
        case "purge":
            if (!message.member.roles.find("name", modrole)) {
                    message.channel.send("Tu as besoin du role `" + modrole + "` pour faire cette commande.");
                return;
                }
            var messagecount = parseInt(args2.join(" "));
            message.channel.bulkDelete(messagecount);
            break;
        case "serverinfo":
            var embed = new Discord.MessageEmbed()
            .setAuthor("Informations sur le serveur `" + message.guild.name + "`")
            .setThumbnail(message.guild.iconURL)
            .setFooter(message.guild.owner.user.tag, message.guild.owner.user.avatarURL)
            .addField("Membres", message.guild.memberCount)
            .addField("Channels", message.guild.channels.filter(chan => chan.type === "voice").size + " channels vocaux " + message.guild.channels.filter(chan => chan.type === "text").size + " channels textuels")
            .addField("Roles", message.guild.roles.map(role => role.toString()).join(" | "))
            .addField("Créateur", message.guild.owner.user.toString())
            .addField("Channel AFK", message.guild.afkChannel)
            .addField("Créer le", message.guild.createdAt)
            .addField("ID du serveur", message.guild.id)
            .addField("Region", message.guild.region)
            message.channel.send(embed)
            break;
            default:
            message.channel.send("Commande invalide ^^")
    }
});

function play(guild, song) {
    const serverQueue = queue.get(guild.id);

    if (!song) {
        serverQueue.voiceChannel.leave();
        queue.delete(guild.id);
        return;
    }

    const dispatcher = serverQueue.connection.playStream(YTDL(song.url))
    .on('end', () => {
        console.log("Le son est fini !");
        serverQueue.songs.shift();
        play(guild, serverQueue.songs[0]);
    })
    .on('error', error => console.error(error));
dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);

var embed = new Discord.MessageEmbed()
.setTimestamp()
.addField("Musique jouée :", `[${song.title}](${song.url})`)
.setImage(song.thumbnail)
.setColor("0x00ff00")
serverQueue.textChannel.send(embed)
}

bot.login(process.env.TOKEN);
