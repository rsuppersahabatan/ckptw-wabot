const {
    createAPIUrl
} = require("../tools/api.js");
const {
    monospace,
    quote
} = require("@mengkodingan/ckptw");
const axios = require("axios");

module.exports = {
    name: "faktaunik",
    aliases: ["fakta"],
    category: "internet",
    code: async (ctx) => {
        const {
            status,
            message
        } = await global.handler(ctx, {
            banned: true,
            coin: 3
        });
        if (status) return ctx.reply(message);

        try {
            const faktaApiUrl = await createAPIUrl("https://uselessfacts.jsph.pl", "/api/v2/facts/random", {});
            const faktaResponse = await axios.get(faktaApiUrl, {
                headers: {
                    "User-Agent": global.system.userAgent
                }
            });
            const faktaText = faktaResponse.data.text;

            const translationApiUrl = createAPIUrl("fasturl", "/tool/translate", {
                text: faktaText,
                target: "id"
            });
            const translationResponse = await axios.get(translationApiUrl, {
                headers: {
                    "User-Agent": global.system.userAgent,
                    "x-api-key": listAPIUrl().fasturl.APIKey
                }
            });
            const translatedText = translationResponse.data.translatedText;

            return ctx.reply(translatedText);
        } catch (error) {
            console.error("Error:", error);
            if (error.status !== 200) return ctx.reply(global.msg.notFound);
            return ctx.reply(quote(`⚠ Terjadi kesalahan: ${error.message}`));
        }
    }
};