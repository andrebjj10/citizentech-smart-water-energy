import React from 'react';
import {View, Text, StyleSheet, Pressable} from 'react-native';

export default function OfflineBanner({error, hasData = false, onRetry}) {
  if (!error) return null;
  const offline = ['connection', 'timeout'].includes(error.kind);
  return <View style={s.box} accessibilityLiveRegion="polite">
    <Text style={s.title}>{offline ? 'API fora do ar ou sem conexão' : 'Não foi possível atualizar'}</Text>
    <Text style={s.text}>{error.message}</Text>
    <Text style={s.text}>{hasData ? 'Os últimos dados recebidos continuam na tela.' : 'Ainda não há dados disponíveis nesta tela.'}</Text>
    {onRetry && <Pressable onPress={onRetry} accessibilityRole="button" style={s.retry}>
      <Text style={s.title}>Tentar novamente</Text>
    </Pressable>}
  </View>;
}
const s = StyleSheet.create({
  box: {backgroundColor: '#48252D', padding: 14, borderRadius: 14, marginBottom: 16},
  title: {color: '#FFD4D7', fontWeight: '700'},
  text: {color: '#FFD4D7', fontSize: 12, marginTop: 6, lineHeight: 18},
  retry: {paddingVertical: 10, marginTop: 4},
});
