const pptr = require('puppeteer');
let instance = null;
module.exports.getBrowserInstance = async function () {
    if (!instance)
        instance = await pptr.launch({
            headless: false,
            args: ["--no-sandbox"]
        });

    console.log("do create instance");

    console.log("instance" + instance);
    return instance;

}