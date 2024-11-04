
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createDrawerNavigator } from '@react-navigation/drawer';
import Home from './pages/Home';
import Login from './pages/Login';
import Layout from './pages/Layout';
import HonoTool from './pages/HonoTool';
import Growth from './pages/Growth';
import Performances from './pages/Performances'
import CustomTabBar from './Components/CustomTabBar';
import ToolPicto from './assets/tool.png'
import ToolPictoG from './assets/tool-g.png'
import HomePicto from './assets/home.png'
import HomePictoG from './assets/home-g.png'
import LeadsPicto from './assets/leads.png'
import LeadsPictoG from './assets/leads-g.png'
import PerformPicto from './assets/perform.png'
import PerformPictoG from './assets/perform-g.png'
import CustomHeader from './Components/CustomHeader';
import GrowthPicto from './assets/growth.png';
import GrowthPictoG from './assets/growth-g.png';
import { LogProvider } from './Context/AuthContext';
import { DataProvider } from './Context/StorageContext';
import CustomDrawerContent from './Components/CustomDrawerContent';
import Recommandation from './pages/Recommandation';
import Chat from './pages/Chat';
import Conversation from './pages/Conversation';
import PostPage from './Components/Post/PostPage';
import { useEffect, useState } from 'react';
import { getAppInfos } from './services/AppInfosService';
import { Alert } from 'react-native';
import Leads from './pages/Leads';
import Lead from './Components/Lead/Lead';




const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();
const Stack = createNativeStackNavigator();



function GrowthStack() {

  return (
    <Stack.Navigator initialRouteName="Growth" >
      <Stack.Screen name="Growth" component={Growth} options={{ header: (props) => <CustomHeader {...props} /> }} />
      <Stack.Screen
        name="Recommandation"
        options={{ header: ({ navigation }) => <CustomHeader navigation={navigation} backTitle={"Growth Share"} /> }}
        component={Recommandation}

      />
    </Stack.Navigator>
  );
}
function HomeStack() {
  return (
    <Stack.Navigator initialRouteName="Home">
      <Stack.Screen name="Home" component={Home} options={{ header: (props) => <CustomHeader {...props} /> }} />
      <Stack.Screen
        name="Post"
        options={{ header: ({ navigation }) => <CustomHeader navigation={navigation} backTitle={"Retour"} /> }}
        component={PostPage}

      />
    </Stack.Navigator>
  )
}

function LeadsStack() {
  return (
    <Stack.Navigator initialRouteName="Leads">
      <Stack.Screen name="Leads" component={Leads} options={{ header: (props) => <CustomHeader {...props} /> }} />
      <Stack.Screen
        name="Lead"
        options={{ header: ({ navigation }) => <CustomHeader navigation={navigation} backTitle={"Prospects"} /> }}
        component={Lead}

      />
    </Stack.Navigator>
  )
}

function ChatStack() {

  return (
    <Stack.Navigator initialRouteName="Chat" >
      <Stack.Screen name="Chat" component={Chat} options={{ header: (props) => <CustomHeader {...props} /> }} />
      <Stack.Screen
        name="Conversation"
        options={{ header: ({ navigation }) => <CustomHeader navigation={navigation} backTitle={"Messages"} /> }}
        component={Conversation}

      />
    </Stack.Navigator>
  );
}

function AppScreen() {

  return (
    <Layout>
      <Tab.Navigator tabBar={props => <CustomTabBar {...props} />} initialRouteName="Home" >
        <Tab.Screen options={{ picto: { red: HomePicto, grey: HomePictoG }, headerShown: false }} name="HomeStack" component={HomeStack} />
        <Tab.Screen options={{ picto: { red: LeadsPicto, grey: LeadsPictoG }, headerShown: false }} name="LeadsStack" component={LeadsStack} />
        <Tab.Screen options={{ picto: { red: PerformPicto, grey: PerformPictoG }, header: (props) => <CustomHeader {...props} /> }} name="Performances" component={Performances} />
        {/* <Tab.Screen options={{ picto: { red: ChatPicto, grey: ChatPictoG, notUnderline: true, size: "big" }, chat: true, headerShown: false }} name="ChatStack" component={ChatStack} /> */}
        {/* <Tab.Screen options={{ picto: { red: ToolPicto, grey: ToolPictoG }, header: (props) => <CustomHeader {...props} /> }} name="HonoTool" component={HonoTool} /> */}
        <Tab.Screen options={{ picto: { red: GrowthPicto, grey: GrowthPictoG }, headerShown: false }} name="GrowthShare" component={GrowthStack} />
      </Tab.Navigator>
    </Layout>
  );
}

const AuthStack = createNativeStackNavigator();

function MainNavigator() {
  return (
    <AuthStack.Navigator initialRouteName="Tab" screenOptions={{ headerShown: false }}>
      <AuthStack.Screen name="Tab" component={AppScreen} />
      <AuthStack.Screen name="Login" component={Login} />
    </AuthStack.Navigator>
  );
}



const App = () => {
  const [alert, setAlert] = useState(true)
  useEffect(() => {
    getAppInfos().then((res) => {
      if (res.data.appInfos.alertAppMessage) {
        Alert.alert(
          `${res.data.appInfos.alertAppMessageTitle}`,
          `${res.data.appInfos.alertAppMessageText}`,
          [
            {
              text: 'ok',
              onPress: async () => {
                setAlert(false)
              },
            },

          ]
        );
      }
      else {
        setAlert(false)
      }
    })
  }, []);

  return (
    <LogProvider>
      <DataProvider>
        <Layout>
          {
            !alert &&
            <NavigationContainer >
              <Drawer.Navigator
                initialRouteName="main"
                screenOptions={{
                  headerShown: false,
                  drawerStyle: { width: '80%' }
                }}
                drawerContent={props => <CustomDrawerContent {...props} />}
              >
                <Drawer.Screen name="main" component={MainNavigator} />
              </Drawer.Navigator>
            </NavigationContainer>
          }

        </Layout>
      </DataProvider>
    </LogProvider >
  );
};

export default App;








