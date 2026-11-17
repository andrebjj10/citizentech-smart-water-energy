import React from 'react';
import {View,Text,StyleSheet} from 'react-native';
import {colors} from '../theme/colors';
export default function OfflineBanner({message}) {if(!message)return null;return <View style={s.box}><Text style={s.text}>⚠ API fora do ar — {message}</Text><Text style={s.sub}>Dados anteriores continuam na tela, mas os comandos estão desabilitados.</Text></View>}
const s=StyleSheet.create({box:{backgroundColor:'#48252D',padding:13,borderRadius:13,marginBottom:14},text:{color:'#FFD4D7',fontWeight:'700'},sub:{color:'#FFD4D7',fontSize:12,marginTop:5}});
