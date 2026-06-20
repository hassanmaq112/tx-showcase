import {
  Car,
  Clapperboard,
  CircleDashed,
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
} from 'lucide-react';

// Map stored icon-name strings to lucide components. Unknown names fall back.
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
  className?: string;
}

export function CategoryIcon({ name, size = 18, className }: CategoryIconProps) {
  const Icon = ICONS[name] ?? CircleDashed;
  return <Icon size={size} className={className} aria-hidden />;
}
