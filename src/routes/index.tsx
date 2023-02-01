import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import {OrphanagesMap} from '../screens/OrphanagesMap';
import {OrphanageDetails} from '../screens/OrphanageDetails';
import {OrphanageData} from '../screens/CreateOrphanage/OrphanageData';
import {SelectMapPosition} from '../screens/CreateOrphanage/SelectMapPosition';
import {Header} from '../components/Header';

const {Navigator, Screen} = createNativeStackNavigator();

export function Routes(){
  return (
    <Navigator 
      screenOptions={{headerShown:false,}}
      initialRouteName='OrphanagesMap'
    >
      <Screen name="OrphanagesMap" component={OrphanagesMap}/>
        
      <Screen  
        name="OrphanageDetails" 
        component={OrphanageDetails}
       
      />

      <Screen  
        name="SelectMapPosition" 
        component={SelectMapPosition}
        
      />

      <Screen  
        name="OrphanageData" 
        component={OrphanageData}
      
      />
    </Navigator>

  );
}
