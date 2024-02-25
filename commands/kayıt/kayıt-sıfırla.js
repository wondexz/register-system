const { EmbedBuilder, PermissionFlagsBits } = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const db = require('croxydb');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("kayıt-sıfırla")
        .setDescription("🛂 • Kayıt sistemini sıfırlar"),

    run: async (client, interaction) => {
        const guild = interaction.guild;

        if (!(interaction.member.permissions.has(PermissionFlagsBits.ManageRoles))) {
            const embed = new EmbedBuilder()
                .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
                .setDescription('Bu komutu kullanma yetkiniz bulunmamaktadır.')
                .setColor('Red')
                .setFooter({ text: `${client.user.username} ©️ Tüm hakları saklıdır.`, iconURL: client.user.displayAvatarURL({ dynamic: true }) });

            return interaction.reply({ embeds: [embed], ephemeral: true });
        }

        if (!db.has(`kayitKanal_${guild.id}`)) {
            const embed = new EmbedBuilder()
                .setColor('Red')
                .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
                .setDescription('Sunucuda zaten bir kayıt sistemi bulunmamaktadır.')
                .setFooter({ text: `${client.user.username} ©️ Tüm hakları saklıdır.`, iconURL: client.user.avatarURL() })
                .setTimestamp();

            return interaction.reply({ embeds: [embed], ephemeral: true });
        }

        db.delete(`kayitKanal_${guild.id}`);
        db.delete(`kayitLog_${guild.id}`);
        db.delete(`kayitUyeRol_${guild.id}`);

        const embed = new EmbedBuilder()
            .setColor('#2137af')
            .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
            .setDescription('Kayıt sistemi başarıyla sıfırlandı.')
            .setFooter({ text: `${client.user.username} ©️ Tüm hakları saklıdır.`, iconURL: client.user.avatarURL() })
            .setTimestamp();

        interaction.reply({ embeds: [embed] });
    },
};
