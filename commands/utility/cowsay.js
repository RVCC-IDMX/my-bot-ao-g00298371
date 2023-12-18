/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable import/no-unresolved */
/* eslint-disable indent */
const {
  SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle,
} = require('discord.js');
const cowsay = require('cowsay');

const charLimit = 2000;
const generateDummyText = () => {
  let dummyText = '';
  for (let i = 0; i < charLimit; i += 1) { dummyText += 'A'; }
  return dummyText;
};

async function getCowList() {
  function callback(error, names) {
    if (error) {
      console.error('Invalid request. Unable to retrieve list of cows.');
      return ['default'];
    }
    return names;
  }
  // Prohibited cows
  function checkProhibited(string) {
    try {
      const exclusionList = [
        'bishop',
        'usa',
        'ibm',
        'kilroy',
      ];
      let stillTrue = true;

      exclusionList.forEach((item) => {
        if (item === string) {
          stillTrue = false;
        }
      });

      if (stillTrue && (`\`\`\`${cowsay.say({ text: generateDummyText(), f: string })}\`\`\``).length > 2000) {
        stillTrue = false;
      }
      return stillTrue;
    }
    catch {
      return false;
    }
  }
  const cows = await cowsay.list(callback);
  return cows.map((cowfile) => cowfile.split('.')[0])
    .filter((name) => checkProhibited(name));
}

const cowList = getCowList();


module.exports = {
  data: new SlashCommandBuilder()
    .setName('cowsay')
    .setDescription('Enter a short message to generate ASCII cow cartoon with a speech bubble.')
    .addStringOption((option) => option.setName('message')
      .setDescription('A message to send via cow.')
      .setMaxLength(charLimit))
    .addStringOption((option) => option.setName('cow')
      .setDescription('The cow to use.')
      .setAutocomplete(true))
    .addStringOption((option) => option.setName('help')
      .setDescription('Display help dialogue.')
      .addChoices({ name: 'Help!', value: 'help' })),
  async autocomplete(interaction) {
    const focusedValue = interaction.options.getFocused();
    const choices = await cowList;
    const filtered = choices.filter((choice) => choice.startsWith(focusedValue || 'a'));
    await interaction.respond(
      filtered.map((choice) => ({ name: choice, value: choice })),
    );
  },
  async exportCowList() {
    const list = await cowList;
    return list;
  },
  async execute(interaction) {
    const choices = await cowList;
    const message = interaction.options.getString('message');
    const help = interaction.options.getString('help');
    const cowFile = interaction.options.getString('cow');
    if (cowFile && !choices.includes(cowFile)) {
      await interaction.reply({ content: 'It looks like the cow you entered is invalid. To see a list of valid cows you can use, type /cowsay help', ephemeral: true });
      return;
    }
    const cow = cowFile || 'default';
    if (message) {
      try {
        const moo = cowsay.say({
          text: message,
          f: cow,
        });

        const delimiter = '\n';
        const cleanLine = '';
        const sanitizedMoo = moo.replaceAll('`', '\'').split(delimiter);
        sanitizedMoo[0] = cleanLine;
        sanitizedMoo[2] = cleanLine;
        const formattedMoo = `\`\`\`\n${sanitizedMoo.join(delimiter)}\`\`\``;

        await interaction.reply(formattedMoo);
      }
      catch (error) {
        console.error(error);
        await interaction.reply({ content: `It looks like there was an error processing your request: \n${error}`, ephemeral: true });
      }
    }
    else if (help) {
      const row = new ActionRowBuilder()
        .addComponents(
          new ButtonBuilder()
            .setCustomId('cowsay-help')
            .setLabel('Show me a list of "cows"!')
            .setStyle(ButtonStyle.Primary),
        );
      await interaction.reply({
        content: `To use Cowsay, you can enter a message of ${charLimit} `
          + 'characters or less in the "message" field, and [optionally] enter a non-default "cow" in '
          + 'the cow field. If you\'re not sure what "cows" I\'m talking about, go right ahead and press '
          + 'the big blurple button below to display a list!',
        components: [row],
        ephemeral: true,
      });
    }
  },

};
