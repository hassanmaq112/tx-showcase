import { KeyboardAvoidingView, Platform, Pressable, ScrollView, View } from 'react-native';
import { useRouter } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';
import { ScreenHeader } from '@/components/layout/ScreenHeader';
import { ExpenseForm } from '@/components/expense/ExpenseForm';
import { useTheme } from '@/theme';

export function AddExpenseScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  return (
    <View style={{ flex: 1, backgroundColor: colors.canvas }}>
      <ScreenHeader
        title="Add expense"
        leading={
          <Pressable onPress={() => router.back()} hitSlop={8}>
            <ChevronLeft size={26} color={colors.ink} />
          </Pressable>
        }
      />
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={{ paddingBottom: 40 }}>
          <ExpenseForm />
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}
