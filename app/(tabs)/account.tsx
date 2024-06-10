import Ionicons from '@expo/vector-icons/Ionicons';
import { View, Text, Button, StyleSheet, TextInput, Pressable, Image, ActivityIndicator, Modal,  } from 'react-native';
import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Register from '../custom_component/register';
import { userInformation } from '../api/account.api';
import * as Clipboard from 'expo-clipboard';

const Account = () => {
  const [modalRegister, setModalRegister] = useState(false);
  const {authState, onLogout} = useAuth();
  const {onLogin} = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState<any>();
  const [loading, setLoading] = useState(false);
  const [shareGroup, setShareGroup] = useState(false);
  const [joinGroupModal, setJoinGroupModal] = useState(false);
  const [inputGroupCode, setInputGroupCode] = useState('');
  
  const login = async () => {
    setLoading(true);
    const result = await onLogin!(username, password);
    setLoading(false);
    if(result && result.error){
      alert(result.msg);
    }
  }

  const handleGetGroupCode = async () => {
    setLoading(true);
    const result = '';
    setLoading(false)
    setShareGroup(!shareGroup);
    if(result) {
    }
  }

  useEffect(() => {
    const callUserInformation = async () => {
      if (authState?.authenticated && authState.token && authState.userId) {
        const userInfo = await userInformation(authState.token, authState.userId);
        if (userInfo) {
          setUser(userInfo);
          console.log(999, user)
        }
      }
    };

    callUserInformation();
  }, [authState]);

  // const handleEditPassword = () => {
  //   alert('Chỉnh sửa mật khẩu');
  // };

  // const handleEditUserName = () => {
   
  //   alert('Chỉnh sửa tên người dùng');
  // };


  const toggleModal = () => {
    setModalRegister(!modalRegister);
  };


  const [copiedText, setCopiedText] = useState('');

  const copyToClipboard = async () => {
    await Clipboard.setStringAsync('hello world');
    setShareGroup(!shareGroup);
    alert('Copy code!');
  };

  const fetchCopiedText = async () => {
    const text = await Clipboard.getStringAsync();
    setCopiedText(text);
  };

  const handleSubmitGroupCode = async () => {
    setJoinGroupModal(!joinGroupModal);
  }

  return (
  <>
    <View style={styles.mainLayout}>
    {loading && (
          <ActivityIndicator size="large" color="#000000" />
    )}
    <View style={styles.container}>
        {authState?.authenticated ? (
          <>
            <View style={styles.accountContainer}>
              <Text style={styles.titleMain}>Account Information</Text>
              <Image
                style={styles.avatar}
                source={{
                  uri: "https://img.freepik.com/free-vector/illustration-businessman_53876-5856.jpg",
                }}
              />
              <View style={styles.row}>
                <Text style={styles.label}>User Name:</Text>
                <Text style={styles.text}>{user?.userName}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Email:</Text>
                <Text style={styles.text}>{user?.email}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Group:</Text>
                {user?.groupName ? (
                  <>
                    <Text style={styles.text}>{user?.groupName}</Text>
                    <Pressable onPress={handleGetGroupCode}>
                      <Text style={[styles.text, styles.underLineText ]}>Share group</Text>
                    </Pressable>
                  </>
                  ) : (
                  <>
                    <Pressable onPress={() => setJoinGroupModal(!joinGroupModal)}>
                      <Text style={[styles.text, styles.underLineText]}>Join group</Text>
                    </Pressable>
                  </>
                  )}
              </View>
              <Button title="Logout" onPress={onLogout} />
              {/* <Button title="Edit Password" onPress={handleEditPassword} /> */}
              {/* <Button title="Edit User Name" onPress={handleEditUserName} /> */}
            </View>
          </>
        ) : (
          <>
            <View style={styles.loginComponent}>
              <Text style={styles.tilte}>Login</Text>
              <View>
                <TextInput
                  style={styles.input}
                  placeholder="Username"
                  value={username}
                  onChangeText={setUsername}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Password"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                />
                <Pressable
                  style={[styles.button, styles.buttonSubmit]}
                  onPress={login}
                >
                  <Text style={styles.textStyle}>Submit</Text>
                </Pressable>
                <Pressable
                onPress={toggleModal}
                style={[styles.button, styles.buttonRegister]}
                >
                  <Text style={styles.textStyle}>or Register</Text>
                </Pressable>
              </View>
            </View>
            <View style={styles.buttonRow}>
             
            </View>
          </>
        )}
        <Register modalVisible={modalRegister} toggleModal={toggleModal} />
        <Modal
          animationType="fade"
          transparent={true}
          visible={shareGroup}
          onRequestClose={toggleModal}>
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                <Text>Group Code:</Text>
                <Text>{}</Text>
                <Pressable style={[styles.button, styles.buttonSubmit]} onPress={copyToClipboard}>
                  <Text>Copy</Text>
                </Pressable>
              </View>
            </View>
        </Modal>
        <Modal
          animationType="fade"
          transparent={true}
          visible={joinGroupModal}
          onRequestClose={toggleModal}>
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                <TextInput
                  style={styles.input}
                  placeholder="Enter Group Code"
                  value={inputGroupCode}
                  onChangeText={setInputGroupCode}
                />
                <View style={[styles.row, styles.center]}>
                  <Pressable style={[styles.button, styles.buttonSubmit]} onPress={handleSubmitGroupCode}>
                    <Text>Submit</Text>
                  </Pressable >
                  <Pressable style={[styles.button, styles.buttonClose]} onPress={() => setJoinGroupModal(!joinGroupModal)}>
                    <Text>Cancel</Text>
                  </Pressable>
                </View>
              </View> 
            </View>
        </Modal>
      </View>
    </View>
  </>
  );
};

const styles = StyleSheet.create({
  buttonClose: {
    backgroundColor: '#f44336',
  },
  modalView: {
    width: 300,
    backgroundColor: '#E8E8E8',
    borderRadius: 20,
    paddingTop: 20,
    paddingHorizontal: 20,
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
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  underLineText: {
     textDecorationLine: 'underline',
     color: 'blue'
  },
  accountContainer: {
    borderWidth: 1,
    borderColor: '#000',
    borderStyle: 'solid',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    height: 700,
    width: 350
  },
  mainLayout: {
    height: '100%',
    marginTop: 50,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 20,
  },
  titleMain: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  loginComponent: {
    width: '100%',
    paddingTop: 100,
    paddingHorizontal: 20
  },
  textStyle: {
    fontWeight: 'bold',
    textAlign: 'center',
  },
  buttonSubmit: {
    backgroundColor: '#4CAF50',
  },
  button: {
    borderRadius: 10,
    padding: 10,
    marginVertical: 5,
    elevation: 2,
    margin: 5
  },
  tilte: {
    marginBottom: 15,
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',
    color: 'black'
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 15,
    paddingLeft: 10,
  },
  buttonRegister: {
    backgroundColor: '#f57c00',
  },
  buttonLogin: {
    backgroundColor: '#4CAF50',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  row: {
    flexDirection: 'row',
    textAlign: 'center',
    width: '100%',
    marginBottom: 20,
  },
  center: {
    justifyContent: 'center'
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 30,
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
    marginRight: 20,
    marginLeft: 50
  },
  text: {
    fontSize: 16,
    color: 'while'
  },
});

export default Account;