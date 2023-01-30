import {useState} from 'react';
import {useRoute, useNavigation} from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';

import api from '../../../services/api';

import { 
  ButtonUploadImages, 
  ContainerScroll, 
  ContainerSwitch, 
  ContainerUploadImage, 
  Icon, 
  Input, 
  InputArea, 
  Label, 
  NextButton, 
  Picture, 
  Switch, 
  TextNextButton, 
  Title 
} from './styles';


interface ParamsPositions {
  position: {
    latitude:number; 
    longitude: number;
  };
}
type IResult = {
  uri:string;
}

export function OrphanageData(){
  const navigation =useNavigation();

  const route = useRoute();
  const {position} = route.params as ParamsPositions;

  const [name, setName] = useState('');
  const [about, setAbout] = useState('');
  const [instructions, setInstructions] = useState('');
  const [opening_hours, setOpeningHours] = useState('');
  const [open_on_weekends, setOpenOnWeekends] = useState(true);
  const [imagesURI, setImagesURI] = useState<string[]>([]);


  async function handleCreateOrphanage(){
    const {latitude,longitude} = position;

    // estamos usando o formdata em vez no formato json. pois temos arquivos de imagens
    const data = new FormData();

    data.append('name', name);
    data.append('about', about);
    data.append('latitude', String(latitude));
    data.append('longitude', String(longitude));
    data.append('instructions', instructions);
    data.append('opening_hours', opening_hours);
    data.append('open_on_weekends', String(open_on_weekends));
    
    imagesURI.forEach((imageURI, index) => {
      data.append('images', {
        name: `image_${index}.jpg`,
        type: 'image/jpg',
        uri: imageURI,
      } as any); // por que não tem formato definido. problema do react native que não tem o name da imagem
    });

    await api.post('orphanages',data);
    navigation.navigate('OrphanagesMap');

  }

  //https://www.npmjs.com/package/expo-image-picker
  async function handleSelectImages() {
    // tenho acesso a galeria de fotos e não a câmera
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    /* console.log(status); */
    if(status !== 'granted'){// granted é quando o usuário deu permissão
      alert('Eita, precisamos de acesso às suas fotos...');
      return;
    }
    let result = await ImagePicker.launchImageLibraryAsync({
      // permite ao usuario editar a imagem (crop), antes de subir o app
      allowsEditing: true,
      quality: 1,
      //quero apensas imagems e não vídeo tb
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
    });
    /* console.log(result); */
    if(!result.canceled) { // se cancelou o upload da imagem
      const { uri } = result as IResult;
      // questão do conceito de imutabilidade. sempre que uma imagem for adicionado, 
      //temos que copiar as imagens que tinha antes no array. 
      //se não vai apagar na próxima renderização. pois começa sempre do zero
      setImagesURI([...imagesURI, uri]);
    }
  }

  return (
    <ContainerScroll>
      <Title>Dados</Title>
      
      <Label>Nome</Label>
      <Input value={name} onChangeText={text => setName(text)} />

      <Label>Sobre</Label>
      <InputArea multiline value={about} onChangeText={setAbout}/>

      <Label>Whatsapp</Label>
      <Input />

      <Label>Fotos</Label>
      <ContainerUploadImage>
        {imagesURI.map(imgUri =><Picture key={imgUri} source={{uri:imgUri}}/>)}
      </ContainerUploadImage>

      <ButtonUploadImages onPress={handleSelectImages}>
        <Icon name="plus" size={24} color="#15B6D6"/>
      </ButtonUploadImages>


      <Title>Visitação</Title>

      <Label>Instruções</Label>
      <InputArea multiline value={instructions} onChangeText={setInstructions}/>

      <Label>Horário de visitas</Label>
      <Input value={opening_hours} onChangeText={setOpeningHours}/>

      <ContainerSwitch>
        <Label>Atende no final de semana?</Label>
        <Switch 
          thumbColor="#fff"
          trackColor={{false:'#ccc', true:'#39cc83'}}
          value={open_on_weekends}
          onValueChange={setOpenOnWeekends}
        />
      </ContainerSwitch>

      <NextButton onPress={handleCreateOrphanage}>
        <TextNextButton>Cadastrar</TextNextButton>
      </NextButton>
    </ContainerScroll>
  );
}