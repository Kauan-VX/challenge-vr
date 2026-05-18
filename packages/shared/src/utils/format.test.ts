import { formatPrice } from './format';

describe('formatPrice', () => {
  it('formata em real brasileiro', () => {
    const result = formatPrice(1234.5);
    expect(result.replace(/\s/g, ' ')).toMatch(/R\$\s?1\.234,50/);
  });

  it('formata zero', () => {
    expect(formatPrice(0).replace(/\s/g, ' ')).toMatch(/R\$\s?0,00/);
  });
});
