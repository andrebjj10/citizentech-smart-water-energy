import React,{useEffect,useState,useCallback} from 'react';
import {View,Text,ScrollView,RefreshControl,StyleSheet,TouchableOpacity} from 'react-native';
import {api} from '../services/api';
import MetricCard from '../components/MetricCard';
import OfflineBanner from '../components/OfflineBanner';
import {colors} from '../theme/colors';
export default function DashboardScreen(){
 const [reading,setReading]=useState(null); const [offline,setOffline]=useState(''); const [loading,setLoading]=useState(false);
 const refresh=useCallback(async()=>{setLoading(true);try{const data=await api.latest();setReading(data);setOffline('');}catch(e){setOffline(e.message||'Não foi possível acessar a estação.');}finally{setLoading(false)}},[]);
 useEffect(()=>{refresh();const id=setInterval(refresh,10000);return()=>clearInterval(id)},[refresh]);
 const simulate=async()=>{try{setLoading(true);await api.saveReading({waterLevel:+(45+Math.random()*50).toFixed(1),flowRate:+(8+Math.random()*25).toFixed(1),powerWatts:Math.round(500+Math.random()*900),energyKwh:+(10+Math.random()*10).toFixed(2)});await refresh();}catch(e){setOffline(e.message||'Falha na simulação');}finally{setLoading(false)}};
 return <ScrollView style={s.root} contentContainerStyle={s.content} refreshControl={<RefreshControl refreshing={loading} onRefresh={refresh} tintColor={colors.accent}/> }>
  <Text style={s.eyebrow}>CITIZENTECH · ESTAÇÃO 01</Text><Text style={s.title}>Visão geral</Text><Text style={s.intro}>Monitoramento em tempo real da estação de água e energia.</Text>
  <OfflineBanner message={offline}/><View style={s.status}><View style={[s.dot,{backgroundColor:offline?colors.danger:colors.accent}]}/><Text style={s.statusText}>{offline?'Desconectado':'API conectada'} · {reading?.recordedAt?new Date(reading.recordedAt).toLocaleString('pt-BR'):'Aguardando leitura'}</Text></View>
  <MetricCard label="NÍVEL DO RESERVATÓRIO" value={reading?reading.waterLevel.toFixed(1):'--'} unit="%" subtitle="Capacidade total de 50 litros" accent={colors.blue}/>
  <MetricCard label="VAZÃO HIDRÁULICA" value={reading?reading.flowRate.toFixed(1):'--'} unit="L/min" subtitle="Fluxo instantâneo medido"/>
  <MetricCard label="POTÊNCIA ELÉTRICA" value={reading?reading.powerWatts.toFixed(0):'--'} unit="W" subtitle="Consumo elétrico simulado" accent={colors.warning}/>
  <MetricCard label="ENERGIA ACUMULADA" value={reading?reading.energyKwh.toFixed(2):'--'} unit="kWh" subtitle="Indicador de energia acumulada"/>
  <TouchableOpacity disabled={!!offline||loading} style={[s.btn,(offline||loading)&&s.disabled]} onPress={simulate}><Text style={s.btnText}>Gerar nova leitura simulada</Text></TouchableOpacity>
  <Text style={s.note}>Simulação acadêmica: não há sensores físicos conectados.</Text>
 </ScrollView>
}
const s=StyleSheet.create({root:{flex:1,backgroundColor:colors.bg},content:{padding:20,paddingBottom:45},eyebrow:{color:colors.accent,fontWeight:'700',fontSize:11,letterSpacing:2,marginTop:12},title:{color:colors.text,fontSize:32,fontWeight:'800',marginTop:7},intro:{color:colors.muted,marginTop:7,marginBottom:18,lineHeight:21},status:{flexDirection:'row',alignItems:'center',marginBottom:14},dot:{width:8,height:8,borderRadius:10,marginRight:8},statusText:{color:colors.muted,fontSize:12,flex:1},btn:{backgroundColor:colors.accent,borderRadius:14,padding:16,alignItems:'center',marginTop:5},btnText:{color:'#082129',fontWeight:'800'},disabled:{opacity:.4},note:{color:colors.muted,fontSize:11,textAlign:'center',marginTop:12}});
