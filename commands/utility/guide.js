/* eslint-disable indent */
const {
  SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle,
} = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('guide')
    .setDescription('A guide post with buttons.'),
  async execute(interaction) {
    const row = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
          .setCustomId('primary')
          .setLabel('Click Here')
          .setStyle(ButtonStyle.Primary),
      ).addComponents(
        new ButtonBuilder()
          .setLabel('Link')
          .setURL('https://github.com/RVCC-IDMX/my-bot-ao-g00298371')
          .setStyle(ButtonStyle.Link),
      );
    await interaction.reply({ content: 'To open the guide, click the bluish-purple button below. To visit this project\'s repository on GitHub, click the gray link button to visit ', components: [row] });
  },
};