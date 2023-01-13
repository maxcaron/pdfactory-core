import test from 'ava';
import { launchBrowser } from '../../src/browser.js';

test('launchBrowser() should call puppeteer launch and return browser', async ava => {
  const browser = await launchBrowser(); 
  ava.is(browser.constructor.name, 'CDPBrowser');
});