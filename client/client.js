const logger = require("../utils/logger");

const puppeteer = require("puppeteer-extra");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");
const ProxyPlugin = require("puppeteer-extra-plugin-proxy");

class Client {
    proxy;
    path;
    email;

    constructor(path, proxy) {
        this.path = path;
        this.proxy = proxy;

        puppeteer.use(StealthPlugin());

        const proxyUrl = this.proxy;
        const [auth, host] = proxyUrl.split("@");
        const [username, password] = auth.split(":");

        puppeteer.use(
            ProxyPlugin({
                address: host.split(":")[0], // IP прокси
                port: parseInt(host.split(":")[1]), // Порт прокси
                credentials: {username, password},
            })
        );
    }

    getEmail = async () => {
        let browser;
        try {
            browser = await puppeteer.launch({
                headless: true,
                defaultViewport: null
            });

            const page = await browser.newPage();

            // Логируем ВСЕ запросы
            /*page.on("request", request => {
                console.log(`[${request.method()}] ${request.url()}`);
            });*/

            await page.goto(`https://dot.report/usdot/${this.path}`, {waitUntil: "networkidle2"});

            const selectorButton = 'button#ez-accept-all';
            await page.waitForSelector(selectorButton);

            const element = await page.$(selectorButton);
            const box = await element.boundingBox();

            if (box) {
                const targetX = box.x + box.width / 2;
                const targetY = box.y + box.height / 2;

                // плавное движение мыши
                await page.mouse.move(targetX, targetY, {steps: 25});
                await new Promise(resolve => setTimeout(resolve, 300 + Math.random() * 200));

                await page.mouse.click(targetX, targetY);
            }

            const selectorMailTo = 'a[href^="mailto:"]';
            await page.waitForSelector(selectorMailTo);
            const elementMailTo = await page.$(selectorMailTo);

            if (elementMailTo) {
                this.email = await page.evaluate(el => el.href.replace("mailto:", ""), elementMailTo);
            } else {
                this.email = null;
                logger.error(`❌ Элемент в https://dot.report/usdot/${this.path} не найден.`);
            }
        } catch (error) {
            logger.error(`❌ Ошибка входа в https://dot.report/usdot/${this.path} → ${error.message}`);
            return false;
        } finally {
            if (browser) await browser.close();
        }
        return this.email;
    };
}

module.exports = Client;