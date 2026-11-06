import { describe, expect, it } from 'vitest';
import { FIELD_NAMES, MAX_LENGTH, SEGMENTS, type FormValues } from '@/lib/application/fields';
import {
  normalizeLinkedIn,
  normalizePhone,
  readValues,
  validateApplication,
  validateField,
} from '@/lib/application/validate';
import { buildFieldMessages } from '@/lib/application/messages';
import { ptBR } from '@/i18n/pt-BR';
import { en } from '@/i18n/en';

const valid: FormValues = {
  name: 'Maria Silva',
  email: 'maria@empresa.com.br',
  phone: '(11) 91234-5678',
  city: 'São Paulo, Brasil',
  company: 'Empresa Exemplo',
  role: 'Diretora',
  segment: 'imobiliario',
  about: 'Incorporadora com foco em projetos residenciais.',
  goals: 'Parcerias e investidores.',
  consent: 'on',
};

describe('normalizePhone', () => {
  it.each([
    ['(11) 91234-5678', '+5511912345678'],
    ['11 3000-0000', '+551130000000'],
    ['5511912345678', '+5511912345678'],
    ['+55 11 91234-5678', '+5511912345678'],
    ['+1 415 555 0100', '+14155550100'],
    ['0044 20 7946 0958', '+442079460958'],
  ])('normalises %s to %s', (input, expected) => {
    expect(normalizePhone(input)).toBe(expected);
  });

  it.each(['1234', '91234-5678', 'abc', '+123', '11 9123x-5678', '+1234567890123456'])(
    'rejects %s',
    (input) => {
      expect(normalizePhone(input)).toBeNull();
    },
  );
});

describe('normalizePhone without assuming Brazil (English form)', () => {
  it('requires a country code', () => {
    expect(normalizePhone('415 555 0100', { assumeBrazil: false })).toBeNull();
    expect(normalizePhone('(11) 91234-5678', { assumeBrazil: false })).toBeNull();
    expect(normalizePhone('+1 415 555 0100', { assumeBrazil: false })).toBe('+14155550100');
    expect(normalizePhone('+55 11 91234-5678', { assumeBrazil: false })).toBe('+5511912345678');
  });

  it('flows through field validation', () => {
    expect(validateField('phone', { phone: '415 555 0100' }, { assumeBrazil: false })).toBe('invalid');
    expect(validateField('phone', { phone: '415 555 0100' })).toBeUndefined();
  });
});

describe('normalizeLinkedIn', () => {
  it.each([
    ['linkedin.com/in/maria', 'https://linkedin.com/in/maria'],
    ['https://www.linkedin.com/in/maria', 'https://www.linkedin.com/in/maria'],
    ['http://br.linkedin.com/in/maria', 'https://br.linkedin.com/in/maria'],
  ])('normalises %s', (input, expected) => {
    expect(normalizeLinkedIn(input)).toBe(expected);
  });

  it.each(['https://example.com/maria', 'linkedin.com', 'javascript:alert(1)', 'maria'])(
    'rejects %s',
    (input) => {
      expect(normalizeLinkedIn(input)).toBeNull();
    },
  );
});

describe('validateField', () => {
  it('requires every field except LinkedIn', () => {
    for (const name of FIELD_NAMES) {
      const expected = name === 'linkedin' || name === 'segmentOther' ? undefined : 'required';
      expect(validateField(name, {}), name).toBe(expected);
    }
  });

  it('flags invalid formats', () => {
    expect(validateField('email', { email: 'maria@' })).toBe('invalid');
    expect(validateField('phone', { phone: '123' })).toBe('invalid');
    expect(validateField('linkedin', { linkedin: 'example.com' })).toBe('invalid');
  });

  it('enforces length limits', () => {
    expect(validateField('about', { about: 'a'.repeat(MAX_LENGTH.about) })).toBeUndefined();
    expect(validateField('about', { about: 'a'.repeat(MAX_LENGTH.about + 1) })).toBe('tooLong');
  });

  it('accepts only known segments', () => {
    for (const segment of SEGMENTS) expect(validateField('segment', { segment })).toBeUndefined();
    expect(validateField('segment', { segment: 'tecnologia' })).toBe('required');
  });

  it('requires "Qual segmento?" only for "Outro"', () => {
    expect(validateField('segmentOther', { segment: 'hospitalidade' })).toBeUndefined();
    expect(validateField('segmentOther', { segment: 'outro' })).toBe('required');
    expect(validateField('segmentOther', { segment: 'outro', segmentOther: 'Tecnologia' })).toBeUndefined();
  });

  it('requires explicit consent', () => {
    expect(validateField('consent', { consent: 'on' })).toBeUndefined();
    expect(validateField('consent', { consent: 'true' })).toBe('required');
  });
});

describe('validateApplication', () => {
  it('returns a normalised application', () => {
    const result = validateApplication({ ...valid, linkedin: 'linkedin.com/in/maria' });
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.application.phone).toBe('+5511912345678');
    expect(result.application.linkedin).toBe('https://linkedin.com/in/maria');
    expect(result.application.segmentOther).toBeUndefined();
  });

  it('drops "Qual segmento?" unless the segment is "Outro"', () => {
    const result = validateApplication({ ...valid, segmentOther: 'Ignorado' });
    expect(result.ok && result.application.segmentOther).toBeUndefined();

    const other = validateApplication({ ...valid, segment: 'outro', segmentOther: 'Tecnologia' });
    expect(other.ok && other.application.segmentOther).toBe('Tecnologia');
  });

  it('collects every error at once', () => {
    const result = validateApplication({ ...valid, email: 'x', phone: '1', consent: '' });
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.errors).toEqual({ email: 'invalid', phone: 'invalid', consent: 'required' });
  });
});

describe('readValues', () => {
  it('trims text and ignores unknown fields', () => {
    const data = new FormData();
    data.set('name', '  Maria  ');
    data.set('website', 'spam');
    expect(readValues(data)).toEqual({ name: 'Maria' });
  });
});

describe('copy', () => {
  it('has a message for every field and error', () => {
    const messages = buildFieldMessages(ptBR.application);
    for (const name of FIELD_NAMES) {
      for (const code of ['required', 'invalid', 'tooLong'] as const) {
        expect(messages[name][code], `${name}.${code}`).not.toBe('');
      }
    }
    expect(messages.about.tooLong).toContain(String(MAX_LENGTH.about));
  });

  it('labels every segment', () => {
    for (const segment of SEGMENTS) expect(ptBR.application.segmentOptions[segment]).toBeTruthy();
  });

  it('has complete English messages', () => {
    const messages = buildFieldMessages(en.application);
    for (const name of FIELD_NAMES) {
      for (const code of ['required', 'invalid', 'tooLong'] as const) {
        expect(messages[name][code], `${name}.${code}`).not.toBe('');
      }
    }
    for (const segment of SEGMENTS) expect(en.application.segmentOptions[segment]).toBeTruthy();
  });

  it('keeps facts identical across languages', () => {
    // Billed in reais everywhere; English adds an approximate dollar guide.
    expect(en.membership.price.amount).toBe(ptBR.membership.price.amount);
    expect(en.membership.price.approx).toContain('US$ 180');
    expect(en.audience.sectors.items).toHaveLength(ptBR.audience.sectors.items.length);
    expect(en.benefits.items).toHaveLength(ptBR.benefits.items.length);
    expect(en.track.photos).toHaveLength(ptBR.track.photos.length);
    expect(en.press.items.map((i) => i.headline)).toEqual(ptBR.press.items.map((i) => i.headline));
  });
});
