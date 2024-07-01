const express = require("express");
const { hasPermissions } = require("../../../lib/utils");
const redis = require("../../../lib/redis");
require("dotenv/config");

const router = express.Router();

const DISCORD_ENDPOINT = "https://discord.com/api/v10";

router.get("/", (req, res) => {
  if (req.user) {
    const { accessToken, refreshToken, ...user } = req.user;

    res.status(200).json(user);
  } else {
    res.status(401).json({ message: "Not logged in" });
  }
});

router.get("/guilds", async (req, res) => {
  if (!req.user?.accessToken) {
    return res.status(401).json({ message: "Not logged in" });
  }

  const skipCache = req.query.skipcache;

  if (!skipCache) {
    if (redis) {
      const redisCacheRes = await redis.get(`user-guilds:${req.user.id}`);

      if (redisCacheRes) {
        return res.status(200).json(JSON.parse(redisCacheRes));
      }
    }
  }

  const guildsRes = await fetch(`${DISCORD_ENDPOINT}/users/@me/guilds`, {
    headers: {
      Authorization: `Bearer ${req.user.accessToken}`,
    },
  });

  if (!guildsRes.ok) {
    return res.status(500).json({ message: "Failed to fetch guilds" });
  }

  const guilds = await guildsRes.json();

  const botGuildsResponse = await fetch(
    `${DISCORD_ENDPOINT}/users/@me/guilds`,
    {
      headers: {
        Authorization: `Bot ${process.env.TOKEN}`,
      },
    }
  );

  if (!botGuildsResponse.ok) {
    console.log("error", await botGuildsResponse.text());
    throw new Error("Failed to fetch bot guilds");
  }

  const botGuilds = await botGuildsResponse.json();

  const botGuildMap = new Map(botGuilds.map((guild) => [guild.id, guild]));
  const simGuilds = guilds.filter((guild) => botGuildMap.has(guild.id));

  const commonGuilds = simGuilds.filter((guild) =>
    hasPermissions(guild.permissions, "Administrator")
  );
  console.log("Common guilds:", commonGuilds);
  if (redis) {
    await redis.set(
      `user-guilds:${req.user.id}`,
      JSON.stringify(commonGuilds),
      "EX",
      600
    );
  }

  res.status(200).json(commonGuilds);
});

module.exports = router;
