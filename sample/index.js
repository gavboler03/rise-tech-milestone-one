const {chromium: playwright} = require('playwright-core');

exports.handler = async () => {
    const {default: chromium} = await import('@sparticuz/chromium');

    let browser;

    try {
        browser = await playwright.launch({
            args: chromium.args,
            executablePath: await chromium.executablePath(),
            headless: true,
        });

        const page = await browser.newPage();

        await page.goto('https://member.fop.net', {
            waitUntil: 'domcontentloaded',
        });

        const title = await page.title();

        return {
            statusCode: 200,
            body: JSON.stringify({
                ok: true,
                title,
            }),
        };
    } finally {
        if (browser) {
            await browser.close();
        }
    }
};