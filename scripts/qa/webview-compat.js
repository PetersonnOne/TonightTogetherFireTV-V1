async page => {
  // QA-tool shim only: current Playwright's ARIA snapshot expects checkVisibility,
  // but the target WebView predates it. No application code requires this API.
  const cdp = await page.context().newCDPSession(page);
  const contexts = [];
  cdp.on('Runtime.executionContextCreated', event => contexts.push(event.context));
  await cdp.send('Runtime.enable');
  const utility = contexts.filter(context => context.name.includes('utility'));
  for (const context of utility) {
    await cdp.send('Runtime.evaluate', {
      contextId: context.id,
      expression: `if (!Element.prototype.checkVisibility) Element.prototype.checkVisibility = function() {
        return !!(this.offsetWidth || this.offsetHeight || this.getClientRects().length)
          && getComputedStyle(this).visibility !== 'hidden';
      };`
    });
  }
  await cdp.detach();
  return { compatibilityContexts: utility.map(context => context.name), target: await page.title() };
}
