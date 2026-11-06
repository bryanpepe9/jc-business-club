/**
 * The internal e-mail the club receives for each application. Every
 * user-supplied value is HTML-escaped.
 */
import type { SiteContent } from '@/i18n/types';
import type { Application } from './fields';

export type Source = Partial<Record<'utm_source' | 'utm_medium' | 'utm_campaign', string>>;

export interface Notification {
  subject: string;
  text: string;
  html: string;
}

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

const singleLine = (value: string) => value.replace(/[\r\n]+/g, ' ').trim();

export function buildNotification(
  application: Application,
  copy: SiteContent['application'],
  source: Source,
  submittedAt: Date,
  applicantLanguage?: string,
): Notification {
  const f = copy.fields;
  const segment =
    application.segment === 'outro' && application.segmentOther
      ? `${copy.segmentOptions.outro}: ${application.segmentOther}`
      : copy.segmentOptions[application.segment];

  const details: [string, string][] = [
    [f.name.label, application.name],
    [f.email.label, application.email],
    [f.phone.label, application.phone],
    [f.city.label, application.city],
    [f.linkedin.label, application.linkedin ?? '—'],
    [f.company.label, application.company],
    [f.role.label, application.role],
    [f.segment.label, segment],
    ...(applicantLanguage ? ([['Idioma do formulário', applicantLanguage]] as [string, string][]) : []),
  ];
  const answers: [string, string][] = [
    [f.about.label, application.about],
    [f.goals.label, application.goals],
  ];
  const sourceLine = Object.entries(source)
    .filter(([, value]) => value)
    .map(([key, value]) => `${key}=${value}`)
    .join(' · ');
  const date = new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'long',
    timeStyle: 'short',
    timeZone: 'America/Sao_Paulo',
  }).format(submittedAt);

  const subject = singleLine(
    `Nova solicitação de participação — ${application.name} (${application.company})`,
  );

  const text = [
    ...details.map(([label, value]) => `${label}: ${value}`),
    '',
    ...answers.flatMap(([label, value]) => [label, value, '']),
    sourceLine ? `Origem: ${sourceLine}` : '',
    `Enviado em ${date} (horário de Brasília)`,
  ]
    .filter((line, i, lines) => line !== '' || lines[i - 1] !== '')
    .join('\n');

  const row = ([label, value]: [string, string]) =>
    `<tr><th align="left" valign="top" style="padding:6px 16px 6px 0;color:#6b6a66;font-weight:500;white-space:nowrap">${escapeHtml(label)}</th><td style="padding:6px 0">${escapeHtml(value)}</td></tr>`;
  const block = ([label, value]: [string, string]) =>
    `<h2 style="margin:24px 0 6px;font-size:14px;color:#6b6a66;font-weight:500">${escapeHtml(label)}</h2><p style="margin:0;white-space:pre-wrap">${escapeHtml(value)}</p>`;

  const html = `<!doctype html><html lang="pt-BR"><body style="margin:0;padding:24px;background:#f8f8f6;color:#121212;font:15px/1.6 -apple-system,Segoe UI,Helvetica,Arial,sans-serif">
<div style="max-width:640px;margin:0 auto;background:#fff;padding:28px;border:1px solid #dcd8cf">
<p style="margin:0 0 4px;font-size:12px;letter-spacing:.14em;text-transform:uppercase;color:#84652f">JC Business Club</p>
<h1 style="margin:0 0 20px;font-size:20px;font-weight:500">Nova solicitação de participação</h1>
<table role="presentation" cellspacing="0" cellpadding="0" style="border-collapse:collapse">${details.map(row).join('')}</table>
${answers.map(block).join('')}
<p style="margin:28px 0 0;font-size:13px;color:#6b6a66">${sourceLine ? `Origem: ${escapeHtml(sourceLine)}<br>` : ''}Enviado em ${escapeHtml(date)} (horário de Brasília)</p>
</div></body></html>`;

  return { subject, text, html };
}
