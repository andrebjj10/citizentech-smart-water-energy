import React from 'react';
import {ScrollView, Text, View, StyleSheet, RefreshControl, ActivityIndicator} from 'react-native';
import {api} from '../services/api';
import useStationResource from '../hooks/useStationResource';
import OfflineBanner from '../components/OfflineBanner';
import {colors} from '../theme/colors';

const labels = {INFO: 'Informação', WARNING: 'Atenção', CRITICAL: 'Crítico'};
export default function FaultsScreen() {
  const {data: items, error, loading, refresh} = useStationResource(api.faults, []);
  return <ScrollView style={s.root} contentContainerStyle={s.content}
    refreshControl={<RefreshControl refreshing={loading} onRefresh={refresh} tintColor={colors.accent}/>}>
    <Text style={s.title}>Alertas</Text>
    <Text style={s.intro}>Últimos 30 eventos da estação. O histórico registra ocorrências; não representa falhas necessariamente ativas.</Text>
    <OfflineBanner error={error} hasData={items.length > 0} onRetry={refresh}/>
    {loading && items.length === 0 && <ActivityIndicator color={colors.accent}/>}
    {!loading && !error && items.length === 0 && <Text style={s.empty}>Nenhum evento registrado.</Text>}
    {items.map(item => <View key={item.id} style={s.card}>
      <View style={s.row}>
        <Text style={[s.tag, {color: item.severity === 'CRITICAL' ? colors.danger : item.severity === 'WARNING' ? colors.warning : colors.accent}]}>{labels[item.severity] || item.severity}</Text>
        <Text style={s.time}>{new Date(item.recordedAt).toLocaleString('pt-BR')}</Text>
      </View><Text style={s.message}>{item.message}</Text>
    </View>)}
  </ScrollView>;
}
const s = StyleSheet.create({
  root: {flex: 1, backgroundColor: colors.bg}, content: {padding: 20, paddingBottom: 40},
  title: {color: colors.text, fontSize: 30, fontWeight: '800', marginTop: 12},
  intro: {color: colors.muted, marginTop: 7, marginBottom: 18, lineHeight: 21},
  card: {backgroundColor: colors.surface, borderColor: colors.border, borderWidth: 1, borderRadius: 15, padding: 17, marginBottom: 12},
  row: {flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', gap: 8},
  tag: {fontWeight: '800', fontSize: 12}, time: {color: colors.muted, fontSize: 11},
  message: {color: colors.text, marginTop: 10, lineHeight: 21}, empty: {color: colors.muted},
});
