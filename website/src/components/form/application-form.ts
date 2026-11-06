/**
 * Progressive enhancement for the membership application form.
 *
 * Without JavaScript the form posts natively and the server renders errors or
 * the confirmation. With it: instant validation (same rules as the server),
 * an error summary on submit, submission without a page reload, and focus
 * management for every state change.
 */
import { actions, isActionError } from 'astro:actions';
import { FIELD_NAMES, SPAM_FIELDS, type FieldErrors, type FieldName } from '@/lib/application/fields';
import type { FieldMessages } from '@/lib/application/messages';
import { readValues, validateApplication, validateField } from '@/lib/application/validate';

interface ClientCopy {
  fields: FieldMessages;
  assumeBrazil: boolean;
  errorPrefix: string;
  submit: string;
  submitting: string;
  verificationPending: string;
  failures: Record<'verification' | 'unavailable' | 'delivery' | 'network', string>;
}

declare global {
  interface Window {
    turnstile?: { reset: (widget?: string | HTMLElement) => void };
  }
}

const isFieldName = (name: string): name is FieldName => (FIELD_NAMES as readonly string[]).includes(name);

export function initApplicationForm(root: HTMLElement) {
  const form = root.querySelector<HTMLFormElement>('[data-form]');
  const copyEl = root.querySelector('[data-copy]');
  if (!form || !copyEl?.textContent) return;

  const copy = JSON.parse(copyEl.textContent) as ClientCopy;
  const options = { assumeBrazil: copy.assumeBrazil };
  const summary = form.querySelector<HTMLElement>('[data-summary]')!;
  const alert = form.querySelector<HTMLElement>('[data-alert]')!;
  const submit = form.querySelector<HTMLButtonElement>('[data-submit]')!;
  const submitLabel = submit.querySelector('span') ?? submit;
  const turnstile = form.querySelector<HTMLElement>('[data-turnstile]');
  const touched = new Set<FieldName>();
  let submitting = false;

  // Our messages replace the browser's validation bubbles.
  form.noValidate = true;

  const wrapper = (name: FieldName) => form.querySelector<HTMLElement>(`[data-field="${name}"]`);
  const control = (name: FieldName) => form.querySelector<HTMLElement>(`#field-${name}`);

  function setError(name: FieldName, code?: keyof FieldMessages[FieldName]) {
    const field = wrapper(name);
    const input = control(name);
    const slot = field?.querySelector<HTMLElement>('[data-error]');
    if (!field || !input || !slot) return;

    slot.replaceChildren();
    if (code) {
      const prefix = document.createElement('span');
      prefix.className = 'visually-hidden';
      prefix.textContent = `${copy.errorPrefix} `;
      slot.append(prefix, copy.fields[name][code]);
      field.setAttribute('data-invalid', '');
      input.setAttribute('aria-invalid', 'true');
    } else {
      field.removeAttribute('data-invalid');
      input.removeAttribute('aria-invalid');
    }
  }

  const values = () => readValues(new FormData(form));

  function checkField(name: FieldName) {
    setError(name, validateField(name, values(), options));
  }

  function showErrors(errors: FieldErrors) {
    for (const name of FIELD_NAMES) setError(name, errors[name]);

    const list = summary.querySelector('ul')!;
    list.replaceChildren(
      ...FIELD_NAMES.filter((name) => errors[name]).map((name) => {
        const item = document.createElement('li');
        const link = document.createElement('a');
        link.href = `#field-${name}`;
        link.textContent = copy.fields[name][errors[name]!];
        link.addEventListener('click', (event) => {
          event.preventDefault();
          control(name)?.focus();
        });
        item.append(link);
        return item;
      }),
    );
    summary.hidden = false;
    summary.focus();
  }

  function showAlert(message: string) {
    alert.textContent = message;
    alert.hidden = false;
  }

  function clearMessages() {
    summary.hidden = true;
    alert.hidden = true;
    alert.textContent = '';
  }

  function setSubmitting(state: boolean) {
    submitting = state;
    submit.setAttribute('aria-disabled', String(state));
    form!.setAttribute('aria-busy', String(state));
    submitLabel.textContent = state ? copy.submitting : copy.submit;
  }

  function resetTurnstile() {
    if (turnstile) window.turnstile?.reset(turnstile);
  }

  function showSuccess(name: string, mode: string) {
    const template = root.querySelector<HTMLTemplateElement>('[data-success-template]');
    if (!template) return;
    const panel = template.content.firstElementChild!.cloneNode(true) as HTMLElement;

    const greeting = panel.querySelector<HTMLElement>('[data-greeting]');
    if (greeting && name) {
      greeting.textContent = (greeting.dataset.greeting ?? '').replace('{name}', name);
      greeting.hidden = false;
    }
    const dev = panel.querySelector<HTMLElement>('[data-dev]');
    if (dev) dev.hidden = mode !== 'dev';

    form!.replaceWith(panel);
    panel.querySelector<HTMLElement>('[data-success-title]')?.focus();
    root.dispatchEvent(new CustomEvent('jc:application-submitted', { bubbles: true }));
  }

  // Validate a field when the visitor leaves it (once they have typed in it),
  // then live while it is invalid so the error clears as soon as it is fixed.
  form.addEventListener('focusout', (event) => {
    const target = event.target as HTMLInputElement;
    if (!isFieldName(target.name) || target.type === 'checkbox') return;
    if (target.value || touched.has(target.name)) {
      touched.add(target.name);
      checkField(target.name);
    }
  });

  form.addEventListener('input', (event) => {
    const target = event.target as HTMLInputElement | HTMLTextAreaElement;
    const counter = target.parentElement?.querySelector<HTMLElement>('[data-counter]');
    if (counter) {
      counter.textContent = (counter.dataset.counter ?? '')
        .replace('{count}', String(target.value.length))
        .replace('{max}', counter.dataset.max ?? '');
    }
    if (isFieldName(target.name) && wrapper(target.name)?.hasAttribute('data-invalid')) {
      checkField(target.name);
    }
  });

  // "Qual segmento?" only applies when "Outro" is selected.
  const segment = control('segment') as HTMLSelectElement | null;
  const syncSegment = () => {
    const other = wrapper('segmentOther');
    if (!other || !segment) return;
    other.toggleAttribute('data-active', segment.value === 'outro');
    if (segment.value !== 'outro') setError('segmentOther');
  };
  segment?.addEventListener('change', () => {
    syncSegment();
    if (wrapper('segment')?.hasAttribute('data-invalid')) checkField('segment');
  });
  syncSegment();

  control('consent')?.addEventListener('change', () => {
    if (wrapper('consent')?.hasAttribute('data-invalid')) checkField('consent');
  });

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (submitting) return;
    clearMessages();

    const result = validateApplication(values(), options);
    if (!result.ok) {
      showErrors(result.errors);
      return;
    }

    const data = new FormData(form);
    if (turnstile && !data.get(SPAM_FIELDS.turnstile)) {
      showAlert(copy.verificationPending);
      return;
    }

    setSubmitting(true);
    try {
      const { data: response, error } = await actions.apply(data);
      if (error) {
        const code = isActionError(error) ? error.message : '';
        showAlert(copy.failures[code as keyof ClientCopy['failures']] ?? copy.failures.delivery);
        resetTurnstile();
      } else if (response.status === 'invalid') {
        showErrors(response.errors);
      } else {
        showSuccess(response.name, response.mode);
        return;
      }
    } catch {
      showAlert(copy.failures.network);
      resetTurnstile();
    }
    setSubmitting(false);
    if (!alert.hidden) alert.focus();
  });
}
