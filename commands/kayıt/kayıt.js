const { EmbedBuilder, PermissionFlagsBits } = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const db = require('croxydb');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("kayıt")
        .setDescription("🛂 • Kayıt edersin")
        .addUserOption(option =>
            option.setName('kullanıcı')
                .setDescription('Kayıt edilecek kullanıcıyı seçin')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('isim')
                .setDescription('Kullanıcının ismi')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('yaş')
                .setDescription('Kullanıcının yaşı')
                .setRequired(true)),

    run: async (client, interaction) => {
        if (!(interaction.member.permissions.has(PermissionFlagsBits.ManageRoles))) {
            const embed = new EmbedBuilder()
                .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
                .setDescription('Bu komutu kullanmak için `Rolleri Yönet` iznine sahip olmalısınız.')
                .setColor('Red')
                .setFooter({ text: `${client.user.username} ©️ Tüm hakları saklıdır.`, iconURL: client.user.displayAvatarURL({ dynamic: true }) });

            return interaction.reply({ embeds: [embed], ephemeral: true });
        }

        if (!db.has(`kayitKanal_${interaction.guild.id}`)) {
            const embed = new EmbedBuilder()
                .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
                .setDescription('Kayıt sistemi kurulu değil. Kayıt sistemini kurmak için `/kayıt-kur` komutunu kullanabilirsin.')
                .setColor('Red')
                .setFooter({ text: `${client.user.username} ©️ Tüm hakları saklıdır.`, iconURL: client.user.displayAvatarURL({ dynamic: true }) });

            return interaction.reply({ embeds: [embed], ephemeral: true });
        }

        const targetUser = interaction.options.getUser('kullanıcı');
        const isim = interaction.options.getString('isim');
        const yas = interaction.options.getString('yaş');

        const guild = interaction.guild;
        const targetMember = guild.members.cache.get(targetUser.id);

        try {
            await targetMember.setNickname(`${isim} [${yas}]`);
        } catch (error) {
            console.error('Error setting nickname:', error);
        }

        const kayitRolId = db.get(`kayitUyeRol_${interaction.guild.id}`);
        const kayitRol = interaction.guild.roles.cache.get(kayitRolId);

        if (kayitRol) {
            try {
                await targetMember.roles.add(kayitRol);
            } catch (error) {
                console.error('Error adding role to the user:', error);
            }
        }

        const embed = new EmbedBuilder()
            .setColor('#2137af')
            .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
            .setDescription(`>\`${targetUser.tag}\` adlı üyenin kaydı **başarıyla** yapıldı!`)
            .setThumbnail(targetUser.displayAvatarURL())
            .setFooter({ text: `${client.user.username} ©️ Tüm hakları saklıdır.`, iconURL: client.user.displayAvatarURL({ dynamic: true }) })
            .setTimestamp();

            const logEmbed = new EmbedBuilder()
            .setColor('Green')
            .setAuthor( { name: `${targetUser.tag} - Kayıt Yapıldı`, iconURL: targetUser.displayAvatarURL() } )
            .setDescription(`>\`${targetUser.tag}\` adlı üyenin kaydı \`${interaction.user.username}\` tarafından yapıldı!`)
            .setFooter( { text: `${client.user.username} ©️ Tüm hakları saklıdır.`, iconURL: client.user.displayAvatarURL() } )
            .setTimestamp();

        const kayitLogKanalId = db.get(`kayitLog_${guild.id}`);
        const kayitLogKanal = interaction.guild.channels.cache.get(kayitLogKanalId);

        if (kayitLogKanal) {
            kayitLogKanal.send({ embeds: [logEmbed] });
        }

        interaction.reply({ embeds: [embed] });
    },
};
