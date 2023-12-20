/* eslint-disable indent */
const { SlashCommandBuilder } = require('discord.js');
const cowsay = require('cowsay');


module.exports = {
  data: new SlashCommandBuilder()
    .setName('cowsay')
    .setDescription('Cowsay: Input text to make a cow say it!')
    .addStringOption((option) => option.setName('text')
      .setDescription('The message to display')
      .setRequired(true)
      .setMaxLength(25))
    .addStringOption((option) => option.setName('cow')
      .setDescription('Cowsay Selector')
      .setRequired(true)),
  async execute(interaction) {
    const cowText = interaction.options.getString('text');
    const cowChoice = interaction.options.getString('cow');

    console.log('text');

    const cowMessage = cowsay.say({
      text: cowText,
      f: cowChoice,
    });

    if (cowMessage.length <= 2000) {
      await interaction.reply(`\`\`\`${cowMessage}\`\`\``);
    }
    else {
      await interaction.reply('This cow is too big!');
    }
  },
};
