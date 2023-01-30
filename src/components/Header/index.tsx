import {useNavigation} from '@react-navigation/native';

import { Button, Container, Content, Icon, Title } from './styles';

interface HeaderProps{
  title:string;
  showX?:boolean;
}

export function Header({title, showX=false}:HeaderProps){
  const navigation = useNavigation();
  
  function handlerGoToAppHomepage(){
    navigation.navigate('OrphanagesMap');// vai para rota do mapa
  }

  return (
    <Container>
      <Button onPress={navigation.goBack}>
        <Icon name="arrow-left" size={24} color="#15b6d6"/>
      </Button>
     
      <Title> {title} </Title>
      

      {
        showX ? (
          <Button onPress={handlerGoToAppHomepage}>
            <Icon name="x" size={24} color="##ff669d"/>
          </Button>
        ):(
          <Content />
        )
      }
    </Container>

  );
}
