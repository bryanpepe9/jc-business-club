import { describe, expect, it } from 'vitest';
import { buildNotification } from '@/lib/application/notification';
import type { Application } from '@/lib/application/fields';
import { ptBR } from '@/i18n/pt-BR';

const application: Application = {
  name: 'Maria <b>Silva</b>',
  email: 'maria@empresa.com.br',
  phone: '+5511912345678',
  city: 'São Paulo',
  company: 'Empresa & Filhos',
  role: 'Diretora',
  segment: 'outro',
  segmentOther: 'Tecnologia',
  about: 'Linha 1\n<script>alert(1)</script>',
  goals: 'Parcerias',
};

describe('buildNotification', () => {
  const message = buildNotification(
    application,
    ptBR.application,
    { utm_source: 'linkedin' },
    new Date('2026-11-01T15:00:00Z'),
  );

  it('escapes every user value in the HTML version', () => {
    expect(message.html).not.toContain('<script>');
    expect(message.html).not.toContain('<b>Silva</b>');
    expect(message.html).toContain('&lt;script&gt;alert(1)&lt;/script&gt;');
    expect(message.html).toContain('Empresa &amp; Filhos');
  });

  it('keeps a readable plain-text version', () => {
    expect(message.text).toContain('WhatsApp: +5511912345678');
    expect(message.text).toContain('Segmento: Outro: Tecnologia');
    expect(message.text).toContain('LinkedIn: —');
    expect(message.text).toContain('Origem: utm_source=linkedin');
    expect(message.text).toContain('horário de Brasília');
  });

  it('notes the form language for applicants who used the English site', () => {
    const fromEnglish = buildNotification(application, ptBR.application, {}, new Date(), 'Inglês');
    expect(fromEnglish.text).toContain('Idioma do formulário: Inglês');
    expect(message.text).not.toContain('Idioma do formulário');
  });

  it('builds a single-line subject', () => {
    const withNewline = buildNotification(
      { ...application, name: 'Maria\nBcc: x@y.z' },
      ptBR.application,
      {},
      new Date(),
    );
    expect(withNewline.subject).not.toMatch(/[\r\n]/);
    expect(message.subject).toContain('Empresa & Filhos');
  });
});
