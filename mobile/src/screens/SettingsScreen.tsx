import type { ReactNode } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { ScreenHeader } from '@/components/layout/ScreenHeader';
import { Field } from '@/components/ui/Field';
import { Select } from '@/components/ui/Select';
import { BudgetSettings } from '@/components/settings/BudgetSettings';
import { CategoryManager } from '@/components/settings/CategoryManager';
import { DataSettings } from '@/components/settings/DataSettings';
import { ThemeNote } from '@/components/settings/ThemeNote';
import { useAppStore } from '@/hooks/useAppStore';
import { useTheme } from '@/theme';

const CURRENCIES = ['USD', 'EUR', 'GBP', 'CAD', 'AUD', 'JPY', 'INR', 'CNY', 'CHF', 'BRL', 'MXN', 'ZAR'];

export function SettingsScreen() {
  const { state, dispatch } = useAppStore();
  const { colors } = useTheme();

  return (
    <View style={{ flex: 1, backgroundColor: colors.canvas }}>
      <ScreenHeader title="Settings" />
      <ScrollView contentContainerStyle={styles.content}>
        <Section title="General">
          <Field label="Currency">
            <Select
              value={state.settings.currency}
              title="Currency"
              options={CURRENCIES.map((c) => ({ label: c, value: c }))}
              onChange={(currency) => dispatch({ type: 'settings/set', patch: { currency } })}
            />
          </Field>
          <ThemeNote />
        </Section>

        <Section title="Budgets"><BudgetSettings /></Section>
        <Section title="Categories"><CategoryManager /></Section>
        <Section title="Data"><DataSettings /></Section>

        <Text style={[styles.footer, { color: colors.muted }]}>Expense Tracker · data stays on your device</Text>
      </ScrollView>
    </View>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  const { colors } = useTheme();
  return (
    <View style={{ gap: 12 }}>
      <Text style={[styles.sectionTitle, { color: colors.muted }]}>{title.toUpperCase()}</Text>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  content: { padding: 16, gap: 24, paddingBottom: 120 },
  sectionTitle: { fontSize: 12, fontWeight: '600', letterSpacing: 0.4 },
  footer: { textAlign: 'center', fontSize: 12, paddingVertical: 8 },
});
