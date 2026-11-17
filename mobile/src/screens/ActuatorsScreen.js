import React,{useState,useCallback,useEffect} from 'react';
import {View,Text,ScrollView,Switch,StyleSheet,RefreshControl} from 'react-native';
import {api} from '../services/api';import OfflineBanner from '../components/OfflineBanner';import {colors} from '../theme/colors';
export default function ActuatorsScreen(){
 const [items,setItems]=useState([]),[error,setError]=useState(''),[loading,setLoading]=useState(false),[saving,setSaving]=useState(null);
 const refresh=useCallback(async()=>{setLoading(true);try{setItems(await api.actuators());setError('')}catch(e){setError(e.message||'Sem conexão')}finally{setLoading(false)}},[]);
 useEffect(()=>{refresh()},[refresh]);
 const toggle=async (a)=>{setSaving(a.id);try{await api.toggleActuator(a.id,!a.enabled);await refresh()}catch(e){setError(e.message||'Falha ao alterar atuador')}finally{setSaving(null)}};
 return <ScrollView style={s.root} contentContainerStyle={s.content} refreshControl={<RefreshControl refreshing={loading} onRefresh={refresh} tintColor={colors.accent}/> }><Text style={s.title}>Atuadores</Text><Text style={s.intro}>Controle remoto simulado dos equipamentos da estação.</Text><OfflineBanner message={error}/>{items.map(a=><View key={a.id} style={s.card}><View style={{flex:1}}><Text style={s.name}>{a.name}</Text><Text style={s.sub}>{a.enabled?'Ligado':'Desligado'}</Text></View><Switch value={a.enabled} onValueChange={()=>toggle(a)} disabled={!!error||saving!==null} trackColor={{true:colors.accent,false:colors.border}} thumbColor={colors.text}/></View>)}<Text style={s.note}>Os comandos ficam gravados no banco H2. Nenhum dispositivo físico é acionado.</Text></ScrollView>;
}
const s=StyleSheet.create({root:{flex:1,backgroundColor:colors.bg},content:{padding:20},title:{color:colors.text,fontSize:30,fontWeight:'800',marginTop:12},intro:{color:colors.muted,marginTop:7,marginBottom:18},card:{backgroundColor:colors.surface,borderColor:colors.border,borderWidth:1,borderRadius:17,padding:18,flexDirection:'row',alignItems:'center',marginBottom:12},name:{color:colors.text,fontSize:16,fontWeight:'700'},sub:{color:colors.muted,marginTop:6},note:{color:colors.muted,fontSize:12,marginTop:16}});
