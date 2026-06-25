import { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Wallet } from 'lucide-react-native';
import { Button } from '@/components/ui/Button';
import { Field } from '@/components/ui/Field';
import { Input } from '@/components/ui/Input';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/useToast';
import { useTheme } from '@/theme';

export function SignInScreen() {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const { signIn, signUp } = useAuth();
  const { show } = useToast();
  const [mode, setMode] = useState<'in' | 'up'>('in');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string>();

  const submit = async () => {
    setError(undefined);
    if (!email.trim() || password.length < 6) {
      setError('Enter an email and a password (6+ characters).');
      return;
    }
    setBusy(true);
    const err = mode === 'in' ? await signIn(email, password) : await signUp(email, password);
    setBusy(false);
    if (err) setError(err);
    else if (mode === 'up') show('Account created. Check your email if confirmation is on.', 'info');
  };

  return (
    <View style={[styles.root, { backgroundColor: colors.canvas, paddingTop: insets.top + 40, paddingBottom: insets.bottom + 24 }]}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.body}>
        <View style={styles.brand}>
          <View style={[styles.logo, { backgroundColor: colors.brand }]}>
            <Wallet size={30} color={colors.brandInk} />
          </View>
          <Text style={[styles.title, { color: colors.ink }]}>Expense Tracker</Text>
          <Text style={[styles.subtitle, { color: colors.muted }]}>
            {mode === 'in' ? 'Sign in to sync your expenses' : 'Create an account to get started'}
          </Text>
        </View>

        <View style={styles.form}>
          <Field label="Email" error={error}>
            <Input
              value={email}
              onChangeText={setEmail}
              placeholder="you@example.com"
              autoCapitalize="none"
              keyboardType="email-address"
              autoComplete="email"
            />
          </Field>
          <Field label="Password">
            <Input value={password} onChangeText={setPassword} placeholder="••••••••" secureTextEntry />
          </Field>
          <Button title={mode === 'in' ? 'Sign in' : 'Create account'} size="lg" fullWidth loading={busy} onPress={submit} />
          <Pressable onPress={() => { setMode(mode === 'in' ? 'up' : 'in'); setError(undefined); }} style={styles.toggle}>
            <Text style={[styles.toggleText, { color: colors.muted }]}>
              {mode === 'in' ? "Don't have an account? " : 'Already have an account? '}
              <Text style={{ color: colors.brand, fontWeight: '600' }}>{mode === 'in' ? 'Sign up' : 'Sign in'}</Text>
            </Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, paddingHorizontal: 24 },
  body: { flex: 1, justifyContent: 'center' },
  brand: { alignItems: 'center', marginBottom: 36 },
  logo: { width: 64, height: 64, borderRadius: 18, alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
  title: { fontSize: 24, fontWeight: '700' },
  subtitle: { fontSize: 14, marginTop: 6, textAlign: 'center' },
  form: { gap: 16 },
  toggle: { alignItems: 'center', paddingVertical: 8 },
  toggleText: { fontSize: 14 },
});
