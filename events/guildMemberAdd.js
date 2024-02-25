const { Client, GatewayIntentBits, PermissionFlagsBits, Events, Collection, EmbedBuilder, Guild, member } = require("discord.js");
const db = require("croxydb");

module.exports = {
    name: Events.GuildMemberAdd,
    execute: async (member) => {
        const welcomeChannelId = db.get(`kayitKanal_${member.guild.id}`) || null;
        const avatar404 = 'https://cdn.wondexz.cloud/discord.png';
        const hesapolusturulmatarihi = member.user.createdAt.toLocaleDateString('tr-TR');

        const embed = new EmbedBuilder()
        .setAuthor( { name: `${member.user.tag} - Sunucuya Katıldı`, iconURL: member.user.avatarURL() } )
        .setDescription(`> Sunucumuza Hoşgeldin <@${member.user.id}>!\n\n> Seninle birlikte ${member.guild.memberCount} kişiye ulaştık\n\n> Hesabın ${hesapolusturulmatarihi} tarihinde oluşturulmuş.`)
        .setColor('#0200ff')
        .setThumbnail(member.user.avatarURL() || avatar404)
        .setFooter( { text: `ID: ${member.user.id}` } )
        .setTimestamp();
    
        if (welcomeChannelId) {
            member.guild.channels.cache.get(welcomeChannelId).send({ embeds: [embed] });
        }
    }
};
