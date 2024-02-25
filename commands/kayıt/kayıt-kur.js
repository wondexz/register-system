const { EmbedBuilder, PermissionFlagsBits } = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const db = require('croxydb');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("kayıt-kur")
        .setDescription("🛂 • Kayıt sistemini kurar")
        .addChannelOption(option =>
            option.setName('kayıt-kanalı')
                .setRequired(true)
                .setDescription('Kayıt kanalını seçin'))
                .addChannelOption(option =>
                    option.setName('log-kanalı')
                        .setRequired(true)
                        .setDescription('Log kanalını seçin'))
                        .addRoleOption(option =>
                            option.setName('üye-rolü')
                                .setRequired(true)
                                .setDescription('Üye rolünü seçin')),

    run: async (client, interaction) => {
        if (!(interaction.member.permissions.has(PermissionFlagsBits.ManageRoles))) {
            const embed = new EmbedBuilder()
                .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
                .setDescription('Bu komutu kullanma yetkiniz bulunmamaktadır.')
                .setColor('Red')
                .setFooter({ text: `${client.user.username} ©️ Tüm hakları saklıdır.`, iconURL: client.user.displayAvatarURL({ dynamic: true }) });

            return interaction.reply({ embeds: [embed], ephemeral: true });
        }

        const guild = interaction.guild;
        const kayitKanal = interaction.options.getChannel('kayıt-kanalı');
        const logKanal = interaction.options.getChannel('log-kanalı');
        const kayitUye = interaction.options.getRole('üye-rolü');

        if (db.has(`kayitKanal_${guild.id}`) || db.has(`kayitLog_${guild.id}`) || db.has(`kayitUyeRol_${guild.id}`)) {
            const embed = new EmbedBuilder()
                .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
                .setDescription('Bu sunucu için zaten bir kayıt sistemi kurulmuş.')
                .setColor('Red')
                .setFooter({ text: `${client.user.username} ©️ Tüm hakları saklıdır.`, iconURL: client.user.displayAvatarURL({ dynamic: true }) });

            return interaction.reply({ embeds: [embed], ephemeral: true });
        }
        
        db.set(`kayitKanal_${guild.id}`, kayitKanal.id)
        db.set(`kayitLog_${guild.id}`, logKanal.id)
        db.set(`kayitUyeRol_${guild.id}`, kayitUye.id)

        const embed = new EmbedBuilder()
            .setColor('#2137af')
            .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
            .setDescription('Kayıt sistemi başarıyla kuruldu.')
            .setFooter({ text: `${interaction.user.tag} tarafından istendi.`, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
            .setTimestamp();

            const logEmbed = new EmbedBuilder()
            .setAuthor( { name: `${client.user.username} - Kayıt Sistemi`, iconURL: client.user.avatarURL() } )
            .setDescription(`Kayıt sistemi kuruldu!\n\n**•** Kayıt Kanalı - <#${kayitKanal.id}>\n**•** Log Kanalı - <#${logKanal.id}>\n**•** Üye Rolü - <@&${kayitUye.id}>`)
            .setFooter( { text: `Sistemi kuran yetkili: ${interaction.user.tag}`, iconURL: interaction.user.avatarURL() } )
            .setColor('Green')
            .setTimestamp();

            logKanal.send( { embeds: [logEmbed] } )
        interaction.reply({ embeds: [embed] });
    },
};
