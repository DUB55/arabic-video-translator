/**
 * Custom Button Component with Liquid Glass Effect
 */

import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { colors } from '../../styles/colors';
import { layout } from '../../styles/layout';
import { typography } from '../../styles/typography';

export function Button({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  style,
  textStyle,
  ...props
}) {
  const buttonStyle = [
    styles.button,
    styles[variant],
    styles[size],
    disabled && styles.disabled,
    style,
  ];

  const buttonTextStyle = [
    styles.buttonText,
    variant === 'accent' && styles.buttonTextAccent,
    variant === 'glass' && styles.buttonTextGlass,
    disabled && styles.buttonTextDisabled,
    textStyle,
  ];

  return (
    <TouchableOpacity
      style={buttonStyle}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
      {...props}
    >
      {loading ? (
        <ActivityIndicator
          color={variant === 'accent' ? colors.background : variant === 'glass' ? colors.text : colors.text}
          size="small"
        />
      ) : (
        <Text style={buttonTextStyle}>{title}</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: layout.radius.lg,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: layout.spacing.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  primary: {
    backgroundColor: colors.primary,
  },
  accent: {
    backgroundColor: colors.accent,
  },
  secondary: {
    backgroundColor: colors.glassLight,
    borderWidth: 1,
    borderColor: colors.glassBorder,
  },
  glass: {
    backgroundColor: colors.glassLight,
    borderWidth: 1,
    borderColor: colors.glassBorder,
    backdropFilter: 'blur(20px)',
  },
  small: {
    height: layout.buttonHeight.small,
    paddingHorizontal: layout.spacing.md,
    borderRadius: layout.radius.md,
  },
  medium: {
    height: layout.buttonHeight.medium,
  },
  large: {
    height: layout.buttonHeight.large,
    paddingHorizontal: layout.spacing.xl,
  },
  disabled: {
    opacity: 0.5,
  },
  buttonText: {
    ...typography.button,
    color: colors.text,
    fontWeight: '600',
  },
  buttonTextAccent: {
    color: colors.background,
  },
  buttonTextGlass: {
    color: colors.text,
  },
  buttonTextDisabled: {
    opacity: 0.7,
  },
});
