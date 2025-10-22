import { Divider } from '@drinkweise/ui/Divider';
import { Text } from '@drinkweise/ui/Text';
import { Ionicons } from '@expo/vector-icons';
import { View, TouchableOpacity } from 'react-native';

interface ItemProps {
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
}

interface SettingsSectionProps {
  title: string;
  items: (ItemProps & {
    customComponent?: (props: ItemProps) => React.ReactNode;
  })[];
}

export function SettingsSection({ title, items }: SettingsSectionProps) {
  return (
    <View className='mb-6'>
      {title && (
        <Text variant='caption1' className='mb-3 px-6 font-medium uppercase text-muted'>
          {title}
        </Text>
      )}
      <View className='mx-6 rounded-xl bg-card'>
        {items.map((item, index) => (
          <View key={item.title}>
            {item.customComponent !== undefined ? (
              <item.customComponent title={item.title} icon={item.icon} onPress={item.onPress} />
            ) : (
              <TouchableOpacity
                className='flex-row items-center px-4 py-3'
                onPress={item.onPress}
                activeOpacity={0.7}>
                <View className='mr-3'>
                  <Ionicons name={item.icon} size={22} className='text-foreground' />
                </View>
                <View className='flex-1'>
                  <Text variant='body' className='font-medium'>
                    {item.title}
                  </Text>
                </View>
                <Ionicons name='chevron-forward-outline' size={16} className='text-muted' />
              </TouchableOpacity>
            )}
            {index < items.length - 1 && <Divider className='mx-4 my-0' />}
          </View>
        ))}
      </View>
    </View>
  );
}
