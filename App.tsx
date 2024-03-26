import notifee, {
  TimestampTrigger,
  TriggerType,
  EventType,
} from '@notifee/react-native';
import React, {useEffect, useState} from 'react';
import {SafeAreaView, Button, View, Alert} from 'react-native';

function NotificationScreen() {
  async function createScheduledNotification() {
    const currentDate = new Date();
    const futureDate = new Date(currentDate.getTime() + 10000); // Adding 10 seconds (10,000 milliseconds)
    const trigger: TimestampTrigger = {
      type: TriggerType.TIMESTAMP,
      timestamp: futureDate.getTime(), // fire after 10 seconds
    };

    try {
      await notifee.createTriggerNotification(
        {
          title: 'Meeting with Jane',
          body: 'Today at 11:20am',
          android: {
            channelId: 'your-channel-id',
          },
          ios: {
            sound: 'chime.aiff',
          },
        },
        trigger,
      );
    } catch (error) {
      Alert.alert(`${error}`);
    }
  }

  return (
    <View>
      <Button
        title="Display Notification"
        onPress={() => createScheduledNotification()}
      />
    </View>
  );
}

function App(): React.JSX.Element {
  const [loading, setLoading] = useState(true);

  async function initializeApp() {
    try {
      const initialNotification = await notifee.getInitialNotification();
      if (initialNotification) {
        console.log(
          'Notification caused application to open',
          initialNotification.notification,
        );
        console.log(
          'Press action used to open the app',
          initialNotification.pressAction,
        );
      }
      setLoading(false);
    } catch (error) {
      console.error('Error initializing app:', error);
    }
  }

  useEffect(() => {
    initializeApp();
  }, []);

  useEffect(() => {
    return notifee.onForegroundEvent(({type, detail}) => {
      handleNotificationEvent(type, detail);
    });
  }, []);

  useEffect(() => {
    return notifee.onBackgroundEvent(async ({type, detail}) => {
      handleNotificationEvent(type, detail);
    });
  }, []);

  function handleNotificationEvent(type: EventType, detail: any) {
    switch (type) {
      case EventType.DISMISSED:
        console.log('User dismissed notification', detail.notification);
        Alert.alert(
          'User dismissed notification',
          detail.notification?.body ?? '',
        );
        break;
      case EventType.PRESS:
        console.log('User pressed notification', detail.notification);
        Alert.alert(
          'User pressed notification',
          detail.notification?.body ?? '',
        );
        break;
    }
  }

  return (
    <SafeAreaView>
      {loading ? (
        <View style={{backgroundColor: 'red'}} />
      ) : (
        <NotificationScreen />
      )}
    </SafeAreaView>
  );
}

export default App;
