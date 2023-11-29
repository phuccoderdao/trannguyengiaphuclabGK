import React,{useState,useEffect} from "react";
import {View, StyleSheet,Text, Image,FlatList,TouchableOpacity,Animated,Alert } from 'react-native'
import {Button} from 'react-native-paper'
import ListComponent from "../components/Listcomponent";
import firestore from '@react-native-firebase/firestore';
import { useNavigation } from '@react-navigation/native';
import { Swipeable } from 'react-native-gesture-handler';


// Component SwipeableItem
const SwipeableItem = ({ item, onDelete, onEdit }) => {
  const navigation = useNavigation();

  const dragX = new Animated.Value(0);

  const renderRightActions = (dragX) => {
    const trans = dragX.interpolate({
      inputRange: [0, 50, 100],
      outputRange: [0, 30, 60],
    });

    return (
      <View style={styles.rightActions}>
        <Animated.View
          style={{
            transform: [{ translateX: trans }],
            flexDirection: 'row',
          }}>
          <TouchableOpacity onPress={() => onDelete(item.id)}>
            <Text style={styles.actionDel}>Xóa</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => onEdit(item.id,item.name,item.price)}>
            <Text style={styles.actionEdit}>Sửa</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    );
  };

  return (
    <Swipeable renderRightActions={(dragX) => renderRightActions(dragX)}>
    <ListComponent
      key={item.id}
      title={item.name}
      name={item.name}
      price={item.price}
      onClick={() => {
        console.log("Item Data:", item);
        navigation.navigate('ServiceDetails', {
          name: item.name,
          price: item.price,
          createdBy: item.createdBy,
          createdAt: item.createdAt,
          updatedAt: item.updatedAt,
        });
      }}
    />
  </Swipeable>
  );
};




function Home() {
  const navigation = useNavigation();
    const [serviceData, setServiceData] = useState([]);
    useEffect(() => {
      let isMounted = true;
    
      const unsubscribe = firestore().collection("SERVICE").onSnapshot(
        (snapshot) => {
          if (isMounted) {
            if (snapshot) {
              const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
              console.log("New data received:", data);
              setServiceData(data);
            } else {
              console.error("Snapshot is null");
            }
          }
        },
        (error) => {
          console.error("Error fetching data from Firestore:", error);
        }
      );
    
      return () => {
        isMounted = false;
        unsubscribe();
      };
    }, []);
    
    // Hàm xử lý khi người dùng xóa
    const handleDelete = async (itemId) => {
      try {
        // Hiển thị cảnh báo xác nhận trước khi xóa
        Alert.alert(
          'Xác nhận',
          'Bạn có chắc chắn muốn xóa dịch vụ này?',
          [
            {
              text: 'Hủy',
              style: 'cancel',
            },
            {
              text: 'Xóa',
              onPress: async () => {
                // Thực hiện logic xóa dịch vụ trên Firestore
                await firestore().collection('SERVICE').doc(itemId).delete();
    
                // Thông báo khi xóa thành công (hoặc có thể thực hiện các hành động khác)
                console.log('Dịch vụ đã được xóa thành công.');
              },
            },
          ],
          { cancelable: false }
        );
      } catch (error) {
        console.error('Lỗi khi xóa dịch vụ:', error);
        // Thông báo lỗi hoặc thực hiện các hành động khác
        alert('Đã xảy ra lỗi khi xóa dịch vụ. Vui lòng thử lại.');
      }
    };
    //chuyển tới trang sửa
    const handleEdit = (itemId, name, price) => {
      console.log("Edit item with ID:", itemId);
      navigation.navigate('AddService', { itemId, name, price });
    };
    
  
    return (
        <View style={styles.container}>
            <Image style={styles.img} source={require('../assets/manhinhchinh.jpg')}/>
            <Text style={styles.txt}>Danh sách dịch vụ</Text>
            {/* thêm mới dịch vụ */}
            <Button mode='contained' icon='plus-circle' style={styles.btn} onPress={()=> {navigation.navigate('AddService'),{}}}> 
                Thêm dịch vụ
            </Button>
            
       
             <FlatList
        data={serviceData}
        renderItem={({ item }) => (
          <SwipeableItem item={item} onDelete={handleDelete} onEdit={handleEdit} />
        )}
        keyExtractor={(item) => item.id.toString()}
      />
        </View>
      );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white', // Change the background color of the container
  },
  txt: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'blue', // Change the text color
    paddingLeft: 10,
  },
  img: {
    width: 200,
    height: 150,
    alignSelf: 'center',
  },
  btn: {
    backgroundColor: '#00bfff', // Change the button background color
    borderRadius: 10,
    marginTop: 10,
    marginRight: 10,
    marginLeft: 10,
  },
  rightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    flex: 1,
  },
  actionDel: {
    marginTop: 15,
    padding: 15,
    backgroundColor: 'red',
    color: 'white',
  },
  actionEdit: {
    marginTop: 15,
    padding: 15,
    backgroundColor: 'green',
    color: 'white',
  },
});

export default Home;