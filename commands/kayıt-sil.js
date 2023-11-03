const { MessageEmbed } = require('discord.js');
const config = require('../config.json');

module.exports = {
  name: 'kayıt-sil',
  description: 'Belirtilen kullanıcının belirli bir rol dışındaki bütün rollerini alır ve ismini siler.',
  async execute(message, args) {
    const kayitSorumlusuRolID = config.kayit_sorumlusu;
    const logChannelID = config.log;
    const belirliRolID = config.booster_rol;

    if (!message.member.roles.cache.has(kayitSorumlusuRolID)) {
      return message.reply('Bu komutu kullanma izniniz yok.');
    }

    const targetUser = message.mentions.users.first() || message.client.users.cache.get(args[0]);

    if (!targetUser) {
      return message.reply('Kullanıcı bulunamadı.');
    }

    const targetMember = message.guild.members.cache.get(targetUser.id);


    const eskiRoller = targetMember.roles.cache
      .filter(role => role.id !== belirliRolID)
      .map(role => `<@&${role.id}>`);

    const eskiIsim = targetMember.nickname || targetMember.user.username || 'İsim Belirtilmemiş';

    if (eskiRoller.length > 0 || eskiIsim) {
      await targetMember.roles.set([belirliRolID]);
      await targetMember.setNickname('');


      const logEmbed = new MessageEmbed()
        .setTitle('Kullanıcı Kaydı Silindi')
        .setDescription(`<@${targetMember.user.id}> kullanıcısının kaydı <@${message.author.id}> tarafından silindi.`)
        .addFields(
          { name: 'Eski Roller', value: eskiRoller.length > 0 ? eskiRoller.join(', ') : 'Hiçbir Rol Yok' },
          { name: 'Eski İsim', value: eskiIsim }
        )
        .setTimestamp()
        .setColor('#2137af')
        .setFooter(config.footer, config.footer_icon);

      const logChannel = message.guild.channels.cache.get(logChannelID);
      if (logChannel) {
        logChannel.send({ embeds: [logEmbed] })
          .then(() => {
            message.reply(`<@${targetMember.user.id}>, kullanıcısı sınır kapısına atıldı!`);
          })
          .catch(error => {
            console.error('Embed mesajı gönderirken bir hata oluştu:', error);
          });
      } else {
        console.error('Log kanalı bulunamadı.');
      }
    } else {
      message.reply('Gönderilecek mesaj bulunamadı.');
    }
  },
};
