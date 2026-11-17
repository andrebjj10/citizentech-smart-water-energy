import React from 'react';
import {View, Text, ScrollView, Switch, StyleSheet, RefreshControl, ActivityIndicator} from 'react-native';
import {api} from '../services/api';
import useStationResource from '../hooks/useStationResource';
import OfflineBanner from '../components/OfflineBanner';
import {colors} from '../theme/colors';

export default function ActuatorsScreen() {
  const {data: items, error, loading, saving, refresh, mutate} = useStationResource(api.actuators, []);
  const toggle = actuator => mutate(async current => {
    const updated = await api.toggleActuator(actuator.id, !actuator.enabled);
    return current.map(item => item.id === updated.id ? updated : item);
  });
  return <ScrollView style={s.root} contentContainerStyle={s.content}
    refreshControl={<RefreshControl refreshing={loading} onRefresh={refresh} tintColor={colors.accent}/>}>
    <Text style={s.title}>Atuadores</Text>
    <Text style={s.intro}>Controle simulado dos equipamentos da estação.</Text>
    <OfflineBanner error={error} hasData={items.length > 0} onRetry={refresh}/>
    {(loading || saving) && <ActivityIndicator color={colors.accent} style={{marginBottom: 16}}/>}
    {!loading && !error && items.length === 0 && <Text style={s.note}>Nenhum atuador cadastrado.</Text>}
    {items.map(actuator => <View key={actuator.id} style={s.card}>
      <View style={{flex: 1}}><Text style={s.name}>{actuator.name}</Text>
        <Text style={s.sub}>{actuator.enabled ? 'Ligado' : 'Desligado'}</Text></View>
      <Switch value={actuator.enabled} onValueChange={() => toggle(actuator)}
        accessibilityLabel={actuator.name} disabled={!!error || loading || saving}
        trackColor={{true: colors.accent, false: colors.border}} thumbColor={colors.text}/>
    </View>)}
    <Text style={s.note}>Os estados são gravados no banco H2. Nenhum dispositivo físico é acionado. A tela atualiza ao abrir e a cada 10 segundos.</Text>
  </ScrollView>;
}
const s = StyleSheet.create({
  root: {flex: 1, backgroundColor: colors.bg}, content: {padding: 20, paddingBottom: 40},
  title: {color: colors.text, fontSize: 30, fontWeight: '800', marginTop: 12},
  intro: {color: colors.muted, marginTop: 7, marginBottom: 18},
  card: {backgroundColor: colors.surface, borderColor: colors.border, borderWidth: 1, borderRadius: 17, padding: 18, flexDirection: 'row', alignItems: 'center', marginBottom: 12},
  name: {color: colors.text, fontSize: 16, fontWeight: '700'}, sub: {color: colors.muted, marginTop: 6},
  note: {color: colors.muted, fontSize: 12, marginTop: 16, lineHeight: 19},
});
