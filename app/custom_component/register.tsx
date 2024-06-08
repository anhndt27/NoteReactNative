import React, {useState} from 'react';
import {Alert, Modal, StyleSheet, Text, Pressable, TextInput, View} from 'react-native';
import { useAuth } from '../context/AuthContext';

interface RegisterProps {
  modalVisible: boolean;
  toggleModal: () => void;
}

const Register = ({ modalVisible , toggleModal} : RegisterProps) => {
    const {onLogin} = useAuth();
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const login = async () => {
      const result = await onLogin!(username, password)

      if(result && result.error){
        alert(result.msg);
      }
    }

    return (
      <View style={styles.centeredView}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={toggleModal}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>Register</Text>
            <TextInput
              style={styles.input}
              placeholder="Username"
              value={username}
              onChangeText={setUsername}
            />
             <TextInput
              style={styles.input}
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
            />
            <TextInput
              style={styles.input}
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
            <View style={styles.buttonRow}>
              <Pressable style={[styles.button, styles.buttonSubmit]} onPress={toggleModal}>
                <Text style={styles.textStyle}>Submit</Text>
              </Pressable>
              <Pressable style={[styles.button, styles.buttonClose]} onPress={toggleModal}>
                <Text style={styles.textStyle}>Cancel</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
    );
  };
  
  const styles = StyleSheet.create({
    input: {
      width: '100%',
      height: 40,
      borderColor: '#ccc',
      borderWidth: 1,
      borderRadius: 5,
      marginBottom: 15,
      paddingLeft: 10,
      color: 'black'
    },
    centeredView: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalView: {
      width: 300,
      backgroundColor: '#808080',
      borderRadius: 20,
      padding: 20,
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5,
    },
    button: {
      borderRadius: 10,
      padding: 10,
      marginVertical: 5,
      elevation: 2,
    },
    buttonOpen: {
      backgroundColor: '#f57c00',
    },
    buttonSubmit: {
      backgroundColor: '#4CAF50',
    },
    buttonClose: {
      backgroundColor: '#f44336',
    },
    textStyle: {
      color: 'white',
      fontWeight: 'bold',
      textAlign: 'center',
    },
    modalText: {
      marginBottom: 15,
      textAlign: 'center',
      fontSize: 20,
      fontWeight: 'bold',
    },
    buttonRow: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      width: '100%',
    },
  });
  
  export default Register;