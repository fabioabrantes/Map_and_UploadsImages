import { useState } from 'react';
import {MapPressEvent, Marker} from 'react-native-maps';
import {useNavigation} from '@react-navigation/native';

import mapMarker from '../../../images/map-marker.png';

import { 
  Container, 
  MapContainer, 
  NextButton, 
  TextNextButton 
} from './styles';


export function SelectMapPosition(){
  const navigation = useNavigation();

  const [position,setPosition] = useState({latitude:0,longitude:0});

  function handleSelectMapPosition(event:MapPressEvent){
    setPosition(event.nativeEvent.coordinate);
  }
  
  function handleNextStep(){
    navigation.navigate('OrphanageData',{position});
  }
  return (
    <Container>
      <MapContainer
        initialRegion={{
          latitude:-6.5205485,
          longitude:-38.4155765,
          latitudeDelta:0.008,
          longitudeDelta:0.008,
        }}
        onPress={handleSelectMapPosition}
      >

        {position.latitude !== 0 && (
          <Marker 
          icon={mapMarker}
          coordinate ={{
            latitude:position.latitude,
            longitude: position.longitude,
          }}
        />
      )}
        
      </MapContainer>

      {position.latitude !== 0 && (
      <NextButton onPress={handleNextStep}>
        <TextNextButton >Próximo</TextNextButton>
      </NextButton>
      )}
    </Container>
  );
}
