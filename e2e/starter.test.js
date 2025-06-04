describe('Detox Starter Test', () => {
  it('should launch the app', async () => {
    await device.launchApp();
    await expect(element(by.id('welcomeScreen'))).toBeVisible();
  });
});