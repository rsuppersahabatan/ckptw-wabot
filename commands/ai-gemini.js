const {
    createAPIUrl
} = require("../tools/api.js");
const {
    monospace,
    quote
} = require("@mengkodingan/ckptw");
const axios = require("axios");
const {
    MessageType
} = require("@mengkodingan/ckptw/lib/Constant");
const mime = require("mime-types");
const {
    uploadByBuffer
} = require("telegraph-uploader");

module.exports = {
    name: "gemini",
    category: "ai",
    code: async (ctx) => {
        const {
            status,
            message
        } = await global.handler(ctx, {
            banned: true,
            coin: 3
        });
        if (status) return ctx.reply(message);

        const input = ctx.args.join(" ") || null;

        if (!input) return ctx.reply(
            `${quote(global.msg.argument)}\n` +
            `${quote(`Contoh: ${monospace(`${ctx._used.prefix}${ctx._used.command} apa itu whatsapp?`)}`)}\n` +
            quote("Catatan: AI ini dapat melihat gambar dan menjawab pertanyaan tentangnya. Kirim gambar dan tanyakan apa saja!")
        );

        const msgType = ctx.getMessageType();
        const media = ctx.msg.media || ctx.quoted?.media;

        try {
            if (msgType !== MessageType.imageMessage && msgType !== MessageType.videoMessage && !ctx.quoted?.conversation) {
                const apiUrl = createAPIUrl("sanzy", "/api/gemini", {
                    text: input
                });
                const response = await axios.get(apiUrl, {
                    headers: {
                        "User-Agent": global.system.userAgent
                    }
                });
                const {
                    data
                } = response.data;

                return ctx.reply(data);
            } else if (media) {
                const buffer = await media.toBuffer();
                const uploadResponse = await uploadByBuffer(buffer, mime.lookup("png"));
                const apiUrl = createAPIUrl("sanzy", "/api/gemini-image", {
                    text: input,
                    image: uploadResponse.link
                });
                const response = await axios.get(apiUrl, {
                    headers: {
                        "User-Agent": global.system.userAgent
                    }
                });
                const {
                    data
                } = response.data;

                return ctx.reply(data);
            }
        } catch (error) {
            console.error("Error:", error);
            if (error.status !== 200) return ctx.reply(global.msg.notFound);
            return ctx.reply(quote(`⚠ Terjadi kesalahan: ${error.message}`));
        }
    }
};