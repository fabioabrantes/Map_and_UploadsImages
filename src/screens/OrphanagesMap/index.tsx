import {useState} from 'react';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import  MapView, {Marker,Callout, PROVIDER_GOOGLE} from 'react-native-maps';

import {  Platform,  PermissionsAndroid} from 'react-native';

import mapMarker from '../../images/map-marker.png';
/* import * as Location from 'expo-location'; */

import api from '../../services/api';
import { 
  Button, 
  Container,
  ContainerCallout,
  ContainerFooter,
  ContainerMap, 
  Icon, 
  TextCallout, 
  TextFooter 
} from './styles';

interface Orphanage{
  id:number;
  latitude:number;
  longitude:number;
  name:string;
}

export function OrphanagesMap(){

  const [orphanages, setOrphanages] = useState<Orphanage[]>([] as Orphanage[]);
  /* const [location,setLocation] = useState(null); */

  const navigation = useNavigation();
  
  function handlerNavigateToOrphanageDetails(id:number){
    navigation.navigate('OrphanageDetails',{id});
  }
  
  function handleNavigateToCreateOrphanage(){
    navigation.navigate('SelectMapPosition');
  }
  /* async function getMyLocation(){
    
    let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.log('oi')
          return;
      }
      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
 
  } */
  // sempre que o usuário sair e voltar da tela, ela é disparada
  
  useFocusEffect(()=>{
    api.get('orphanages').then(response=>{     
      setOrphanages(response.data);
    }).catch(error=>console.log(error));
    /* getMyLocation(); */
  });
 
  return (
    <Container>
      <ContainerMap
        onMapReady={()=>{
          Platform.OS === 'android' && PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
          ).then(()=>{console.log("usuario aceitou")})
        }}
        mapType="standard"
        provider={PROVIDER_GOOGLE}
        initialRegion={{
          latitude:-6.5195987,
          longitude:-38.4098952,
          latitudeDelta:0.008,
          longitudeDelta:0.008,
        }}
        showsUserLocation
        loadingEnabled
        minZoomLevel={17}
      >
      {orphanages.map(orphanage =>
        <Marker
          key={orphanage.id}
          icon={mapMarker}
          coordinate = {
            {
              latitude:orphanage.latitude,
              longitude:orphanage.longitude,
            }
          }
          calloutAnchor={{x:2.7, y:0.8}}

        >
          <Callout
            tooltip={true}
            onPress={()=>handlerNavigateToOrphanageDetails(orphanage.id)}
          >
            <ContainerCallout>
                <TextCallout>{orphanage.name}</TextCallout>
            </ContainerCallout>
          </Callout>
        </Marker>
      )}
      </ContainerMap>

      <ContainerFooter style={{elevation:3,shadowOffset:{width:0,height:3}}}>
        <TextFooter> {orphanages.length} orfanatos </TextFooter>

        <Button onPress={handleNavigateToCreateOrphanage}> 
          <Icon name="plus" size={20} color="#fff"/>
        </Button>
      </ContainerFooter>
    </Container>
  );
}

