const data = require('./data.js').default;

describe('Check data', () => {
  it('check name', async () => {
    expect(data['products'][0]['name']).toBe('Filter Coffee');
  });
  it('check slug', async () => {
    expect(data['products'][0]['slug']).toBe('filter-coffee');
  });
  it('check category', async () => {
    expect(data['products'][0]['category']).toBe('Coffee');
  });
  it('check image', async () => {
    expect(data['products'][0]['image']).toBe('/images/p1.jpg');
  });
});
