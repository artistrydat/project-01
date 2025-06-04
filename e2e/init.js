const { detox, device, element, by, waitFor } = require('detox');

beforeAll(async () => {
  await detox.init();
});

beforeEach(async () => {
  await device.reloadReactNative();
});

afterAll(async () => {
  await detox.cleanup();
});