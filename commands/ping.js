module.exports = {
    name: 'ping',
    description: 'Ping komutu - botun çalışıp çalışmadığını kontrol etmek için kullanılır.',
    execute(message, args) {
      message.reply('Pong!');
    },
  };
  