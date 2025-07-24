import { Divider } from '@drinkweise/components/ui/Divider';
import { Text } from '@drinkweise/components/ui/Text';
import { type ColorScheme, useColorScheme } from '@drinkweise/lib/useColorScheme';
import { Ionicons } from '@expo/vector-icons';
import { ScrollView, TouchableOpacity, View } from 'react-native';

export default function ThemeSettingsPage() {
  const { colors, setColorScheme, colorScheme } = useColorScheme();

  const themeOptions: {
    key: ColorScheme;
    title: string;
    subtitle: string;
    activeIcon?: keyof typeof Ionicons.glyphMap;
    inactiveIcon?: keyof typeof Ionicons.glyphMap;
  }[] = [
    {
      key: 'light',
      title: 'Light',
      subtitle: 'Always use light theme',
      activeIcon: 'sunny',
      inactiveIcon: 'sunny-outline',
    },
    {
      key: 'dark',
      title: 'Dark',
      subtitle: 'Always use dark theme',
      activeIcon: 'moon',
      inactiveIcon: 'moon-outline',
    },
    {
      key: 'system',
      title: 'System',
      subtitle: 'Follow system setting',
      activeIcon: 'phone-portrait',
      inactiveIcon: 'phone-portrait-outline',
    },
  ];

  return (
    <ScrollView className='flex-1 bg-background'>
      <View className='px-6 py-4'>
        <View className='rounded-xl bg-card'>
          {themeOptions.map((option, index) => (
            <View key={option.key}>
              <TouchableOpacity
                className='flex-row items-center px-4 py-3'
                onPress={() => setColorScheme(option.key)}
                activeOpacity={0.7}>
                <View className='mr-3'>
                  <Ionicons
                    name={colorScheme === option.key ? option.activeIcon : option.inactiveIcon}
                    size={22}
                    color={colors.foreground}
                  />
                </View>
                <View className='flex-1'>
                  <Text variant='body' className='font-medium'>
                    {option.title}
                  </Text>
                  <Text variant='caption1' className='text-muted'>
                    {option.subtitle}
                  </Text>
                </View>
                {colorScheme === option.key && (
                  <Ionicons name='checkmark' size={20} color={colors.primary} />
                )}
              </TouchableOpacity>
              {index < themeOptions.length - 1 && (
                <Divider className='mx-4 my-0' thickness='thin' />
              )}
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}
