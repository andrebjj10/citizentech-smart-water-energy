import React, {useState} from 'react';
import {View, Text, ScrollView, RefreshControl, StyleSheet, Pressable, ActivityIndicator} from 'react-native';
import {api} from '../services/api';
import {scenarios, simulateReading} from '../services/simulation';
import useStationResource from '../hooks/useStationResource';
import MetricCard from '../components/MetricCard';
import OfflineBanner from '../components/OfflineBanner';
import {colors} from '../theme/colors';

export default function DashboardScreen() {
  const {data: reading, error, loading, saving, refresh, mutate} = useStationResource(api.latest, null);
  const [scenario, setScenario] = useState('normal');
  const disabled = !!error || !reading || loading || saving;
  const status = error ? 'Atualização indisponível' : reading ? 'API conectada' : 'Conectando à estação';

  return <ScrollView style={s.root} contentContainerStyle={s.content}
    refreshControl={<RefreshControl refreshing={loading} onRefresh={refresh} tintColor={colors.accent}/>}>
    <Text style={s.eyebrow}>CITIZENTECH · ESTAÇÃO 01</Text>
    <Text style={s.title}>Visão geral</Text>
    <Text style={s.intro}>Água e energia sob controle. Dados simulados da estação, atualizados a cada 10 segundos.</Text>
    <OfflineBanner error={error} hasData={!!reading} onRetry={refresh}/>
    <View style={s.status}>
      <View style={[s.dot, {backgroundColor: error ? colors.danger : reading ? colors.accent : colors.warning}]}/>
      <Text style={s.statusText}>{status}{reading ? ' · ' + new Date(reading.recordedAt).toLocaleString('pt-BR') : ''}</Text>
    </View>
    {!reading && loading && <ActivityIndicator color={colors.accent} style={{marginBottom: 16}}/>}
    <MetricCard label="NÍVEL DO RESERVATÓRIO" value={reading ? reading.waterLevel.toFixed(1) : '--'} unit="%" subtitle="Capacidade simulada de 50 litros" accent={colors.blue}/>
    <MetricCard label="VAZÃO HIDRÁULICA" value={reading ? reading.flowRate.toFixed(1) : '--'} unit="L/min" subtitle="Alerta acima de 35 L/min"/>
    <MetricCard label="POTÊNCIA ELÉTRICA" value={reading ? reading.powerWatts.toFixed(0) : '--'} unit="W" subtitle="Alerta acima de 1800 W" accent={colors.warning}/>
    <MetricCard label="ENERGIA ACUMULADA" value={reading ? reading.energyKwh.toFixed(4) : '--'} unit="kWh" subtitle="Total acumulado na simulação"/>
    <Text style={s.section}>Simular um cenário</Text>
    <View style={s.scenarios}>{scenarios.map(item => <Pressable key={item.id} onPress={() => setScenario(item.id)}
      accessibilityRole="button" accessibilityState={{selected: scenario === item.id}}
      style={[s.chip, scenario === item.id && s.selected]}>
      <Text style={{color: scenario === item.id ? colors.accent : colors.muted}}>{item.label}</Text>
    </Pressable>)}</View>
    <Pressable disabled={disabled} accessibilityRole="button" accessibilityState={{disabled}}
      style={[s.btn, disabled && s.disabled]} onPress={() => mutate(previous => api.saveReading(simulateReading(previous, scenario)))}>
      <Text style={s.btnText}>{saving ? 'Registrando leitura...' : 'Gerar nova leitura simulada'}</Text>
    </Pressable>
    <Text style={s.note}>Cada leitura acrescenta 10 segundos simulados de consumo. Consulte os eventos gerados na aba Alertas.</Text>
  </ScrollView>;
}
const s = StyleSheet.create({
  root: {flex: 1, backgroundColor: colors.bg}, content: {padding: 20, paddingBottom: 40},
  eyebrow: {color: colors.accent, fontWeight: '700', fontSize: 11, letterSpacing: 2, marginTop: 12},
  title: {color: colors.text, fontSize: 32, fontWeight: '800', marginTop: 7},
  intro: {color: colors.muted, marginTop: 7, marginBottom: 18, lineHeight: 21},
  status: {flexDirection: 'row', alignItems: 'center', marginBottom: 14},
  dot: {width: 8, height: 8, borderRadius: 10, marginRight: 8}, statusText: {color: colors.muted, fontSize: 12, flex: 1},
  section: {color: colors.text, fontWeight: '700', marginVertical: 12},
  scenarios: {flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 12},
  chip: {padding: 12, borderWidth: 1, borderColor: colors.border, borderRadius: 12},
  selected: {borderColor: colors.accent, backgroundColor: colors.surface},
  btn: {backgroundColor: colors.accent, borderRadius: 14, padding: 16, alignItems: 'center', marginTop: 5},
  btnText: {color: '#082129', fontWeight: '800'}, disabled: {opacity: 0.4},
  note: {color: colors.muted, fontSize: 11, textAlign: 'center', marginTop: 12, lineHeight: 18},
});
