import { useColorScheme } from '@drinkweise/lib/useColorScheme';
import {
  Icon,
  type MaterialCommunityIconsProps,
  type MaterialIconName,
  type SFSymbolProps,
} from '@roninoss/icons';
import * as WebBrowser from 'expo-web-browser';
import { useCallback } from 'react';
import { View } from 'react-native';
import Animated, { FadeInDown, FadeInUp, SlideInLeft, SlideInRight } from 'react-native-reanimated';

import { Text } from '../ui/Text';

type Feature = {
  title: string;
  description: string;
  icon: MaterialIconName;
  iosIcon?: SFSymbolProps['name'];
  materialIcon?: MaterialCommunityIconsProps['name'];
};

const FEATURES: Feature[] = [
  {
    title: 'Estimate Your BAC',
    description:
      'See estimated blood alcohol levels based on your drinks and body metrics, helping you make informed decisions.',
    icon: 'heart-outline',
    iosIcon: 'wineglass',
    materialIcon: 'glass-wine',
  },
  {
    title: 'See Your Drinking Trends',
    description:
      'Log your drinks easily and see your drinking patterns over time with visual graphs.',
    icon: 'chart-timeline-variant',
  },
  {
    title: 'Daily Check-In',
    description: 'Log your alcohol consumption daily and visualize your progress.',
    icon: 'calendar-check',
  },
] as const;

export function CompleteOnboardingStep({ isActive }: { isActive: boolean }) {
  const { colors } = useColorScheme();

  const openBrowser = useCallback((path: string) => {
    // TODO: This URL is going to be changed when we deploy the app
    WebBrowser.openBrowserAsync(`https://sipcious.vercel.app/${path}`, {
      dismissButtonStyle: 'done',
      enableBarCollapsing: true,
      presentationStyle: WebBrowser.WebBrowserPresentationStyle.FORM_SHEET,
    });
  }, []);

  if (!isActive) {
    return null;
  }

  return (
    <View className='flex-1 justify-between gap-4 px-8 py-4'>
      <Animated.View className='ios:pt-8 pt-12' entering={FadeInUp.delay(200)}>
        <Text variant='largeTitle' className='ios:text-left ios:font-black text-center font-bold'>
          You're all set!
        </Text>
        <Text
          variant='largeTitle'
          className='ios:text-left ios:font-black text-center font-bold text-primary'>
          Start tracking your drinks now.
        </Text>
      </Animated.View>

      <View className='gap-8'>
        {isActive &&
          FEATURES.map((feature, index) => (
            <Animated.View
              key={feature.title}
              className='flex-row gap-4'
              entering={(index % 2 === 0 ? SlideInRight : SlideInLeft).delay(index * 200)}>
              <View className='pt-px'>
                <Icon
                  namingScheme='material'
                  name={feature.icon}
                  size={38}
                  color={colors.primary}
                  materialIcon={feature.materialIcon ? { name: feature.materialIcon } : {}}
                  ios={{
                    renderingMode: 'hierarchical',
                    ...(feature.iosIcon ? { name: feature.iosIcon } : {}),
                  }}
                />
              </View>
              <View className='flex-1'>
                <Text className='font-bold'>{feature.title}</Text>
                <Text variant='footnote'>{feature.description}</Text>
              </View>
            </Animated.View>
          ))}
      </View>

      <Animated.View entering={FadeInDown.delay(200)}>
        <View className='items-center'>
          <Icon
            name='account-multiple'
            size={24}
            color={colors.primary}
            ios={{ renderingMode: 'hierarchical' }}
          />
          <Text variant='caption2' className='pt-1 text-center'>
            Tracking your alcohol consumption is for informational purposes only. Please drink
            responsibly.
          </Text>
          <Text variant='caption2' className='pt-1 text-center'>
            {'By using this app, you accept our '}
            <Text
              variant='caption2'
              className='text-center text-primary'
              suppressHighlighting
              onPress={() => openBrowser('terms-of-service')}>
              Terms of Service
            </Text>
            {' and '}
            <Text
              variant='caption2'
              className='text-primary'
              suppressHighlighting
              onPress={() => openBrowser('privacy-policy')}>
              {' Privacy Policy.'}
            </Text>
          </Text>
        </View>
      </Animated.View>
    </View>
  );
}
