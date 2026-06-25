import type { ReactNode } from 'react';
import { ScreenHeader } from '@/components/layout/ScreenHeader';
import { Field } from '@/components/ui/Field';
import { Select } from '@/components/ui/Select';
import { BudgetSettings } from '@/components/settings/BudgetSettings';
import { CategoryManager } from '@/components/settings/CategoryManager';
import { DataSettings } from '@/components/settings/DataSettings';
import { ThemeNote } from '@/components/settings/ThemeNote';
import { useAppStore } from '@/hooks/useAppStore';

const CURRENCIES = ['USD', 'EUR', 'GBP', 'CAD', 'AUD', 'JPY', 'INR', 'CNY', 'CHF', 'BRL', 'MXN', 'ZAR'];

export function SettingsScreen() {
  const { state, dispatch } = useAppStore();

  return (
    <>
      <ScreenHeader title="Settings" />

      <div className="flex flex-col gap-7 px-4 py-4">
        <Section title="General">
          <Field label="Currency">
            <Select
              value={state.settings.currency}
              onChange={(e) => dispatch({ type: 'settings/set', patch: { currency: e.target.value } })}
            >
              {CURRENCIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </Select>
          </Field>
          <ThemeNote />
        </Section>

        <Section title="Budgets">
          <BudgetSettings />
        </Section>

        <Section title="Categories">
          <CategoryManager />
        </Section>

        <Section title="Data">
          <DataSettings />
        </Section>

        <p className="pb-4 text-center text-xs text-muted">
          Expense Tracker · all data stays on your device
        </p>
      </div>
    </>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section>
      <h2 className="mb-2.5 px-1 text-xs font-semibold uppercase tracking-wide text-muted">
        {title}
      </h2>
      <div className="flex flex-col gap-4">{children}</div>
    </section>
  );
}
