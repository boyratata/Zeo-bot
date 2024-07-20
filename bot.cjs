const axios = require('axios');  
const { Client, GatewayIntentBits, EmbedBuilder } = require('discord.js');

const webhookURL = 'https://discord.com/api/webhooks/1264103456478728222/pjemw6dpVW00UZd0W1ocPXz92KFGzlzNExSvTlOkkmNmxrdKZ05B3SZ313n29DomPRWx';

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

const userWarnings = new Map();
const whitelist = new Set([
  '1156416601122426981',
  '836142241898430476'
]);
const offensiveWords = [
  'arse', 'arsehead', 'arsehole', 'ass', 'ass hole', 'asshole',
  'bastard', 'bitch', 'bloody', 'bollocks', 'brotherfucker', 'bugger', 'bullshit',
  'child-fucker', 'Christ on a bike', 'Christ on a cracker', 'cock', 'cocksucker', 'crap',
  'cunt', 'dammit', 'damn', 'damned', 'damn it', 'dick', 'dick-head', 'dickhead',
  'dumb ass', 'dumb-ass', 'dumbass', 'dyke', 'father-fucker', 'fatherfucker', 'frigger',
  'fuck', 'fucker', 'fucking', 'god dammit', 'god damn', 'goddammit', 'God damn',
  'goddamn', 'Goddamn', 'goddamned', 'goddamnit', 'godsdamn', 'hell', 'holy shit',
  'horseshit', 'in shit', 'jack-ass', 'jackarse', 'jackass', 'Jesus Christ',
  'Jesus fuck', 'Jesus H. Christ', 'Jesus Harold Christ', 'Jesus, Mary and Joseph',
  'Jesus wept', 'kike', 'mother fucker', 'mother-fucker', 'motherfucker', 'pigfucker',
  'piss', 'prick', 'pussy', 'shit', 'shit ass', 'shite', 'sibling fucker', 'sisterfuck',
  'sisterfucker', 'slut', 'son of a whore', 'son of a bitch', 'spastic', 'sweet Jesus',
  'twat', 'wanker', 'wank', 'nigga', 'nigger', 'kys', 'kill your self', 'kill yourself',
  'lewd', 'makinglove', 'moaning', 'moan', 'moaning', 'moans', 'making love', 'penis',
  'pervert', 'cum sucker', 'cum face', 'cum shot', 'lil cum baby', 'cum slut'
];

const roasts = [
  "Is that the best you’ve got? I’ve heard more intelligent things from a toaster.",
  "Wow, you’re really setting the bar low with that insult. I’ve seen better comebacks from my pet rock.",
  "You’re so original! I haven’t heard that one since the last time I talked to a malfunctioning AI.",
  "I’m impressed by your commitment to being utterly uncreative. It takes real talent to be this consistently dull.",
  "Congratulations, you’ve reached a new level of unremarkable. I’m sure no one will remember this for long.",
  "If ignorance was a superpower, you’d be the most powerful being in the universe.",
  "You’ve managed to achieve the rare feat of being both irrelevant and uninspired. Kudos to you.",
  "I didn’t realize I was dealing with a master of mediocrity. I’ll make sure to take your opinions as seriously as I do a paper cut.",
  "That insult is so weak, I’d rather be hit by a feather. Your creativity is as lifeless as your jokes.",
  "It’s impressive how you’ve managed to reduce an insult to an art form of blandness. I’m genuinely bored now."
];

const followUpRoasts = [
  "You’re still trying? At this point, your attempts at humor are just tragic.",
  "Do you even know what creativity is? I haven’t seen such a lack of imagination since my last trip to a museum.",
  "It’s adorable how you think you’re having an impact. Your words are as meaningful as a broken record.",
  "Are you seriously still going? Your persistence is almost as annoying as your lack of wit.",
  "I’m beginning to think you’re in a competition to see who can be the most dull. Congratulations, you’re winning.",
  "Your comebacks are so weak they’re practically non-existent. You’re making a great case for why silence is golden.",
  "If I had a dollar for every time your jokes missed the mark, I’d be rich enough to retire from listening to you.",
  "It’s almost impressive how you’ve managed to maintain such a high level of irrelevance. How do you do it?",
  "I haven’t seen someone fail so spectacularly in a long time. You’re setting records for ineptitude.",
  "You’re truly a legend in your own mind. Too bad that’s the only place where your comebacks have any impact."
];

const sendWebhookNotification = async (userId, username, guildName, messageContent, channelName) => {
  const webhookMessage = {
    username: 'Warning Bot',
    embeds: [
      {
        color: 0xFF0000,
        title: 'User Warned',
        description: `**User:** <@${userId}> (${username})\n**Guild:** ${guildName}\n**Channel:** ${channelName}\n**Message Content:** ${messageContent}\n**Action:** Warned for offensive language.`,
        timestamp: new Date()
      }
    ]
  };

  try {
    await axios.post(webhookURL, webhookMessage);
  } catch (error) {
    console.error('Failed to send webhook message:', error);
  }
};

client.once('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('messageCreate', async message => {
  if (message.author.bot) return;

  if (whitelist.has(message.author.id)) return;  

  const messageContent = message.content.toLowerCase();

  for (const word of offensiveWords) {
    if (messageContent.includes(word)) {
      let warningCount = userWarnings.get(message.author.id) || 0;

      if (warningCount < 2) {
        try {
          const dmChannel = await message.author.createDM();
          const embed = new EmbedBuilder()
            .setColor('#FF0000')
            .setTitle('Warning')
            .setDescription(`You have been warned in ${message.guild.name} for using offensive language.`)
            .setTimestamp();

          await dmChannel.send({ embeds: [embed] });
        } catch (error) {
          console.error(`Could not send DM to ${message.author.tag}:`, error);
        }

        userWarnings.set(message.author.id, warningCount + 1);
        await message.reply("You have been warned. Check your DMs for more details.").catch(console.error);
      } else {
        const roast = roasts[Math.floor(Math.random() * roasts.length)];
        await message.reply(roast).catch(console.error);
      }

      try {
        await axios.post(webhookUrl, {
          username: 'Warning Bot',
          embeds: [
            {
              title: 'User Warned',
              color: 16711680,
              fields: [
                {
                  name: 'User',
                  value: message.author.tag,
                  inline: true
                },
                {
                  name: 'Channel',
                  value: message.channel.name,
                  inline: true
                },
                {
                  name: 'Message',
                  value: message.content,
                }
              ],
              timestamp: new Date(),
            }
          ]
        });
      } catch (error) {
        console.error('Failed to send webhook:', error);
      }

      await message.delete().catch(console.error);
      break;
    }
  }
});

client.login('MTI2Mjc4MDk0NjIxMDYxOTQwMQ.Gi9YBK.MP5U3HAj4avBCW5JgPxugo2V2bFifFe-2OVyWI').catch(console.error);