import Ionicons from '@expo/vector-icons/Ionicons';
import { View, Text, Button, StyleSheet, TextInput, Pressable, Image, ActivityIndicator  } from 'react-native';
import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Register from '../custom_component/register';
import { userInformation } from '../api/account.api';

const Account = () => {
  const [modalRegister, setModalRegister] = useState(false);
  const {authState, onLogout} = useAuth();
  const {onLogin} = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState<any>();
  const [loading, setLoading] = useState(false);

  const login = async () => {
    setLoading(true);
    const result = await onLogin!(username, password);
    setLoading(false);
    if(result && result.error){
      alert(result.msg);
    }
  }

  useEffect(() => {
    const callUserInformation = async () => {
      if (authState?.authenticated && authState.token && authState.userId) {
        const userInfo = await userInformation(authState.token, authState.userId);
        if (userInfo) {
          setUser(userInfo);
          console.log(user)
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

  return (
  <>
    <View style={styles.mainLayout}>
    {loading && (
          <ActivityIndicator size="large" color="#ffffff" />
    )}
    <View style={styles.container}>
        {authState?.authenticated ? (
          <>
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
            {/* <View style={styles.row}>
              <Text style={styles.label}>Group:</Text>
              <Text style={styles.text}>{authState}</Text>
            </View> */}
            <Button title="Logout" onPress={onLogout} />
            {/* <Button title="Edit Password" onPress={handleEditPassword} /> */}
            {/* <Button title="Edit User Name" onPress={handleEditUserName} /> */}
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
      </View>
    </View>
  </>
  );
};

const styles = StyleSheet.create({
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
    color: 'white',
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
    color: 'white'
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
    justifyContent: 'center',
    textAlign: 'center',
    width: '100%',
    marginBottom: 20
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
    marginRight: 20
  },
  text: {
    fontSize: 16,
    color: 'while'
  },
});

export default Account;