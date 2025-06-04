import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInUp, FadeInRight, SlideInDown, FadeInLeft } from 'react-native-reanimated';
import { useTheme } from '~/contexts/ThemeContext';

interface WeatherDay {
  day: string;
  date: string;
  high: number;
  low: number;
  condition: string;
  icon: string;
  precipitation: number;
}

interface WeatherForecastProps {
  forecasts?: WeatherDay[];
  currentTemp?: number;
  currentCondition?: string;
  location?: string;
}

const weatherIcons: { [key: string]: string } = {
  'sunny': 'wb-sunny', 'cloudy': 'cloud', 'rainy': 'grain',
  'stormy': 'flash-on', 'snowy': 'ac-unit'
};

const weatherGradients: { [key: string]: readonly [string, string] } = {
  'sunny': ['#FFD700', '#FFA500'] as const,
  'cloudy': ['#87CEEB', '#B0C4DE'] as const,
  'rainy': ['#4682B4', '#2F4F4F'] as const,
  'stormy': ['#483D8B', '#2F2F2F'] as const,
  'snowy': ['#E6E6FA', '#B0E0E6'] as const
};

export const WeatherForecast = ({ 
  forecasts = [], 
  currentTemp = 24, 
  currentCondition = "sunny", 
  location = "Current Location" 
}: WeatherForecastProps) => {
  const { colors } = useTheme();

  const getWeatherIcon = (condition: string) => 
    weatherIcons[condition.toLowerCase()] || weatherIcons.sunny;

  const getWeatherGradient = (condition: string) => 
    weatherGradients[condition.toLowerCase()] || weatherGradients.sunny;

  const WeatherCard = ({ forecast, index }: { forecast: WeatherDay; index: number }) => {
    const gradient = getWeatherGradient(forecast.condition);
    return (
      <Animated.View entering={FadeInRight.delay(400 + index * 150).duration(600)}
        style={{ width: 100, marginRight: 12 }}>
        <View style={{
          backgroundColor: colors.cardBase,
          shadowColor: colors.text, 
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1, 
          shadowRadius: 8, 
          elevation: 4,
          borderRadius: 12, 
          padding: 12, 
          alignItems: 'center',
          borderWidth: 1, 
          borderColor: colors.border
        }}>
          <Animated.Text entering={FadeInUp.delay(500 + index * 150).duration(500)}
            style={{ color: colors.text, fontWeight: 'bold', fontSize: 12, marginBottom: 6 }}>
            {forecast.day}
          </Animated.Text>
          <Animated.View entering={SlideInDown.delay(600 + index * 150).duration(500)}
            style={{ width: 36, height: 36, borderRadius: 18, alignItems: 'center', 
              justifyContent: 'center', marginBottom: 8 }}>
            <LinearGradient colors={gradient} style={{
              width: '100%', height: '100%', borderRadius: 18,
              alignItems: 'center', justifyContent: 'center'
            }}>
              <MaterialIcons name={getWeatherIcon(forecast.condition) as any} 
                size={20} color="white" />
            </LinearGradient>
          </Animated.View>
          <Animated.View entering={FadeInUp.delay(700 + index * 150).duration(500)}
            style={{ alignItems: 'center' }}>
            <Text style={{ color: colors.text, fontWeight: 'bold', fontSize: 15 }}>
              {forecast.high}°
            </Text>
            <Text style={{ color: colors.textSecondary, fontSize: 12 }}>
              {forecast.low}°
            </Text>
          </Animated.View>
          <Animated.View entering={FadeInLeft.delay(800 + index * 150).duration(500)}
            style={{ flexDirection: 'row', alignItems: 'center', marginTop: 6 }}>
            <MaterialIcons name="opacity" size={10} color={colors.textSecondary} />
            <Text style={{ color: colors.textSecondary, fontSize: 10, marginLeft: 2 }}>
              {forecast.precipitation}%
            </Text>
          </Animated.View>
        </View>
      </Animated.View>
    );
  };

  const currentGradient = getWeatherGradient(currentCondition);

  return (
    <Animated.View entering={FadeInUp.delay(200).duration(800)} style={{ paddingBottom: 24 }}>
      {/* Unified Header Style */}
      <LinearGradient colors={currentGradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
        style={{ paddingHorizontal: 24, paddingVertical: 32 }}>
        <Animated.View entering={SlideInDown.delay(300).duration(600)}
          style={{ flexDirection: 'row', alignItems: 'center' }}>
          <View style={{
            width: 48, height: 48, borderRadius: 16,
            alignItems: 'center', justifyContent: 'center', marginRight: 16,
            backgroundColor: 'rgba(255,255,255,0.15)'
          }}>
            <MaterialIcons name={getWeatherIcon(currentCondition) as any} 
              size={28} color="white" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ color: 'white', fontSize: 24, fontWeight: 'bold', marginBottom: 4 }}>
              Weather Forecast
            </Text>
            <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 14 }}>
              {location}
            </Text>
          </View>
        </Animated.View>
      </LinearGradient>

      <View style={{ padding: 24 }}>
        <Animated.View entering={FadeInUp.delay(500).duration(700)} style={{
          backgroundColor: colors.backgroundSecondary,
          borderRadius: 24, padding: 24, marginBottom: 24
        }}>
          <Animated.Text entering={FadeInLeft.delay(600).duration(500)}
            style={{ color: colors.text, fontSize: 36, fontWeight: 'bold', marginBottom: 8 }}>
            {currentTemp}°C
          </Animated.Text>
          <Animated.Text entering={FadeInLeft.delay(700).duration(500)}
            style={{ color: colors.textSecondary, fontSize: 18, textTransform: 'capitalize' }}>
            {currentCondition}
          </Animated.Text>
        </Animated.View>

        {forecasts.length > 0 && (
          <Animated.View entering={FadeInUp.delay(800).duration(600)} style={{
            backgroundColor: 'transparent',
            borderRadius: 16,
            padding: 16
          }}>
            <Text style={{ color: colors.text, fontSize: 18, fontWeight: 'bold', marginBottom: 16 }}>
              {forecasts.length}-Day Forecast
            </Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: 4 }}>
              {forecasts.map((forecast, index) => (
                <WeatherCard key={`${forecast.day}-${index}`} forecast={forecast} index={index} />
              ))}
            </ScrollView>
          </Animated.View>
        )}
      </View>

      <LinearGradient colors={['transparent', `${currentGradient[1]}33`]} style={{ height: 4 }} />
    </Animated.View>
  );
};