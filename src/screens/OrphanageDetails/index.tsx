import {useEffect,useState} from 'react';
import { Linking} from 'react-native';
import MapView, {Marker} from 'react-native-maps';
import {useRoute} from '@react-navigation/native';

import {Load} from '../../components/Load';

import mapMarker from '../../images/map-marker.png';

import api from '../../services/api';

import { 
  Button, 
  ContainerImages, 
  ContainerMap, 
  ContainerOrphanage, 
  ContainerSchedule, 
  ContainerScheduleItemBlue, 
  ContainerScheduleItemGreen, 
  ContainerScheduleItemRed, 
  ContainerScroll, 
  Description, 
  Icon, 
  Map, 
  Picture, 
  ScrollImages, 
  Separator, 
  TextButton, 
  TextScheduleItemBlue, 
  TextScheduleItemGreen, 
  TextScheduleItemRed, 
  Title 
} 
from './styles';


interface ImageUrl{
  id:number;
  url:string;
}
interface Orphanage {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  about: string;
  instructions: string;
  opening_hours: string;
  open_on_weekends: boolean;
  images:Array<ImageUrl> 
}

interface ParamsId{
  id:number;
}
export function OrphanageDetails(){
 const route = useRoute();
 const {id} = route.params as ParamsId;

 const [orphanage, setOrphanage] = useState<Orphanage>();

 useEffect(()=>{
   api.get(`orphanages/${id}`).then(response=>{
    setOrphanage(response.data);
   })
 },[id]);


 function handleOpenGoogleMapsRoute(){
   Linking.openURL(`https://www.google.com/maps/dir/?api=1&destination=${orphanage?.latitude},${orphanage?.longitude}`);
 }
 
 if(!orphanage){
  return <Load />
}

  return (
    <ContainerScroll>
      <ContainerImages>
        <ScrollImages  horizontal pagingEnabled>
          {orphanage.images.map(image=>{
            return (
              <Picture key={image.id} source={{uri:image.url}}/>
            )
          })}
        </ScrollImages>

      </ContainerImages>

      <ContainerOrphanage>
        <Title>{orphanage.name}</Title>

        <Description>{orphanage.about}</Description>
        
        <ContainerMap>
          <Map 
            initialRegion={{
              latitude:orphanage.latitude,
              longitude:orphanage.longitude,
              latitudeDelta:0.008,
              longitudeDelta:0.008,
            }} 
            zoomEnabled={false}
            pitchEnabled={false}
            scrollEnabled={false}
            rotateEnabled={false}
          >
            <Marker 
              icon={mapMarker}
              coordinate={{ 
                latitude:orphanage.latitude,
                longitude:orphanage.longitude,
              }}
            />
          </Map>
            
          <Button onPress={handleOpenGoogleMapsRoute}>
            <TextButton> ver rotas no google maps</TextButton>
          </Button>
        </ContainerMap> 
      </ContainerOrphanage>

      <Separator/>

      <Title>Instruções para visitar</Title>

      <Description>{orphanage.instructions}</Description>
      
      <ContainerSchedule>
        <ContainerScheduleItemBlue >
          <Icon name="clock" size={40} color="#2ab5d1"/>
          <TextScheduleItemBlue> 
            Segunda à sexta {orphanage.opening_hours}
          </TextScheduleItemBlue>
        </ContainerScheduleItemBlue>
       
       {orphanage.open_on_weekends? (
           <ContainerScheduleItemGreen>
              <Icon name="clock" size={40} color="#2ab5d1"/>
              
              <TextScheduleItemGreen> 
                Atendemos no final de semana
              </TextScheduleItemGreen>
          </ContainerScheduleItemGreen>

       ):(
        <ContainerScheduleItemRed>
            <Icon name="clock" size={40} color="#ff669d"/>
            
            <TextScheduleItemRed> 
              Atendemos no final de semana
            </TextScheduleItemRed>
          </ContainerScheduleItemRed>
       )} 
      </ContainerSchedule>
    </ContainerScroll>
  );
}