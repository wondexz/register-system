const { MessageEmbed } = require('discord.js');
const config = require('../config.json');

module.exports = {
    name: 'kayıt',
    description: 'Belirtilen kullanıcıya isim, nick, yaş bilgisi verir ve belirtilen rolü verir.',
    execute(message, args) {
        if (args.length < 4) {
            return message.reply('Geçerli bir kullanıcı IDsi, isim, nick ve yaş belirtmelisiniz!');
        }

        if (!message.member.roles.cache.has(config.kayit_sorumlusu)) {
            return message.reply('Bu komutu kullanmak için gerekli izne sahip değilsiniz!');
        }

        const userID = args[0].replace(/[<>@!]/g, '');
        const user = message.guild.members.cache.get(userID);

        if (!user) {
            return message.reply('Geçerli bir kullanıcı IDsi belirtmelisiniz!');
        }

        const isim = args[1];
        const nick = args[2];
        const yas = args[3];

        const yeniIsim = `${isim} - ${nick} [${yas}]`;


        user.setNickname(yeniIsim)
            .then(() => {

                const role = message.guild.roles.cache.get(config.uye_rol);
                if (role) {
                    user.roles.add(role);
                }


                const logChannel = message.guild.channels.cache.get(config.log);
                if (logChannel) {
                    const embed = new MessageEmbed()
                        .setTitle('Kayıt yapıldı!')
                        .setDescription('Yeni bir kayıt yapıldı!')
                        .addFields(
                            { name: 'Kayıt olan kullanıcı', value: user.user.toString() },
                            { name: 'Kayıt olan kullanıcının yeni ismi', value: yeniIsim },
                            { name: 'Kaydı yapan yetkili', value: message.author.toString() }
                        )
                        .setColor('#2137af')
                        .setFooter(config.footer, config.footer_icon);

                    logChannel.send({ embeds: [embed] });
                }

                const replyEmbed = new MessageEmbed()
                    .setDescription(`<@${user.user.id}> Kişisinin kaydı ${message.author} tarafından yapıldı.`)
                    .setColor('#2137af')
                    .setFooter(config.footer, config.footer_icon);

                message.reply({ embeds: [replyEmbed] });
            })
            .catch(error => {
                console.error(error);
                message.reply('Bir hata oluştu, kullanıcı ismi değiştirilemedi!');
            });
    },
};
