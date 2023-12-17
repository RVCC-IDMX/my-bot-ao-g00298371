/* eslint-disable indent */
const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  cooldown: 5,
  data: new SlashCommandBuilder()
    .setName('secretping')
    .setDescription('Replies with Pong privately'),
  async execute(interaction) {
    // Ephemeral response in a private message
    await interaction.reply({ content: 'Secret pong!', ephemeral: true });
  },
};
