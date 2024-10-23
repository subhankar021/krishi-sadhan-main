// App.js or CommodityChat.js

import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { View, Text, FlatList, TextInput, Button, StyleSheet, TouchableOpacity } from 'react-native';
import { IconButton, useTheme } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import dayjs from 'dayjs';

export default function CommodityChat() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const searchParams = useLocalSearchParams();
  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState('');

  const scrollRef = useRef(null);

  const handleSend = () => {
    if (messageText.trim().length === 0) return;

    const newMessage = {
      id: (messages.length + 1).toString(),
      user: 'You',
      text: messageText,
      timestamp: dayjs().format('DD-MM-YYYY HH:mm:ss')
    };

    const randomReply = {
      id: (messages.length + 2).toString(),
      user: 'Aggregator',
      text: generateRandomReply(),
      timestamp: dayjs().format('DD-MM-YYYY HH:mm:ss')
    };
    

    setMessages([...messages, newMessage, randomReply ]);
    setMessageText('');
  };

  useEffect(() => {
    setMessages([
      {
        id: '1',
        user: 'Aggregator',
        text: `Hello, I am interested in buying your "${searchParams?.cropId}".`,
        timestamp: dayjs().format('DD-MM-YYYY HH:mm:ss')
      },
      { id: '2', user: 'You', text: 'Sure, what information do you need?', timestamp: dayjs().format('DD-MM-YYYY HH:mm:ss') },
      { id: '3', user: 'Aggregator', text: 'I need information about price and availability of your crop.', timestamp: dayjs().format('DD-MM-YYYY HH:mm:ss') },
      { id: '4', user: 'You', text: 'I am expecting ₹2000 /kg.', timestamp: dayjs().format('DD-MM-YYYY HH:mm:ss') },
      {
        id: '5',
        user: 'Aggregator',
        text: 'That\'s a competitive price. How many kilograms do you have available?',
        timestamp: dayjs().format('DD-MM-YYYY HH:mm:ss')
      },
      {
        id: '6',
        user: 'You',
        text: 'I have 200 kilograms available.',
        timestamp: dayjs().format('DD-MM-YYYY HH:mm:ss')
      },
      {
        id: '7',
        user: 'Aggregator',
        text: 'Great! I\'d like to buy all 200 kilograms. Can you provide me with your contact details so we can finalize the deal?',
        timestamp: dayjs().format('DD-MM-YYYY HH:mm:ss')
      },
      {
        id: '8',
        user: 'You',
        text: 'Sure, my phone number is 9876543210. Please let me know if you need any further information.',
        timestamp: dayjs().format('DD-MM-YYYY HH:mm:ss')
      },
      {
        id: '9',
        user: 'Aggregator',
        text: 'Thank you. I will contact you shortly to arrange the pickup and payment details.',
        timestamp: dayjs().format('DD-MM-YYYY HH:mm:ss')
      },
      {
        id: '10',
        user: 'You',
        text: 'Looking forward to it. Please let me know if you need any further information.',
        timestamp: dayjs().format('DD-MM-YYYY HH:mm:ss')
      },
      {
        id: '11',
        user: 'Aggregator',
        text: 'I\'ll confirm the logistics by the end of the day. Is there a preferred time for you?',
        timestamp: dayjs().format('DD-MM-YYYY HH:mm:ss')
      },
      {
        id: '12',
        user: 'You',
        text: 'I\'m available any time after 10 AM. Let me know what works best for you.',
        timestamp: dayjs().format('DD-MM-YYYY HH:mm:ss')
      },
      {
        id: '13',
        user: 'Aggregator',
        text: 'Perfect. I\'ll aim to be in touch around noon. Thanks for your flexibility!',
        timestamp: dayjs().format('DD-MM-YYYY HH:mm:ss')
      },
      {
        id: '14',
        user: 'You',
        text: 'You\'re welcome! I\'ll be waiting for your call.',
        timestamp: dayjs().format('DD-MM-YYYY HH:mm:ss')
      },
      {
        id: '15',
        user: 'Aggregator',
        text: 'Just to confirm, can you please provide your full address for the pickup?',
        timestamp: dayjs().format('DD-MM-YYYY HH:mm:ss')
      },
      {
        id: '16',
        user: 'You',
        text: 'Certainly. My address is 123 Green Farm, Village Road, Farmington, ZIP 456789.',
        timestamp: dayjs().format('DD-MM-YYYY HH:mm:ss')
      },
      {
        id: '17',
        user: 'Aggregator',
        text: 'Got it. I\'ll make a note of that. Do you have any specific instructions for the pickup?',
        timestamp: dayjs().format('DD-MM-YYYY HH:mm:ss')
      },
      {
        id: '18',
        user: 'You',
        text: 'No special instructions. Just ensure the driver knows to contact me before arriving.',
        timestamp: dayjs().format('DD-MM-YYYY HH:mm:ss')
      },
      {
        id: '19',
        user: 'Aggregator',
        text: 'Will do. I\'ll keep you updated with the schedule. Thanks for your cooperation.',
        timestamp: dayjs().format('DD-MM-YYYY HH:mm:ss')
      },
      {
        id: '20',
        user: 'You',
        text: 'Thank you! Looking forward to completing this transaction. Have a great day!',
        timestamp: dayjs().format('DD-MM-YYYY HH:mm:ss')
      }
    ]);
  }, [searchParams?.cropId]);

  return (
    <View style={styles.container}>
      <View style={{ marginTop: insets.top, display: 'flex', gap: 10, backgroundColor: theme.colors.primary, color: theme.colors.onPrimary, justifyContent: 'flex-start', alignItems: 'center', borderBottomWidth: 1, borderColor: '#fff', flexDirection: 'row' }}>
        <IconButton icon="arrow-left" iconColor={theme.colors.onPrimary} onPress={() => router.back()} />
        <Text style={{ overflow: 'hidden', display: 'flex', textOverflow: 'ellipsis', fontWeight: 'bold', color: theme.colors.onPrimary, fontSize: 18 }}>
          {("Sakshi Kurel - " + searchParams?.cropId || 'Commodity Chat').substring(0, 34) + '...'}
        </Text>
      </View>
      <FlatList
        ref={scrollRef}
        onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: false })}
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          const youCondition = searchParams?.pageFor === 'AGGREGATOR' ? item.user === 'Aggregator' : item.user === 'You';
          return (
          <View style={{ display: 'flex', width: '100%', flexDirection: youCondition ? 'row-reverse' : 'row', alignItems: youCondition ? 'flex-end' : 'flex-start' }}>
            <View style={[styles.messageContainer, {
              marginRight: youCondition ? 0 : 10,
              marginLeft: youCondition ? 10 : 0
            }]}>
              <View style={{
                flex: 1,
                backgroundColor: youCondition ? theme.colors.primary : theme.colors.secondary,
                paddingHorizontal: 10,
                paddingVertical: 5,
                borderRadius: 8,
                borderBottomRightRadius: youCondition ? 0 : 8,
                borderBottomLeftRadius: youCondition ? 8 : 0
              }}>
                <Text style={{ color: '#fff' }}>
                  {item.text}
                </Text>
              </View>
              <Text style={{ color: '#222', padding: 3, fontSize: 8, textAlign: youCondition ? 'right' : 'left' }}>
                {dayjs(item.timestamp).format('hh:mm A')}
              </Text>
            </View>
          </View>
        )}}
        style={styles.messageList}
      />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={messageText}
          onChangeText={setMessageText}
          placeholder="Type a message"
        />
        <IconButton icon="send" style={{ backgroundColor: theme.colors.primary }} iconColor={theme.colors.onPrimary} onPress={handleSend} />
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  messageList: {
    flex: 1,
  },
  messageContainer: {
    flexDirection: 'column',
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  messageUser: {
    fontSize: 12,
    marginRight: 5,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 10,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#efefef',
    borderRadius: 50,
    paddingHorizontal: 20,
    paddingVertical: 8,
    marginRight: 8,
  },
  sendButton: {
    backgroundColor: '#007bff',
    borderRadius: 5,
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

function generateRandomReply() {
  const replies = [
      "Interesting point!",
      "I'll have to think about that.",
      "Can you tell me more?",
      "That's a good question!",
      "I see where you're coming from.",
      "Hmm, not sure about that.",
      "Really? Tell me more!",
      "That's one way to look at it.",
      "I hadn't considered that.",
      "Let's explore that idea further.",
      "Good observation.",
      "Noted. What else?",
      "That's an intriguing perspective.",
      "I appreciate your input.",
      "Could you elaborate?",
      "That's a valid point.",
      "Thanks for sharing.",
      "I need to ponder that.",
      "Interesting take!",
      "I'll give that some thought.",
      "That's a unique viewpoint.",
      "Let's delve into that.",
      "I hadn't thought of it that way.",
      "Tell me more about that.",
      "I'm intrigued by your idea.",
      "That's a thought-provoking comment."
  ];

  // Generate a random index based on the length of the replies array
  const randomIndex = Math.floor(Math.random() * replies.length);
  
  // Return the reply at the randomly chosen index
  return replies[randomIndex];
}
