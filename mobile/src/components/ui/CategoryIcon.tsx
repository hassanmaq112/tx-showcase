import {
  Car,
  CircleDashed,
  Clapperboard,
  Coffee,
  Dog,
  Dumbbell,
  Gift,
  GraduationCap,
  HeartPulse,
  Home,
  PiggyBank,
  Plane,
  ReceiptText,
  ShoppingBag,
  Smartphone,
  Utensils,
  Wrench,
  type LucideIcon,
} from 'lucide-react-native';

// Map stored icon-name strings to lucide-react-native components (same names as web).
const ICONS: Record<string, LucideIcon> = {
  Utensils,
  Car,
  Clapperboard,
  ShoppingBag,
  ReceiptText,
  HeartPulse,
  Plane,
  Home,
  Dog,
  Gift,
  GraduationCap,
  Dumbbell,
  Coffee,
  Smartphone,
  Wrench,
  PiggyBank,
  CircleDashed,
};

interface CategoryIconProps {
  name: string;
  size?: number;
  color?: string;
}

export function CategoryIcon({ name, size = 18, color }: CategoryIconProps) {
  const Icon = ICONS[name] ?? CircleDashed;
  return <Icon size={size} color={color} />;
}
