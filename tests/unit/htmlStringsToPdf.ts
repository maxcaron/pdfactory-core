import test from 'ava';
import { htmlStringsToPdf } from '../../src/htmlStringsToPdf.js';
import sinon from 'sinon';
import { Browser } from 'puppeteer';

const expected_pdf = Buffer.from('');

const page = {
  setContent: sinon.stub(),
  pdf: () => Promise.resolve(expected_pdf),
  close: () => Promise.resolve()
};

const browser = ({
  newPage: sinon.stub(() => Promise.resolve(page))
} as unknown) as Pick<Browser, 'newPage'>;

test('htmlStringsToPdf() should render pdf', async ava => {
  const pdf = await htmlStringsToPdf(browser, '', {});

  ava.is(expected_pdf, pdf);
  ava.true(page.setContent.calledOnce);
});