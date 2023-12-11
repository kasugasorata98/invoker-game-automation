import puppeteer from "puppeteer";

const SPELL_COMBINATIONS: {
  [key: string]: string;
} = {
  "Cold Snap": "QQQ",
  "Ghost Walk": "QQW",
  "Ice Wall": "QQE",
  EMP: "WWW",
  Tornado: "WWQ",
  Alacrity: "WWE",
  "Sun Strike": "EEE",
  "Forge Spirit": "EEQ",
  "Chaos Meteor": "EEW",
  "Deafening Blast": "QWE",
};

async function run() {
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: {
      height: 1000,
      width: 2000,
    },
  });
  const page = await browser.newPage();

  await page.goto("https://www.invokergame.com/");

  const buttonSelector = ".Button.GameModeButton";
  await page.waitForSelector(buttonSelector);

  await page.click(buttonSelector);

  await page.evaluate(() => {
    const anchorElement = document.querySelector('a[href="javascript:void()"]');
    if (anchorElement) {
      // Trigger the click event
      (anchorElement as HTMLElement).click();
    }
  });

  await page.keyboard.press("Enter");

  while (true) {
    const spellNames = await page.evaluate(() => {
      const spellElements = Array.from(
        document.querySelectorAll(".speechboxTR .ActiveSpell span")
      );
      return spellElements.map((span) => span.textContent!.trim());
    });

    for (const spellName of spellNames) {
      await sleep(0);
      const combination = SPELL_COMBINATIONS[spellName];
      await page.keyboard.type(combination + "RD");
    }
  }

  // await browser.close();
}

const sleep = (ms: number) => {
  return new Promise<void>((resolve, reject) => {
    setTimeout(() => {
      resolve();
    }, ms);
  });
};

run();
