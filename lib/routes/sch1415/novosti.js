const got = require('@/utils/got');
const host = 'https://sch1415sv.mskobr.ru/novosti';
const cheerio = require('cheerio');

module.exports = async (ctx) => {
    const response = await got(host);
    const data = response.body;
    const $ = cheerio.load(data);
    const list = $('div.kris-component-box > div.kris-news-box');
    ctx.state.data = {
        title: $('head > title').text(),
        link: host,
        description: 'Государственное бюджетное общеобразовательное учреждение города Москвы «Школа № 1415 «Останкино» / Новости',
        item: list
            .map((index, item) => {
                const d = $(item).find('div.kris-news-data-txt').text().trim();
                return {
                    title: $(item).find('div.kris-news-tit').text().trim(),
                    description: `<img src="${$(item).find('img').attr('src')}" /> <br>
                    ${$(item).find('div.kris-news-body').text()}`,
                    link: `https://sch1415sv.mskobr.ru${$(item).find('a.link_more').attr('href')}`,
                    pubDate: new Date(d.substr(6, 4), d.substr(3, 2) - 1, d.substr(0, 2)).toUTCString(),
                };
            })
            .get(),
    };
};
