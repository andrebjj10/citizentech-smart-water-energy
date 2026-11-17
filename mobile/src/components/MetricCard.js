import React from 'react';
import {View,Text,StyleSheet} from 'react-native';
import {colors} from '../theme/colors';
export default function MetricCard({label,value,unit,subtitle,accent=colors.accent}){
 return <View style={s.card}><Text style={s.label}>{label}</Text><View style={s.inline}><Text style={[s.value,{color:accent}]}>{value}</Text><Text style={s.unit}> {unit}</Text></View><Text style={s.sub}>{subtitle}</Text></View>;
}
const s=StyleSheet.create({card:{backgroundColor:colors.surface,borderRadius:18,padding:18,marginBottom:12,borderWidth:1,borderColor:colors.border},label:{color:colors.muted,fontSize:13,fontWeight:'600'},inline:{flexDirection:'row',alignItems:'baseline',marginTop:6},value:{fontSize:30,fontWeight:'800'},unit:{fontSize:14,color:colors.muted},sub:{color:colors.muted,fontSize:12,marginTop:4}});
