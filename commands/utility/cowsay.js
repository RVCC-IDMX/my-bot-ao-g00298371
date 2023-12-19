/* eslint-disable indent */
const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  cooldown: 5,
  data: new SlashCommandBuilder()
    .setName('cowsay')
    .setDescription('Replies with Cowsay!'),
  async execute(interaction) {
    await interaction.reply('Cowsay!');
  },
};
