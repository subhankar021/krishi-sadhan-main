import { useState } from 'react';
import { Appbar, Card, Button } from 'react-native-paper';
import { Platform, Text, StyleSheet } from 'react-native';

import { FAB } from 'react-native-paper';
const MORE_ICON = Platform.OS === 'ios' ? 'dots-horizontal' : 'dots-vertical';

function HomePage() {
    const [active, setActive] = useState('first');
    return (
        <>

            <Appbar.Header>
                <Appbar.Content title="Title" subtitle={'Subtitle'} />
                <Appbar.Action icon="magnify" onPress={() => { }} />
                <Appbar.Action icon={MORE_ICON} onPress={() => { }} />
            </Appbar.Header>
            <Card style={{ padding: 10 }}>
                <Card.Title title="Card Title" subtitle="Card Subtitle" />
                <Card.Content>
                    <Text variant="titleLarge">Lorem ipsum dolor sit amet consectetur adipisicing elit.</Text>
                    <Text variant="bodyMedium">Card content</Text>
                </Card.Content>
                <Card.Cover source={{ uri: 'https://picsum.photos/700' }} />
                <Card.Actions>
                    <Button>Cancel</Button>
                    <Button>Ok</Button>
                </Card.Actions>
            </Card>
            <FAB
    icon="plus"
    style={styles.fab}
    onPress={() => console.log('Pressed')}
  />
        </>
    );
};
const styles = StyleSheet.create({
    fab: {
      position: 'absolute',
      margin: 16,
      right: 0,
      bottom: 0,
    },
  })
export default HomePage;