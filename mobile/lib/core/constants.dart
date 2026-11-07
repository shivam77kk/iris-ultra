import 'package:flutter/foundation.dart';

String get apiUrl {
  if (kIsWeb) return 'http://localhost:5000';
  if (defaultTargetPlatform == TargetPlatform.android) {
    return 'http://127.0.0.1:5000'; 
    // return 'http://10.0.2.2:5000'; // Default for Android Emulator
  }
  return 'http://127.0.0.1:5000';
}

String get frontendUrl {
  if (kIsWeb) return 'http://localhost:3000';
  if (defaultTargetPlatform == TargetPlatform.android) {
    return 'http://127.0.0.1:3000';
    // return 'http://10.0.2.2:3000'; // Default for Android Emulator
  }
  return 'http://127.0.0.1:3000';
}
const Map<String, String> modelDisplayNames = {
  'mzai:moonshotai/Kimi-K2.6': 'Kimi K2.6',
  'anthropic:claude-haiku-4-5': 'Claude Haiku 4.5',
  'anthropic:claude-sonnet-4-6': 'Claude Sonnet 4.6',
  'Local KB': 'Local KB',
};

const Map<String, Map<String, dynamic>> tierColors = {
  'simple': {'bg': 0xFF6BCB77, 'label': 'Simple'},
  'medium': {'bg': 0xFFFFD93D, 'label': 'Medium'},
  'complex': {'bg': 0xFFFF6B6B, 'label': 'Complex'},
  'cached': {'bg': 0xFF4D96FF, 'label': 'Cached'},
};

const Map<String, Map<String, dynamic>> budgetModes = {
  'normal': {'color': 0xFF6BCB77, 'label': 'Normal'},
  'caution': {'color': 0xFFFFD93D, 'label': 'Caution'},
  'warning': {'color': 0xFFFFD93D, 'label': 'Warning'},
  'critical': {'color': 0xFFFF6B6B, 'label': 'Critical'},
  'exceeded': {'color': 0xFFDC2626, 'label': 'Exceeded'},
};
