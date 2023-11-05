const fs = require('fs');
const Discord = require('discord.js');
const config = require('./config.json');
const client = new Discord.Client({ intents: ['GUILDS', 'GUILD_MESSAGES', 'GUILD_MEMBERS', 'MESSAGE_CONTENT'] });

client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.name, command);
}

client.on('ready', () => {
  console.log(`${client.user.tag} Hazır`);
});

client.on('messageCreate', (message) => {
  if (!message.content.startsWith(config.prefix) || message.author.bot) return;

  const args = message.content.slice(config.prefix.length).trim().split(/ +/);
  const commandName = args.shift().toLowerCase();

  if (!client.commands.has(commandName)) return;

  const command = client.commands.get(commandName);

  try {
    command.execute(message, args);
  } catch (error) {
    console.error(error);
    message.reply('Komutu çalıştırırken bir hata oluştu!');
  }
});


client.on('interactionCreate', async interaction => {
  if (!interaction.isCommand()) return;

  const { commandName } = interaction;

  if (!client.commands.has(commandName)) return;

  try {
    await client.commands.get(commandName).execute(interaction);
  } catch (error) {
    console.error(error);
    await interaction.reply({ content: 'Komutu çalıştırırken bir hata oluştu!', ephemeral: true });
  }
});


client.on('guildMemberAdd', member => {
  const hesapOlusturmaTarihi = member.user.createdAt;
  const olusturmaTarihi = new Date(hesapOlusturmaTarihi);

  // Türkçe tarih formatı oluşturma
  const gun = olusturmaTarihi.getDate().toString().padStart(2, '0');
  const ay = (olusturmaTarihi.getMonth() + 1).toString().padStart(2, '0');
  const yil = olusturmaTarihi.getFullYear();
  const saat = olusturmaTarihi.getHours().toString().padStart(2, '0');
  const dakika = olusturmaTarihi.getMinutes().toString().padStart(2, '0');
  const saniye = olusturmaTarihi.getSeconds().toString().padStart(2, '0');

  const turkceTarih = `${gun}.${ay}.${yil} ${saat}:${dakika}:${saniye}`;

  const embed = new Discord.MessageEmbed()
      .setTitle(`Hoş geldin, ${member.user.username}!`)
      .setColor('#2137af')
      .setDescription(`Sunucumuza hoşgeldin ${member}!\n\nSeninle birlikte ${member.guild.memberCount} kişiye ulaştık.\n\nKaydının yapılması için **isim nick yaş** yazınız.`)
      .setFooter({ text: `Hesap açılma tarihi: ${turkceTarih}` });

  const welcomeChannel = member.guild.channels.cache.get(config.kayit_kanali);
  if (welcomeChannel) {
      welcomeChannel.send(`<@&${config.kayit_sorumlusu}>`);
      welcomeChannel.send({ embeds: [embed] });
  } else {
      console.log('Belirtilen kanal bulunamadı.');
  }
});

client.login(config.token);
